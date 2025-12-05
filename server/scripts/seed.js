import mongoose from 'mongoose';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';
import Agenda from 'agenda';

dotenv.config();

const HONOR_TYPES = { CERTIFICATE: 1, BADGE: 2 };
const EVENT_TYPES = { COURSE: 1, EXAM: 2, PARTICIPATION: 3, CUSTOM: 4 };

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/nexusiq-honors';
const agenda = new Agenda({ db: { address: mongoUri, collection: 'agendaJobs' } });

const FieldSchema = new mongoose.Schema({
  key: { type: String, required: true },
  label: String,
  type: String,
  placeholder: String,
  position: { x: Number, y: Number },
  font: { size: Number, color: String, weight: String, family: String },
  size: Number
}, { _id: false });

const TemplateSchema = new mongoose.Schema({
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

const TemplateVersionSchema = new mongoose.Schema({
  template_id: { type: String, required: true },
  version: { type: Number, required: true },
  snapshot: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true });

const HonorSchema = new mongoose.Schema({
  client_id: { type: String, required: true },
  honor_type: { type: Number, enum: [1, 2], required: true },
  event_type: { type: Number, enum: [1, 2, 3, 4], required: true },
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
  assets: { pdf_url: String, image_url: String, qr_url: String },
  issue_mode: { type: String, enum: ['auto', 'manual', 'bulk', 'rule_based'], default: 'manual' },
  issued_by: String,
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  public_slug: { type: String, required: true, index: true },
  status: { type: String, enum: ['active', 'revoked', 'expired'], default: 'active' },
  expiry_date: { type: Date, default: null },
  audit: [{ action: String, actor: String, at: Date }]
}, { timestamps: true });

const RecipientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  user_id: { type: String, default: null },
  created_at: { type: Date, default: Date.now }
}, { timestamps: true });

const Template = mongoose.model('Template', TemplateSchema);
const TemplateVersion = mongoose.model('TemplateVersion', TemplateVersionSchema);
const Honor = mongoose.model('Honor', HonorSchema);
const Recipient = mongoose.model('Recipient', RecipientSchema);

const CLIENT_ID = 'nexsaa-demo';

function generateSlug() {
  return randomUUID().replace(/-/g, '').substring(0, 16);
}

