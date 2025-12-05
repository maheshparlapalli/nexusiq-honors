import mongoose from 'mongoose';
const { Schema } = mongoose;
const FieldSchema = new Schema({
  key: { type: String, required: true },
  label: String,
  type: String,
  placeholder: String,
  position: { x: Number, y: Number },
  font: { size: Number, color: String, weight: String, family: String },
  size: Number
}, { _id: false });
const TemplateSchema = new Schema({
  client_id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  category: { type: String, required: true },
  layout: { background_url: String, width: Number, height: Number, orientation: String },
  fields: [FieldSchema],
  styles: { global_font_family: String, color_theme: String },
  meta: {
    default_expiry_months: { type: Number, default: null },
    allow_expiry_override: { type: Boolean, default: false },
    issued_by_label: String,
    signature_block: { show: Boolean, signature_url: String, name: String, designation: String },
    seal_url: String
  },
  version: { type: Number, required: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model('Template', TemplateSchema);
