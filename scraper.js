const { chromium } = require('playwright');

async function extrairJogos() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://seusite.com/jogos'); // troque pela URL real

  const jogos = await page.evaluate(() => {
    const cards = document.querySelectorAll('.game-card');
    const resultado = [];

    cards.forEach((card) => {
      const nome = card.querySelector('h2')?.innerText || '';
      const imagem = card.querySelector('img')?.src || '';
      const sinopse = card.querySelector('p')?.innerText || '';
      const notaMediaText = card.querySelector('.rating')?.innerText || '';
      const notaMedia = parseFloat(notaMediaText.replace(/[^\d.]/g, '')) || 0;

      const plataformas = Array.from(card.nextElementSibling?.querySelectorAll('.platform-card') || []).map(p => ({
        nome: p.querySelector('h3')?.innerText || '',
        preco: parseFloat((p.querySelector('p')?.innerText || '').replace(/[^\d,]/g, '').replace(',', '.')) || 0,
        nota: parseFloat(p.querySelector('.rating')?.innerText?.replace(/[^\d.]/g, '')) || 0
      }));

      resultado.push({ nome, imagem, sinopse, notaMedia, plataformas });
    });

    return resultado;
  });

  await browser.close();
  return jogos;
}

module.exports = extrairJogos;