const templateConfigs = [
  {
    honorType: HONOR_TYPES.CERTIFICATE,
    eventType: EVENT_TYPES.COURSE,
    name: 'Course Completion Certificate',
    type: 'certificate',
    category: 'course',
    layout: {
      background_url: '/templates/course-certificate-bg.png',
      width: 1056,
      height: 816,
      orientation: 'landscape'
    },
    fields: [
      { key: 'recipient_name', label: 'Recipient Name', type: 'text', position: { x: 528, y: 350 }, font: { size: 48, color: '#1a1a1a', weight: 'bold', family: 'Georgia' } },
      { key: 'course_title', label: 'Course Title', type: 'text', position: { x: 528, y: 420 }, font: { size: 28, color: '#333333', weight: 'normal', family: 'Arial' } },
      { key: 'completion_date', label: 'Completion Date', type: 'date', position: { x: 528, y: 500 }, font: { size: 18, color: '#666666', weight: 'normal', family: 'Arial' } },
      { key: 'duration', label: 'Course Duration', type: 'text', position: { x: 528, y: 540 }, font: { size: 16, color: '#666666', weight: 'normal', family: 'Arial' } }
    ],
    styles: { global_font_family: 'Georgia', color_theme: 'classic-blue' },
    meta: {
      default_expiry_months: null,
      allow_expiry_override: false,
      issued_by_label: 'Issued by NexSAA Academy',
      signature_block: { show: true, signature_url: '/signatures/director.png', name: 'Dr. Sarah Johnson', designation: 'Director of Education' },
      seal_url: '/seals/nexsaa-seal.png'
    }
  },
  {
    honorType: HONOR_TYPES.CERTIFICATE,
    eventType: EVENT_TYPES.EXAM,
    name: 'Exam Achievement Certificate',
    type: 'certificate',
    category: 'exam',
    layout: {
      background_url: '/templates/exam-certificate-bg.png',
      width: 1056,
      height: 816,
      orientation: 'landscape'
    },
    fields: [
      { key: 'recipient_name', label: 'Recipient Name', type: 'text', position: { x: 528, y: 320 }, font: { size: 48, color: '#1a1a1a', weight: 'bold', family: 'Georgia' } },
      { key: 'exam_title', label: 'Exam Title', type: 'text', position: { x: 528, y: 400 }, font: { size: 28, color: '#333333', weight: 'normal', family: 'Arial' } },
      { key: 'score', label: 'Score', type: 'text', position: { x: 528, y: 460 }, font: { size: 24, color: '#2e7d32', weight: 'bold', family: 'Arial' } },
      { key: 'rank', label: 'Rank', type: 'text', position: { x: 528, y: 510 }, font: { size: 20, color: '#1565c0', weight: 'bold', family: 'Arial' } },
      { key: 'attempt_date', label: 'Attempt Date', type: 'date', position: { x: 528, y: 560 }, font: { size: 16, color: '#666666', weight: 'normal', family: 'Arial' } }
    ],
    styles: { global_font_family: 'Georgia', color_theme: 'achievement-gold' },
    meta: {
      default_expiry_months: 24,
      allow_expiry_override: true,
      issued_by_label: 'Certified by NexSAA Examination Board',
      signature_block: { show: true, signature_url: '/signatures/examiner.png', name: 'Prof. Michael Chen', designation: 'Chief Examiner' },
      seal_url: '/seals/exam-seal.png'
    }
  },
  {
    honorType: HONOR_TYPES.CERTIFICATE,
    eventType: EVENT_TYPES.PARTICIPATION,
    name: 'Participation Certificate',
    type: 'certificate',
    category: 'participation',
    layout: {
      background_url: '/templates/participation-certificate-bg.png',
      width: 1056,
      height: 816,
      orientation: 'landscape'
    },
    fields: [
      { key: 'recipient_name', label: 'Recipient Name', type: 'text', position: { x: 528, y: 340 }, font: { size: 44, color: '#1a1a1a', weight: 'bold', family: 'Georgia' } },
      { key: 'event_title', label: 'Event Title', type: 'text', position: { x: 528, y: 420 }, font: { size: 26, color: '#333333', weight: 'normal', family: 'Arial' } },
      { key: 'event_date', label: 'Event Date', type: 'date', position: { x: 528, y: 490 }, font: { size: 18, color: '#666666', weight: 'normal', family: 'Arial' } },
      { key: 'location', label: 'Location', type: 'text', position: { x: 528, y: 530 }, font: { size: 16, color: '#666666', weight: 'normal', family: 'Arial' } }
    ],
    styles: { global_font_family: 'Georgia', color_theme: 'event-purple' },
    meta: {
      default_expiry_months: null,
      allow_expiry_override: false,
      issued_by_label: 'NexSAA Events',
      signature_block: { show: true, signature_url: '/signatures/coordinator.png', name: 'Emily Davis', designation: 'Event Coordinator' },
      seal_url: '/seals/event-seal.png'
    }
  },
  {
    honorType: HONOR_TYPES.CERTIFICATE,
    eventType: EVENT_TYPES.CUSTOM,
    name: 'Custom Achievement Certificate',
    type: 'certificate',
    category: 'custom',
    layout: {
      background_url: '/templates/custom-certificate-bg.png',
      width: 1056,
      height: 816,
      orientation: 'landscape'
    },
    fields: [
      { key: 'recipient_name', label: 'Recipient Name', type: 'text', position: { x: 528, y: 350 }, font: { size: 48, color: '#1a1a1a', weight: 'bold', family: 'Georgia' } },
      { key: 'achievement_title', label: 'Achievement', type: 'text', position: { x: 528, y: 430 }, font: { size: 28, color: '#333333', weight: 'normal', family: 'Arial' } },
      { key: 'description', label: 'Description', type: 'textarea', position: { x: 528, y: 500 }, font: { size: 16, color: '#555555', weight: 'normal', family: 'Arial' } },
      { key: 'issue_date', label: 'Issue Date', type: 'date', position: { x: 528, y: 580 }, font: { size: 16, color: '#666666', weight: 'normal', family: 'Arial' } }
    ],
    styles: { global_font_family: 'Georgia', color_theme: 'custom-teal' },
    meta: {
      default_expiry_months: null,
      allow_expiry_override: true,
      issued_by_label: 'NexSAA Recognition Program',
      signature_block: { show: true, signature_url: '/signatures/ceo.png', name: 'Robert Williams', designation: 'CEO' },
      seal_url: '/seals/nexsaa-seal.png'
    }
  },
  {
    honorType: HONOR_TYPES.BADGE,
    eventType: EVENT_TYPES.COURSE,
    name: 'Course Completion Badge',
    type: 'badge',
    category: 'course',
    layout: {
      background_url: '/templates/course-badge-bg.png',
      width: 400,
      height: 400,
      orientation: 'square'
    },
    fields: [
      { key: 'badge_name', label: 'Badge Name', type: 'text', position: { x: 200, y: 280 }, font: { size: 24, color: '#ffffff', weight: 'bold', family: 'Arial' } },
      { key: 'course_title', label: 'Course', type: 'text', position: { x: 200, y: 320 }, font: { size: 14, color: '#e0e0e0', weight: 'normal', family: 'Arial' } },
      { key: 'level', label: 'Level', type: 'text', position: { x: 200, y: 350 }, font: { size: 16, color: '#ffd700', weight: 'bold', family: 'Arial' } }
    ],
    styles: { global_font_family: 'Arial', color_theme: 'badge-blue' },
    meta: {
      default_expiry_months: null,
      allow_expiry_override: false,
      issued_by_label: 'NexSAA Academy',
      signature_block: { show: false },
      seal_url: null
    }
  },
  {
    honorType: HONOR_TYPES.BADGE,
    eventType: EVENT_TYPES.EXAM,
    name: 'Exam Proficiency Badge',
    type: 'badge',
    category: 'exam',
    layout: {
      background_url: '/templates/exam-badge-bg.png',
      width: 400,
      height: 400,
      orientation: 'square'
    },
    fields: [
      { key: 'badge_name', label: 'Badge Name', type: 'text', position: { x: 200, y: 270 }, font: { size: 22, color: '#ffffff', weight: 'bold', family: 'Arial' } },
      { key: 'exam_title', label: 'Exam', type: 'text', position: { x: 200, y: 310 }, font: { size: 14, color: '#e0e0e0', weight: 'normal', family: 'Arial' } },
      { key: 'score_badge', label: 'Score', type: 'text', position: { x: 200, y: 340 }, font: { size: 18, color: '#00ff88', weight: 'bold', family: 'Arial' } },
      { key: 'level', label: 'Level', type: 'text', position: { x: 200, y: 370 }, font: { size: 14, color: '#ffd700', weight: 'bold', family: 'Arial' } }
    ],
    styles: { global_font_family: 'Arial', color_theme: 'badge-gold' },
    meta: {
      default_expiry_months: 12,
      allow_expiry_override: true,
      issued_by_label: 'NexSAA Certifications',
      signature_block: { show: false },
      seal_url: null
    }
  },
  {
    honorType: HONOR_TYPES.BADGE,
    eventType: EVENT_TYPES.PARTICIPATION,
    name: 'Event Participation Badge',
    type: 'badge',
    category: 'participation',
    layout: {
      background_url: '/templates/participation-badge-bg.png',
      width: 400,
      height: 400,
      orientation: 'square'
    },
    fields: [
      { key: 'badge_name', label: 'Badge Name', type: 'text', position: { x: 200, y: 280 }, font: { size: 22, color: '#ffffff', weight: 'bold', family: 'Arial' } },
      { key: 'event_title', label: 'Event', type: 'text', position: { x: 200, y: 320 }, font: { size: 14, color: '#e0e0e0', weight: 'normal', family: 'Arial' } },
      { key: 'event_year', label: 'Year', type: 'text', position: { x: 200, y: 350 }, font: { size: 16, color: '#ff88ff', weight: 'bold', family: 'Arial' } }
    ],
    styles: { global_font_family: 'Arial', color_theme: 'badge-purple' },
    meta: {
      default_expiry_months: null,
      allow_expiry_override: false,
      issued_by_label: 'NexSAA Events',
      signature_block: { show: false },
      seal_url: null
    }
  },
  {
    honorType: HONOR_TYPES.BADGE,
    eventType: EVENT_TYPES.CUSTOM,
    name: 'Special Achievement Badge',
    type: 'badge',
    category: 'custom',
    layout: {
      background_url: '/templates/custom-badge-bg.png',
      width: 400,
      height: 400,
      orientation: 'square'
    },
    fields: [
      { key: 'badge_name', label: 'Badge Name', type: 'text', position: { x: 200, y: 270 }, font: { size: 24, color: '#ffffff', weight: 'bold', family: 'Arial' } },
      { key: 'achievement', label: 'Achievement', type: 'text', position: { x: 200, y: 310 }, font: { size: 14, color: '#e0e0e0', weight: 'normal', family: 'Arial' } },
      { key: 'criteria', label: 'Criteria', type: 'text', position: { x: 200, y: 340 }, font: { size: 12, color: '#aaaaaa', weight: 'normal', family: 'Arial' } },
      { key: 'level', label: 'Level', type: 'text', position: { x: 200, y: 370 }, font: { size: 16, color: '#00ffff', weight: 'bold', family: 'Arial' } }
    ],
    styles: { global_font_family: 'Arial', color_theme: 'badge-teal' },
    meta: {
      default_expiry_months: null,
      allow_expiry_override: true,
      issued_by_label: 'NexSAA Recognition',
      signature_block: { show: false },
      seal_url: null
    }
  }
];

