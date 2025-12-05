import puppeteer from 'puppeteer';
export async function renderHtmlToPdfAndPng(html){
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'], headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
  const pngBuffer = await page.screenshot({ fullPage: true, type: 'png' });
  await browser.close();
  return { pdfBuffer, pngBuffer };
}
