import { agenda } from './agenda.js';
import Honor from './models/Honor.js';
import { renderHtmlToPdfAndPng } from './services/pdf.service.js';
import { uploadBuffer } from './services/s3.service.js';
(async function(){
  agenda.define('generate-assets', { concurrency: 2 }, async (job) => {
    const { honorId } = job.attrs.data as any;
    console.log('Worker processing honor', honorId);
    const honor = await Honor.findById(honorId).lean();
    if(!honor) return;
    const html = `
      <html><body style="font-family: Arial, sans-serif; text-align:center; padding:40px;">
        <h1>Certificate</h1>
        <h2>${honor.recipient?.name || ''}</h2>
        <p>For: ${honor.template_id}</p>
        <p>Issued on: ${new Date(honor.createdAt).toLocaleDateString()}</p>
      </body></html>
    `;
    const { pdfBuffer, pngBuffer } = await renderHtmlToPdfAndPng(html);
    const pdfKey = `certificates/${honorId}.pdf`;
    const pngKey = `certificates/${honorId}.png`;
    const pdfUrl = await uploadBuffer(pdfBuffer, pdfKey, 'application/pdf');
    const imgUrl = await uploadBuffer(pngBuffer, pngKey, 'image/png');
    await Honor.findByIdAndUpdate(honorId, { assets: { pdf_url: pdfUrl, image_url: imgUrl }});
    console.log('Assets uploaded for honor', honorId);
  });
  await agenda.start();
  console.log('Agenda worker started');
})();