const sampleRecipients = [
  { name: 'Alice Johnson', email: 'alice.johnson@example.com', user_id: 'user_001' },
  { name: 'Bob Smith', email: 'bob.smith@example.com', user_id: 'user_002' },
  { name: 'Carol Williams', email: 'carol.williams@example.com', user_id: 'user_003' },
  { name: 'David Brown', email: 'david.brown@example.com', user_id: 'user_004' },
  { name: 'Eva Martinez', email: 'eva.martinez@example.com', user_id: 'user_005' },
  { name: 'Frank Lee', email: 'frank.lee@example.com', user_id: 'user_006' },
  { name: 'Grace Kim', email: 'grace.kim@example.com', user_id: 'user_007' },
  { name: 'Henry Taylor', email: 'henry.taylor@example.com', user_id: 'user_008' }
];

const sampleHonorData = {
  [EVENT_TYPES.COURSE]: [
    { course_id: 'course_001', title: 'Advanced JavaScript Fundamentals', completion_percentage: 100, completion_date: new Date('2024-11-15'), duration: '40 hours', batch_id: 'batch_2024_q4' },
    { course_id: 'course_002', title: 'React & TypeScript Masterclass', completion_percentage: 100, completion_date: new Date('2024-10-20'), duration: '60 hours', batch_id: 'batch_2024_q3' },
    { course_id: 'course_003', title: 'Node.js Backend Development', completion_percentage: 100, completion_date: new Date('2024-09-10'), duration: '50 hours', batch_id: 'batch_2024_q3' },
    { course_id: 'course_004', title: 'MongoDB Database Design', completion_percentage: 100, completion_date: new Date('2024-08-05'), duration: '30 hours', batch_id: 'batch_2024_q2' }
  ],
  [EVENT_TYPES.EXAM]: [
    { exam_id: 'exam_001', exam_title: 'JavaScript Certification Exam', secured_score: 92, total_score: 100, percentage: 92, rank: 5, passed: true, attempt_date: new Date('2024-11-20'), attempt_type: 'first', batch_id: 'exam_batch_001' },
    { exam_id: 'exam_002', exam_title: 'AWS Cloud Practitioner', secured_score: 88, total_score: 100, percentage: 88, rank: 12, passed: true, attempt_date: new Date('2024-10-15'), attempt_type: 'first', batch_id: 'exam_batch_002' },
    { exam_id: 'exam_003', exam_title: 'Python Professional Certification', secured_score: 95, total_score: 100, percentage: 95, rank: 2, passed: true, attempt_date: new Date('2024-09-25'), attempt_type: 'first', batch_id: 'exam_batch_003' },
    { exam_id: 'exam_004', exam_title: 'Data Science Fundamentals', secured_score: 85, total_score: 100, percentage: 85, rank: 18, passed: true, attempt_date: new Date('2024-08-30'), attempt_type: 'second', batch_id: 'exam_batch_004' }
  ],
  [EVENT_TYPES.PARTICIPATION]: [
    { event_id: 'event_001', event_title: 'TechConf 2024 Annual Summit', event_date: new Date('2024-11-01'), location: 'San Francisco, CA' },
    { event_id: 'event_002', event_title: 'Hackathon: Code for Good', event_date: new Date('2024-10-05'), location: 'New York, NY' },
    { event_id: 'event_003', event_title: 'AI/ML Workshop Series', event_date: new Date('2024-09-15'), location: 'Austin, TX' },
    { event_id: 'event_004', event_title: 'DevOps Community Meetup', event_date: new Date('2024-08-20'), location: 'Seattle, WA' }
  ],
  [EVENT_TYPES.CUSTOM]: [
    { achievement: 'Outstanding Contribution Award', description: 'For exceptional contributions to open source projects' },
    { achievement: 'Innovation Excellence', description: 'For developing innovative solutions that improved team productivity by 40%' },
    { achievement: 'Mentorship Recognition', description: 'For outstanding mentorship and guidance to junior developers' },
    { achievement: 'Community Champion', description: 'For active participation and leadership in developer community' }
  ]
};

