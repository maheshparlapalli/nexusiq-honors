import React from 'react';
import axios from 'axios';

const PLACEHOLDER_VALUES: Record<string, string> = {
  recipient_name: 'John Doe',
  course_title: 'Advanced Web Development',
  completion_date: 'December 5, 2024',
  duration: '40 hours',
  exam_title: 'Professional Certification Exam',
  score: '95/100 (95%)',
  rank: '#3',
  attempt_date: 'November 20, 2024',
  event_title: 'Annual Developer Conference 2024',
  event_date: 'October 15, 2024',
  location: 'San Francisco, CA',
  achievement_title: 'Outstanding Contributor',
  description: 'For exceptional contributions to the community',
  issue_date: 'December 5, 2024',
  badge_name: 'Expert Badge',
  level: 'Level 3',
  criteria: 'Complete all advanced courses',
  score_badge: '95%',
  event_year: '2024',
  achievement: 'Special Achievement'
};

export default function TemplatePreview({ params }: any){
  const { id } = params;
  const [tpl, setTpl] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(()=> {
    setLoading(true);
    axios.get(`/api/v1/templates/${id}`)
      .then(r => setTpl(r.data.data))
      .catch(() => setTpl(null))
      .finally(() => setLoading(false));
  },[id]);
  
  if(loading) return <div style={styles.loading}>Loading template...</div>;
  if(!tpl) return <div style={styles.error}>Template not found</div>;
  
  const isBadge = tpl.type === 'badge';
  const layout = tpl.layout || {};
  
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>{tpl.name}</h2>
        <div style={styles.badges}>
          <span style={{...styles.badge, backgroundColor: isBadge ? '#9C27B0' : '#2196F3'}}>
            {tpl.type}
          </span>
          <span style={{...styles.badge, backgroundColor: '#607D8B'}}>
            {tpl.category}
          </span>
          <span style={{...styles.badge, backgroundColor: tpl.active ? '#4CAF50' : '#f44336'}}>
            {tpl.active ? 'Active' : 'Inactive'}
          </span>
          <span style={{...styles.badge, backgroundColor: '#FF9800'}}>
            v{tpl.version}
          </span>
        </div>
      </div>
      
      <div style={styles.previewSection}>
        <h3 style={styles.sectionTitle}>Template Preview</h3>
        <div style={styles.previewWrapper}>
          {isBadge ? (
            <BadgePreview template={tpl} />
          ) : (
            <CertificatePreview template={tpl} />
          )}
        </div>
      </div>
      
      <div style={styles.detailsSection}>
        <h3 style={styles.sectionTitle}>Template Details</h3>
        <div style={styles.detailsGrid}>
          <div style={styles.detailCard}>
            <h4 style={styles.cardTitle}>Layout</h4>
            <p><strong>Dimensions:</strong> {layout.width || 1056} x {layout.height || 816}px</p>
            <p><strong>Orientation:</strong> {layout.orientation || 'landscape'}</p>
          </div>
          
          <div style={styles.detailCard}>
            <h4 style={styles.cardTitle}>Styles</h4>
            <p><strong>Font:</strong> {tpl.styles?.global_font_family || 'Georgia'}</p>
            <p><strong>Theme:</strong> {tpl.styles?.color_theme || 'default'}</p>
          </div>
          
          <div style={styles.detailCard}>
            <h4 style={styles.cardTitle}>Settings</h4>
            <p><strong>Expiry:</strong> {tpl.meta?.default_expiry_months ? `${tpl.meta.default_expiry_months} months` : 'Never'}</p>
            <p><strong>Signature:</strong> {tpl.meta?.signature_block?.show ? 'Yes' : 'No'}</p>
            {tpl.meta?.signature_block?.show && (
              <p><strong>Signed by:</strong> {tpl.meta.signature_block.name}</p>
            )}
          </div>
        </div>
      </div>
      
      <div style={styles.fieldsSection}>
        <h3 style={styles.sectionTitle}>Template Fields ({tpl.fields?.length || 0})</h3>
        <div style={styles.fieldsList}>
          {tpl.fields?.map((field: any, idx: number) => (
            <div key={idx} style={styles.fieldItem}>
              <div style={styles.fieldHeader}>
                <span style={styles.fieldKey}>{field.key}</span>
                <span style={styles.fieldType}>{field.type}</span>
              </div>
              <div style={styles.fieldDetails}>
                <span>Label: {field.label}</span>
                <span>Position: ({field.position?.x}, {field.position?.y})</span>
                <span style={{color: field.font?.color}}>
                  Font: {field.font?.family} {field.font?.size}px {field.font?.weight}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CertificatePreview({ template }: { template: any }) {
  const meta = template.meta || {};
  const signature = meta.signature_block || {};
  
  return (
    <div style={certStyles.certificate}>
      <div style={certStyles.innerBorder}>
        <div style={certStyles.header}>
          <div style={certStyles.logo}>NEXSAA</div>
          <div style={certStyles.certTitle}>Certificate</div>
          <div style={certStyles.subtitle}>of {template.category === 'course' ? 'Course Completion' : 
            template.category === 'exam' ? 'Achievement' : 
            template.category === 'participation' ? 'Participation' : 'Recognition'}</div>
        </div>
        
        <div style={certStyles.content}>
          <div style={certStyles.eventBadge}>{template.category?.toUpperCase()}</div>
          <div style={certStyles.presentedTo}>This is to certify that</div>
          <div style={certStyles.recipientName}>{PLACEHOLDER_VALUES.recipient_name}</div>
          
          {template.category === 'course' && (
            <>
              <div style={certStyles.achievement}>has successfully completed</div>
              <div style={certStyles.achievementTitle}>{PLACEHOLDER_VALUES.course_title}</div>
              <div style={certStyles.detail}>Duration: {PLACEHOLDER_VALUES.duration}</div>
            </>
          )}
          
          {template.category === 'exam' && (
            <>
              <div style={certStyles.achievement}>has passed</div>
              <div style={certStyles.achievementTitle}>{PLACEHOLDER_VALUES.exam_title}</div>
              <div style={certStyles.detail}>Score: {PLACEHOLDER_VALUES.score} | Rank: {PLACEHOLDER_VALUES.rank}</div>
            </>
          )}
          
          {template.category === 'participation' && (
            <>
              <div style={certStyles.achievement}>has participated in</div>
              <div style={certStyles.achievementTitle}>{PLACEHOLDER_VALUES.event_title}</div>
              <div style={certStyles.detail}>Location: {PLACEHOLDER_VALUES.location}</div>
            </>
          )}
          
          {template.category === 'custom' && (
            <>
              <div style={certStyles.achievement}>is recognized for</div>
              <div style={certStyles.achievementTitle}>{PLACEHOLDER_VALUES.achievement_title}</div>
              <div style={certStyles.detail}>{PLACEHOLDER_VALUES.description}</div>
            </>
          )}
        </div>
        
        <div style={certStyles.footer}>
          {signature.show && (
            <div style={certStyles.signatureBlock}>
              <div style={certStyles.signatureLine}></div>
              <div style={certStyles.signatureName}>{signature.name || 'Director'}</div>
              <div style={certStyles.signatureTitle}>{signature.designation || 'NexSAA Academy'}</div>
            </div>
          )}
          <div style={certStyles.dateBlock}>
            <div style={certStyles.issueDate}>Issued: {PLACEHOLDER_VALUES.issue_date}</div>
            <div style={certStyles.certId}>Certificate ID: SAMPLE-PREVIEW</div>
          </div>
        </div>
        
        <div style={certStyles.seal}>VERIFIED</div>
      </div>
    </div>
  );
}

function BadgePreview({ template }: { template: any }) {
  return (
    <div style={badgeStyles.wrapper}>
      <div style={badgeStyles.badge}>
        <div style={badgeStyles.icon}>🏆</div>
        <div style={badgeStyles.badgeName}>
          {template.category === 'course' ? PLACEHOLDER_VALUES.badge_name :
           template.category === 'exam' ? 'Certified' :
           template.category === 'participation' ? 'Attendee' : 'Achiever'}
        </div>
        <div style={badgeStyles.recipientName}>{PLACEHOLDER_VALUES.recipient_name}</div>
        <div style={badgeStyles.level}>{PLACEHOLDER_VALUES.level}</div>
        <div style={badgeStyles.eventType}>{template.category?.toUpperCase()}</div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: 1000, margin: '0 auto', padding: 20 },
  loading: { textAlign: 'center', padding: 60, color: '#666', fontSize: 18 },
  error: { textAlign: 'center', padding: 60, color: '#f44336', fontSize: 18 },
  header: { marginBottom: 30 },
  title: { margin: '0 0 15px 0', fontSize: 28, color: '#333' },
  badges: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  badge: { padding: '6px 14px', borderRadius: 4, color: '#fff', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' },
  previewSection: { marginBottom: 40 },
  sectionTitle: { fontSize: 18, color: '#333', marginBottom: 15, borderBottom: '2px solid #e0e0e0', paddingBottom: 10 },
  previewWrapper: { display: 'flex', justifyContent: 'center', backgroundColor: '#f5f5f5', padding: 30, borderRadius: 8 },
  detailsSection: { marginBottom: 40 },
  detailsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 },
  detailCard: { backgroundColor: '#f9f9f9', padding: 20, borderRadius: 8, border: '1px solid #e0e0e0' },
  cardTitle: { margin: '0 0 12px 0', fontSize: 16, color: '#1976D2' },
  fieldsSection: { marginBottom: 40 },
  fieldsList: { display: 'flex', flexDirection: 'column', gap: 10 },
  fieldItem: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 6, border: '1px solid #e0e0e0' },
  fieldHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 8 },
  fieldKey: { fontWeight: 600, color: '#333', fontFamily: 'monospace' },
  fieldType: { backgroundColor: '#e3f2fd', color: '#1976D2', padding: '2px 8px', borderRadius: 4, fontSize: 12 },
  fieldDetails: { display: 'flex', gap: 20, fontSize: 13, color: '#666', flexWrap: 'wrap' }
};

const certStyles: Record<string, React.CSSProperties> = {
  certificate: {
    width: 600,
    minHeight: 450,
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    border: '3px solid #1a365d',
    padding: 35,
    position: 'relative',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
  },
  innerBorder: {
    border: '2px solid #c9a227',
    padding: 25,
    height: '100%',
    position: 'relative'
  },
  header: { textAlign: 'center', marginBottom: 20 },
  logo: { fontSize: 22, color: '#1a365d', fontWeight: 'bold', letterSpacing: 3 },
  certTitle: { fontSize: 32, color: '#1a365d', textTransform: 'uppercase', letterSpacing: 4, margin: '8px 0' },
  subtitle: { fontSize: 14, color: '#666', fontStyle: 'italic' },
  content: { textAlign: 'center', margin: '25px 0' },
  eventBadge: { display: 'inline-block', backgroundColor: '#1a365d', color: 'white', padding: '4px 12px', fontSize: 11, letterSpacing: 1, marginBottom: 15 },
  presentedTo: { fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  recipientName: { fontSize: 28, color: '#c9a227', fontWeight: 'bold', borderBottom: '2px solid #c9a227', display: 'inline-block', paddingBottom: 8, marginBottom: 15 },
  achievement: { fontSize: 13, color: '#666', marginBottom: 8 },
  achievementTitle: { fontSize: 18, color: '#333', marginBottom: 10 },
  detail: { fontSize: 12, color: '#666' },
  footer: { display: 'flex', justifyContent: 'space-between', marginTop: 30, paddingTop: 20 },
  signatureBlock: { textAlign: 'center', width: 150 },
  signatureLine: { borderTop: '1px solid #333', marginBottom: 8, marginTop: 30 },
  signatureName: { fontSize: 12, fontWeight: 'bold', color: '#333' },
  signatureTitle: { fontSize: 10, color: '#666' },
  dateBlock: { textAlign: 'center' },
  issueDate: { fontSize: 11, color: '#666' },
  certId: { fontSize: 10, color: '#888', fontFamily: 'monospace', marginTop: 4 },
  seal: {
    position: 'absolute',
    bottom: 40,
    right: 40,
    width: 60,
    height: 60,
    border: '2px solid #c9a227',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 9,
    color: '#c9a227',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  }
};

const badgeStyles: Record<string, React.CSSProperties> = {
  wrapper: {
    padding: 20,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  badge: {
    width: 220,
    height: 220,
    background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: 20,
    boxShadow: '0 15px 40px rgba(0,0,0,0.3), inset 0 2px 8px rgba(255,255,255,0.1)',
    border: '3px solid #ffd700'
  },
  icon: { fontSize: 36, marginBottom: 8 },
  badgeName: { color: '#ffd700', fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  recipientName: { color: '#ffffff', fontSize: 12, marginBottom: 4 },
  level: { color: '#00ff88', fontSize: 11, fontWeight: 'bold' },
  eventType: { color: '#aaa', fontSize: 9, marginTop: 8, textTransform: 'uppercase' }
};