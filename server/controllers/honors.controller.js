import Honor from '../models/Honor.js';
import { v4 as uuidv4 } from 'uuid';
import { agenda } from '../agenda.js';
import Template from '../models/Template.js';
import { getSignedUrl } from '../services/s3.service.js';

function addSignedUrls(honor) {
  if (!honor) return honor;
  const result = { ...honor };
  if (result.assets) {
    result.assets = {
      ...result.assets,
      pdf_url: result.assets.pdf_key ? getSignedUrl(result.assets.pdf_key) : null,
      image_url: result.assets.image_key ? getSignedUrl(result.assets.image_key) : null
    };
  }
  return result;
}

export async function issueHonor(req, res){
  try {
    const body = req.body;
    const slug = (uuidv4().split('-')[0]).toUpperCase();
    const honor = new Honor({
      client_id: body.client_id || 'default',
      honor_type: body.honor_type || 1,
      event_type: body.event_type || 1,
      recipient: body.recipient,
      exam: body.exam,
      course: body.course,
      participation: body.participation,
      badge: body.badge,
      template_id: body.template_id || 'tpl_default',
      template_version: body.template_version || 1,
      issue_mode: body.issue_mode || 'auto',
      issued_by: body.issued_by || 'system',
      metadata: body.metadata || {},
      public_slug: slug,
      expiry_date: body.expiry_date || null
    });
    await honor.save();
    // enqueue job to generate assets
    await agenda.now('generate-assets', { honorId: honor._id.toString() });
    return res.json({ success:true, honor_id: honor._id, public_slug: slug, status: 'queued' });
  } catch(err){
    console.error(err);
    return res.status(500).json({ success:false, message: err.message });
  }
}

export async function regenerateHonor(req, res){
  try {
    const id = req.params.id;
    const honor = await Honor.findById(id);
    if(!honor) return res.status(404).json({ success:false, message: 'Not found' });
    await agenda.now('generate-assets', { honorId: honor._id.toString() });
    honor.audit.push({ action:'regenerate_requested', actor:'api', at: new Date() });
    await honor.save();
    return res.json({ success:true, message: 'Regeneration queued' });
  } catch(err){
    console.error(err);
    return res.status(500).json({ success:false, message: err.message });
  }
}

export async function publicView(req, res){
  try {
    const slug = req.params.slug;
    const honor = await Honor.findOne({ public_slug: slug }).lean();
    if(!honor) return res.status(404).json({ success:false, message: 'Not found' });
    return res.json({ success:true, data: addSignedUrls(honor) });
  } catch(err){
    console.error(err);
    return res.status(500).json({ success:false, message: err.message });
  }
}

export async function downloadHonor(req, res){
  try {
    const id = req.params.id;
    const type = req.query.type || 'pdf';
    const honor = await Honor.findById(id).lean();
    if(!honor) return res.status(404).json({ success:false, message: 'Not found' });
    const key = type === 'image' ? honor.assets?.image_key : honor.assets?.pdf_key;
    const url = key ? getSignedUrl(key) : null;
    return res.json({ success:true, url });
  } catch(err){
    console.error(err);
    return res.status(500).json({ success:false, message: err.message });
  }
}

export async function myHonors(req, res){
  try {
    const email = req.query.email;
    if(!email) return res.status(400).json({ success:false, message: 'Provide email in query for dev' });
    const honors = await Honor.find({ 'recipient.email': email }).lean();
    return res.json({ success:true, data: honors.map(addSignedUrls) });
  } catch(err){
    console.error(err);
    return res.status(500).json({ success:false, message: err.message });
  }
}

// Admin endpoints (minimal) - list, revoke
export async function listHonors(req, res){
  try {
    const q = req.query || {};
    const honors = await Honor.find(q).limit(100).lean();
    return res.json({ success:true, data: honors.map(addSignedUrls) });
  } catch(err){
    console.error(err);
    return res.status(500).json({ success:false, message: err.message });
  }
}

export async function revokeHonor(req, res){
  try {
    const id = req.params.id;
    const honor = await Honor.findById(id);
    if(!honor) return res.status(404).json({ success:false, message: 'Not found' });
    honor.status = 'revoked';
    honor.audit.push({ action:'revoked', actor:'api', at: new Date() });
    await honor.save();
    return res.json({ success:true, message: 'Revoked' });
  } catch(err){
    console.error(err);
    return res.status(500).json({ success:false, message: err.message });
  }
}