const badgeData = {
  [EVENT_TYPES.COURSE]: [
    { badge_id: 'badge_course_001', badge_name: 'JavaScript Master', level: 3, criteria: 'Complete all JavaScript courses with 90%+ score' },
    { badge_id: 'badge_course_002', badge_name: 'React Expert', level: 3, criteria: 'Complete React & TypeScript Masterclass' },
    { badge_id: 'badge_course_003', badge_name: 'Backend Developer', level: 2, criteria: 'Complete Node.js Backend Development' },
    { badge_id: 'badge_course_004', badge_name: 'Database Pro', level: 2, criteria: 'Complete MongoDB Database Design' }
  ],
  [EVENT_TYPES.EXAM]: [
    { badge_id: 'badge_exam_001', badge_name: 'JS Certified', level: 3, criteria: 'Pass JavaScript Certification with 85%+' },
    { badge_id: 'badge_exam_002', badge_name: 'Cloud Certified', level: 2, criteria: 'Pass AWS Cloud Practitioner exam' },
    { badge_id: 'badge_exam_003', badge_name: 'Python Certified', level: 3, criteria: 'Pass Python Professional Certification' },
    { badge_id: 'badge_exam_004', badge_name: 'Data Science Badge', level: 2, criteria: 'Pass Data Science Fundamentals exam' }
  ],
  [EVENT_TYPES.PARTICIPATION]: [
    { badge_id: 'badge_part_001', badge_name: 'Conference Attendee', level: 1, criteria: 'Attend TechConf 2024' },
    { badge_id: 'badge_part_002', badge_name: 'Hackathon Hero', level: 2, criteria: 'Participate in Hackathon' },
    { badge_id: 'badge_part_003', badge_name: 'Workshop Graduate', level: 1, criteria: 'Complete AI/ML Workshop' },
    { badge_id: 'badge_part_004', badge_name: 'Community Member', level: 1, criteria: 'Attend community meetup' }
  ],
  [EVENT_TYPES.CUSTOM]: [
    { badge_id: 'badge_custom_001', badge_name: 'Star Contributor', level: 3, criteria: 'Outstanding open source contributions' },
    { badge_id: 'badge_custom_002', badge_name: 'Innovator', level: 3, criteria: 'Develop innovative solutions' },
    { badge_id: 'badge_custom_003', badge_name: 'Mentor Badge', level: 2, criteria: 'Mentor junior developers' },
    { badge_id: 'badge_custom_004', badge_name: 'Community Star', level: 2, criteria: 'Active community participation' }
  ]
};

