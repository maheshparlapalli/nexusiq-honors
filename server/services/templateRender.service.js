import Template from '../models/Template.js';
export async function renderTemplateToHtml(templateId, honor){
  const tpl = await Template.findById(templateId).lean();
  // Very simple renderer: replace {{key}} in tpl.layout.background_url not used - build simple HTML from fields and honor
  let html = `<html><body style="font-family: Arial, sans-serif; text-align:center; padding:40px;">`;
  html += `<h1>${tpl?.name || 'Certificate'}</h1>`;
  html += `<h2>${honor.recipient?.name || ''}</h2>`;
  html += `<p>${honor.template_id || ''}</p>`;
  html += `</body></html>`;
  return html;
}
