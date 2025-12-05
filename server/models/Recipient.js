import mongoose from 'mongoose';
const { Schema } = mongoose;
const RecipientSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  user_id: { type: String, default: null },
  created_at: { type: Date, default: Date.now }
}, { timestamps: true });
export default mongoose.model('Recipient', RecipientSchema);