async function seed() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/nexusiq-honors';
  
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  console.log('\n--- Clearing existing data ---');
  await Template.deleteMany({ client_id: CLIENT_ID });
  await TemplateVersion.deleteMany({});
  await Honor.deleteMany({ client_id: CLIENT_ID });
  await Recipient.deleteMany({});
  console.log('Cleared existing seed data');

  console.log('\n--- Creating Recipients ---');
  const createdRecipients = await Recipient.insertMany(sampleRecipients);
  console.log(`Created ${createdRecipients.length} recipients`);

  console.log('\n--- Creating Templates ---');
  const createdTemplates = [];
  for (const config of templateConfigs) {
    const template = await Template.create({
      client_id: CLIENT_ID,
      name: config.name,
      type: config.type,
      category: config.category,
      layout: config.layout,
      fields: config.fields,
      styles: config.styles,
      meta: config.meta,
      version: 1,
      active: true
    });
    
    await TemplateVersion.create({
      template_id: template._id.toString(),
      version: 1,
      snapshot: template.toObject()
    });
    
    createdTemplates.push({ ...config, templateId: template._id.toString() });
    console.log(`  Created template: ${config.name} (${config.type}/${config.category})`);
  }
  console.log(`Created ${createdTemplates.length} templates with versions`);

  console.log('\n--- Creating Honors ---');
  let honorCount = 0;
  
  for (const templateConfig of createdTemplates) {
    const { honorType, eventType, templateId } = templateConfig;
    const eventDataArray = sampleHonorData[eventType];
    const badgeDataArray = badgeData[eventType];
    
    for (let i = 0; i < 2; i++) {
      const recipient = sampleRecipients[honorCount % sampleRecipients.length];
      const eventData = eventDataArray[i % eventDataArray.length];
      const badge = badgeDataArray[i % badgeDataArray.length];
      
      const honor = {
        client_id: CLIENT_ID,
        honor_type: honorType,
        event_type: eventType,
        recipient: {
          user_id: recipient.user_id,
          name: recipient.name,
          email: recipient.email
        },
        template_id: templateId,
        template_version: 1,
        assets: {
          pdf_url: null,
          image_url: null,
          qr_url: null
        },
        issue_mode: 'manual',
        issued_by: 'NexSAA Admin',
        metadata: {},
        public_slug: generateSlug(),
        status: 'active',
        expiry_date: templateConfig.meta.default_expiry_months 
          ? new Date(Date.now() + templateConfig.meta.default_expiry_months * 30 * 24 * 60 * 60 * 1000)
          : null,
        audit: [{ action: 'created', actor: 'seed_script', at: new Date() }]
      };

      if (eventType === EVENT_TYPES.COURSE) {
        honor.course = eventData;
      } else if (eventType === EVENT_TYPES.EXAM) {
        honor.exam = eventData;
      } else if (eventType === EVENT_TYPES.PARTICIPATION) {
        honor.participation = eventData;
      } else if (eventType === EVENT_TYPES.CUSTOM) {
        honor.metadata = eventData;
      }

      if (honorType === HONOR_TYPES.BADGE) {
        honor.badge = badge;
      }

      const createdHonor = await Honor.create(honor);
      honorCount++;
      
      await agenda.schedule('in 1 second', 'generate-assets', { honorId: createdHonor._id.toString() });
      
      const honorTypeLabel = honorType === HONOR_TYPES.CERTIFICATE ? 'Certificate' : 'Badge';
      const eventTypeLabel = Object.keys(EVENT_TYPES).find(k => EVENT_TYPES[k] === eventType);
      console.log(`  Created ${honorTypeLabel} for ${recipient.name} (${eventTypeLabel}) - Job queued`);
    }
  }

  console.log(`\nCreated ${honorCount} honors total`);
  console.log('PDF/Image generation jobs have been queued for all honors');

  console.log('\n--- Seed Summary ---');
  const templateCount = await Template.countDocuments({ client_id: CLIENT_ID });
  const versionCount = await TemplateVersion.countDocuments();
  const totalHonors = await Honor.countDocuments({ client_id: CLIENT_ID });
  const recipientCount = await Recipient.countDocuments();
  
  console.log(`Templates: ${templateCount}`);
  console.log(`Template Versions: ${versionCount}`);
  console.log(`Honors: ${totalHonors}`);
  console.log(`Recipients: ${recipientCount}`);
  
  console.log('\n--- Honor Type Breakdown ---');
  const certCount = await Honor.countDocuments({ client_id: CLIENT_ID, honor_type: HONOR_TYPES.CERTIFICATE });
  const badgeCount = await Honor.countDocuments({ client_id: CLIENT_ID, honor_type: HONOR_TYPES.BADGE });
  console.log(`Certificates: ${certCount}`);
  console.log(`Badges: ${badgeCount}`);
  
  console.log('\n--- Event Type Breakdown ---');
  for (const [name, value] of Object.entries(EVENT_TYPES)) {
    const count = await Honor.countDocuments({ client_id: CLIENT_ID, event_type: value });
    console.log(`${name}: ${count}`);
  }

  console.log('\nNote: The worker process will generate PDFs and upload to S3.');
  console.log('Make sure the worker is running: npm run worker or via the workflow');
  
  await agenda.stop();
  await mongoose.connection.close();
  console.log('\nDatabase connection closed. Seeding complete!');
}

async function run() {
  try {
    await agenda.start();
    await seed();
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

run();
