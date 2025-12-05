import { agenda } from './agenda.js';
import Honor from './models/Honor.js';
import Template from './models/Template.js';
import { renderHtmlToPdfAndPng } from './services/pdf.service.js';
import { uploadBuffer } from './services/s3.service.js';

const HONOR_TYPES: Record<number, string> = { 1: 'Certificate', 2: 'Badge' };
const EVENT_TYPES: Record<number, string> = { 1: 'Course Completion', 2: 'Exam Achievement', 3: 'Participation', 4: 'Special Achievement' };

function formatDate(date: Date | string | undefined): string {
  if (!date) return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function generateCertificateHtml(honor: any, template: any): string {
  const isBadge = honor.honor_type === 2;
  const eventType = EVENT_TYPES[honor.event_type] || 'Achievement';
  
  let achievementDetails = '';
  let achievementTitle = '';
  
  if (honor.course) {
    achievementTitle = honor.course.title || 'Course Completion';
    achievementDetails = `
      <p class="detail">Completed on: ${formatDate(honor.course.completion_date)}</p>
      <p class="detail">Duration: ${honor.course.duration || 'N/A'}</p>
    `;
  } else if (honor.exam) {
    achievementTitle = honor.exam.exam_title || 'Exam Achievement';
    achievementDetails = `
      <p class="detail">Score: ${honor.exam.secured_score}/${honor.exam.total_score} (${honor.exam.percentage}%)</p>
      <p class="detail">Rank: #${honor.exam.rank}</p>
      <p class="detail">Date: ${formatDate(honor.exam.attempt_date)}</p>
    `;
  } else if (honor.participation) {
    achievementTitle = honor.participation.event_title || 'Event Participation';
    achievementDetails = `
      <p class="detail">Event Date: ${formatDate(honor.participation.event_date)}</p>
      <p class="detail">Location: ${honor.participation.location || 'N/A'}</p>
    `;
  } else if (honor.badge) {
    achievementTitle = honor.badge.badge_name || 'Achievement Badge';
    achievementDetails = `
      <p class="detail">Level: ${honor.badge.level}</p>
      <p class="detail">Criteria: ${honor.badge.criteria || 'N/A'}</p>
    `;
  }

  if (isBadge) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Arial', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 400px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
          }
          .badge-container {
            width: 300px;
            height: 300px;
            background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3), inset 0 2px 10px rgba(255,255,255,0.1);
            border: 4px solid #ffd700;
          }
          .badge-icon {
            font-size: 48px;
            margin-bottom: 10px;
          }
          .badge-name {
            color: #ffd700;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .recipient-name {
            color: #ffffff;
            font-size: 16px;
            margin-bottom: 5px;
          }
          .level {
            color: #00ff88;
            font-size: 14px;
            font-weight: bold;
          }
          .event-type {
            color: #aaa;
            font-size: 11px;
            margin-top: 10px;
            text-transform: uppercase;
          }
        </style>
      </head>
      <body>
        <div class="badge-container">
          <div class="badge-icon">🏆</div>
          <div class="badge-name">${honor.badge?.badge_name || achievementTitle}</div>
          <div class="recipient-name">${honor.recipient?.name || 'Recipient'}</div>
          <div class="level">Level ${honor.badge?.level || 1}</div>
          <div class="event-type">${eventType}</div>
        </div>
      </body>
      </html>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Georgia', serif;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f5f5f5;
          padding: 20px;
        }
        .certificate {
          width: 800px;
          min-height: 600px;
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border: 3px solid #1a365d;
          padding: 50px;
          position: relative;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        .certificate::before {
          content: '';
          position: absolute;
          top: 10px;
          left: 10px;
          right: 10px;
          bottom: 10px;
          border: 2px solid #c9a227;
          pointer-events: none;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          color: #1a365d;
          font-weight: bold;
          letter-spacing: 3px;
          margin-bottom: 10px;
        }
        .title {
          font-size: 42px;
          color: #1a365d;
          text-transform: uppercase;
          letter-spacing: 5px;
          margin-bottom: 10px;
        }
        .subtitle {
          font-size: 16px;
          color: #666;
          font-style: italic;
        }
        .content {
          text-align: center;
          margin: 40px 0;
        }
        .presented-to {
          font-size: 14px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 15px;
        }
        .recipient-name {
          font-size: 36px;
          color: #c9a227;
          font-weight: bold;
          margin-bottom: 20px;
          border-bottom: 2px solid #c9a227;
          display: inline-block;
          padding-bottom: 10px;
        }
        .achievement-title {
          font-size: 20px;
          color: #333;
          margin-bottom: 15px;
        }
        .detail {
          font-size: 14px;
          color: #666;
          margin: 5px 0;
        }
        .footer {
          display: flex;
          justify-content: space-between;
          margin-top: 50px;
          padding-top: 30px;
        }
        .signature-block {
          text-align: center;
          width: 200px;
        }
        .signature-line {
          border-top: 1px solid #333;
          padding-top: 10px;
          margin-top: 40px;
        }
        .signature-name {
          font-size: 14px;
          font-weight: bold;
          color: #333;
        }
        .signature-title {
          font-size: 12px;
          color: #666;
        }
        .date-block {
          text-align: center;
        }
        .issue-date {
          font-size: 14px;
          color: #666;
        }
        .seal {
          position: absolute;
          bottom: 60px;
          right: 60px;
          width: 80px;
          height: 80px;
          border: 3px solid #c9a227;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 12px;
          color: #c9a227;
          text-transform: uppercase;
          font-weight: bold;
        }
        .event-badge {
          background: #1a365d;
          color: white;
          padding: 5px 15px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: inline-block;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="header">
          <div class="logo">NEXSAA</div>
          <div class="title">Certificate</div>
          <div class="subtitle">of ${eventType}</div>
        </div>
        
        <div class="content">
          <div class="event-badge">${eventType}</div>
          <div class="presented-to">This is to certify that</div>
          <div class="recipient-name">${honor.recipient?.name || 'Recipient Name'}</div>
          <div class="achievement-title">${achievementTitle}</div>
          ${achievementDetails}
        </div>
        
        <div class="footer">
          <div class="signature-block">
            <div class="signature-line">
              <div class="signature-name">${template?.meta?.signature_block?.name || 'Director'}</div>
              <div class="signature-title">${template?.meta?.signature_block?.designation || 'NexSAA Academy'}</div>
            </div>
          </div>
          <div class="date-block">
            <div class="issue-date">Issued on: ${formatDate(honor.createdAt)}</div>
            <div class="issue-date">Certificate ID: ${honor.public_slug}</div>
          </div>
        </div>
        
        <div class="seal">VERIFIED</div>
      </div>
    </body>
    </html>
  `;
}

(async function(){
  agenda.define('generate-assets', { concurrency: 2 }, async (job) => {
    const { honorId } = job.attrs.data as any;
    console.log('Worker processing honor', honorId);
    
    try {
      const honor = await Honor.findById(honorId).lean();
      if(!honor) {
        console.log('Honor not found:', honorId);
        return;
      }
      
      const template = await Template.findById(honor.template_id).lean();
      const html = generateCertificateHtml(honor, template);
      
      console.log('Generating PDF and PNG for honor:', honorId);
      const { pdfBuffer, pngBuffer } = await renderHtmlToPdfAndPng(html);
      
      const pdfKey = `certificates/${honorId}.pdf`;
      const pngKey = `certificates/${honorId}.png`;
      
      console.log('Uploading to S3...');
      await uploadBuffer(pdfBuffer, pdfKey, 'application/pdf');
      await uploadBuffer(pngBuffer, pngKey, 'image/png');
      
      await Honor.findByIdAndUpdate(honorId, { 
        assets: { pdf_key: pdfKey, image_key: pngKey }
      });
      
      console.log('Assets uploaded for honor', honorId, '- PDF key:', pdfKey);
    } catch (error) {
      console.error('Error processing honor', honorId, error);
      throw error;
    }
  });
  
  await agenda.start();
  console.log('Agenda worker started');
})();
