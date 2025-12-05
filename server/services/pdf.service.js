import puppeteer from 'puppeteer';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function getChromiumPath() {
  try {
    const { stdout } = await execAsync('which chromium');
    return stdout.trim();
  } catch (error) {
    console.log('Using default Puppeteer Chromium');
    return undefined;
  }
}

export async function renderHtmlToPdfAndPng(html){
  const chromiumPath = await getChromiumPath();
  
  const browser = await puppeteer.launch({ 
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--single-process'
    ], 
    headless: 'new',
    executablePath: chromiumPath
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  
  const pdfBuffer = await page.pdf({ 
    format: 'A4', 
    printBackground: true,
    margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
  });
  
  const pngBuffer = await page.screenshot({ 
    fullPage: true, 
    type: 'png',
    omitBackground: false
  });
  
  await browser.close();
  return { pdfBuffer, pngBuffer };
}
