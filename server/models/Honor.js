import mongoose from 'mongoose';
const { Schema } = mongoose;
const HonorSchema = new Schema({
  client_id: { type: String, required: true },
  honor_type: { type: Number, enum: [1,2], required: true },
  event_type: { type: Number, enum: [1,2,3,4], required: true },
  recipient: {
    user_id: { type: String, default: null },
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  exam: {
    exam_id: String,
    exam_title: String,
    secured_score: Number,
    total_score: Number,
    percentage: Number,
    rank: Number,
    passed: Boolean,
    attempt_date: Date,
    attempt_type: String,
    batch_id: String
  },
  course: {
    course_id: String,
    title: String,
    completion_percentage: Number,
    completion_date: Date,
    duration: String,
    batch_id: String
  },
  participation: {
    event_id: String,
    event_title: String,
    event_date: Date,
    location: String
  },
  badge: {
    badge_id: String,
    badge_name: String,
    level: Number,
    criteria: String
  },
  template_id: { type: String, required: true },
  template_version: { type: Number, required: true },
  assets: { pdf_key: String, image_key: String, pdf_url: String, image_url: String, qr_url: String },
  issue_mode: { type: String, enum: ['auto','manual','bulk','rule_based'], default: 'manual' },
  issued_by: String,
  metadata: { type: Schema.Types.Mixed, default: {} },
  public_slug: { type: String, required: true, index: true },
  status: { type: String, enum: ['active','revoked','expired'], default: 'active' },
  expiry_date: { type: Date, default: null },
  audit: [{ action: String, actor: String, at: Date }]
}, { timestamps: true });
export default mongoose.model('Honor', HonorSchema);
