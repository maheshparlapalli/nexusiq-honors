import Template from '../models/Template.js';
import TemplateVersion from '../models/TemplateVersion.js';

export async function createTemplate(req, res){
  try {
    const body = req.body;
    const tpl = new Template(body);
    await tpl.save();
    // create version snapshot
    const ver = new TemplateVersion({ template_id: tpl._id.toString(), version: tpl.version, snapshot: body });
    await ver.save();
    return res.json({ success:true, data: tpl });
  } catch(err){
    console.error(err);
    return res.status(500).json({ success:false, message: err.message });
  }
}

export async function updateTemplate(req, res){
  try {
    const id = req.params.id;
    const body = req.body;
    const tpl = await Template.findByIdAndUpdate(id, body, { new: true });
    if(!tpl) return res.status(404).json({ success:false, message: 'Not found' });
    const ver = new TemplateVersion({ template_id: tpl._id.toString(), version: tpl.version, snapshot: body });
    await ver.save();
    return res.json({ success:true, data: tpl });
  } catch(err){
    console.error(err);
    return res.status(500).json({ success:false, message: err.message });
  }
}

export async function getTemplate(req, res){
  try {
    const id = req.params.id;
    const tpl = await Template.findById(id).lean();
    if(!tpl) return res.status(404).json({ success:false, message: 'Not found' });
    return res.json({ success:true, data: tpl });
  } catch(err){
    console.error(err);
    return res.status(500).json({ success:false, message: err.message });
  }
}

export async function listTemplates(req, res){
  try {
    const tpls = await Template.find({}).limit(100).lean();
    return res.json({ success:true, data: tpls });
  } catch(err){
    console.error(err);
    return res.status(500).json({ success:false, message: err.message });
  }
}

export async function previewTemplate(req, res){
  try {
    const id = req.params.id;
    const tpl = await Template.findById(id).lean();
    if(!tpl) return res.status(404).json({ success:false, message: 'Not found' });
    // For now, return background url and fields
    return res.json({ success:true, data: { preview_url: tpl.layout?.background_url, fields: tpl.fields } });
  } catch(err){
    console.error(err);
    return res.status(500).json({ success:false, message: err.message });
  }
}
