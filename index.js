const express = require('express');
const extrairJogos = require('./scraper');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/atualizar-jogos', async (req, res) => {
  try {
    const jogos = await extrairJogos();

    for (const jogo of jogos) {
      const [rows] = await db.execute(
        'INSERT INTO jogos (nome, imagem, sinopse, nota_media) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE imagem=?, sinopse=?, nota_media=?',
        [jogo.nome, jogo.imagem, jogo.sinopse, jogo.notaMedia, jogo.imagem, jogo.sinopse, jogo.notaMedia]
      );

      const jogoId = rows.insertId || (
        await db.query('SELECT id FROM jogos WHERE nome = ?', [jogo.nome])
      )[0][0]?.id;

      // Remove plataformas antigas
      await db.execute('DELETE FROM plataformas WHERE jogo_id = ?', [jogoId]);

      for (const plataforma of jogo.plataformas) {
        await db.execute(
          'INSERT INTO plataformas (jogo_id, nome, preco, nota) VALUES (?, ?, ?, ?)',
          [jogoId, plataforma.nome, plataforma.preco, plataforma.nota]
        );
      }
    }

    res.status(200).send({ mensagem: 'Jogos atualizados com sucesso!', total: jogos.length });
  } catch (err) {
    console.error(err);
    res.status(500).send({ erro: 'Erro ao atualizar os jogos' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
