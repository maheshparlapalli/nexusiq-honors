import mongoose from 'mongoose';
const { Schema } = mongoose;
const TemplateVersionSchema = new Schema({
  template_id: { type: String, required: true },
  version: { type: Number, required: true },
  snapshot: { type: Schema.Types.Mixed, required: true },
}, { timestamps: true });
export default mongoose.model('TemplateVersion', TemplateVersionSchema);
