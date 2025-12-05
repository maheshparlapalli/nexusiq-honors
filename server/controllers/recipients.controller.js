import Recipient from '../models/Recipient.js';

export async function createRecipient(req, res){
  try {
    const body = req.body;
    const r = new Recipient({ name: body.name, email: body.email, user_id: body.user_id || null });
    await r.save();
    return res.json({ success:true, data: r });
  } catch(err){
    console.error(err);
    return res.status(500).json({ success:false, message: err.message });
  }
}

export async function getRecipientByEmail(req, res){
  try {
    const email = req.params.email;
    const r = await Recipient.findOne({ email }).lean();
    if(!r) return res.status(404).json({ success:false, message: 'Not found' });
    return res.json({ success:true, data: r });
  } catch(err){
    console.error(err);
    return res.status(500).json({ success:false, message: err.message });
  }
}
