import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HONOR_TYPES: Record<number, string> = { 1: 'Certificate', 2: 'Badge' };
const EVENT_TYPES: Record<number, string> = { 1: 'Course Completion', 2: 'Exam Achievement', 3: 'Participation', 4: 'Custom Achievement' };

export default function PublicCertificate({ params }: any){
  const { slug } = params;
  const [data, setData] = useState<any>(null);
  
  useEffect(()=> {
    async function load(){ 
      try {
        const res = await axios.get(`/api/v1/honors/public/${slug}`);
        setData(res.data.data);
      } catch(err:any){
        setData({ error: err.response?.data?.message || 'Not found' });
      }
    }
    load();
  },[slug]);
  
  if(!data) return <div style={styles.loading}>Loading certificate...</div>;
  if(data.error) return <div style={styles.error}>{data.error}</div>;
  
  const honorType = HONOR_TYPES[data.honor_type] || 'Honor';
  const eventType = EVENT_TYPES[data.event_type] || 'Achievement';
  
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={{...styles.badge, backgroundColor: data.honor_type === 1 ? '#2196F3' : '#9C27B0'}}>
          {honorType}
        </span>
        <span style={{...styles.badge, backgroundColor: '#607D8B'}}>
          {eventType}
        </span>
        <span style={{...styles.statusBadge, backgroundColor: data.status === 'active' ? '#4CAF50' : '#f44336'}}>
          {data.status}
        </span>
      </div>
      
      <div style={styles.recipientInfo}>
        <h2 style={styles.recipientName}>{data.recipient?.name}</h2>
        <p style={styles.recipientEmail}>{data.recipient?.email}</p>
      </div>
      
      <div style={styles.details}>
        {data.course?.title && <p><strong>Course:</strong> {data.course.title}</p>}
        {data.exam?.exam_title && (
          <>
            <p><strong>Exam:</strong> {data.exam.exam_title}</p>
            <p><strong>Score:</strong> {data.exam.secured_score}/{data.exam.total_score} ({data.exam.percentage}%)</p>
          </>
        )}
        {data.participation?.event_title && (
          <>
            <p><strong>Event:</strong> {data.participation.event_title}</p>
            <p><strong>Location:</strong> {data.participation.location}</p>
          </>
        )}
        {data.badge?.badge_name && (
          <>
            <p><strong>Badge:</strong> {data.badge.badge_name}</p>
            <p><strong>Level:</strong> {data.badge.level}</p>
          </>
        )}
        <p><strong>Issued:</strong> {new Date(data.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p style={styles.certId}><strong>Certificate ID:</strong> {slug}</p>
      </div>
      
      {data.assets?.image_url && (
        <div style={styles.imageContainer}>
          <h3 style={styles.sectionTitle}>Certificate Preview</h3>
          <img 
            src={data.assets.image_url} 
            alt="Certificate" 
            style={styles.certificateImage}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      
      <div style={styles.actions}>
        {data.assets?.pdf_url && (
          <a href={data.assets.pdf_url} target="_blank" rel="noopener noreferrer" style={styles.downloadBtn}>
            Download PDF
          </a>
        )}
        {data.assets?.image_url && (
          <a href={data.assets.image_url} target="_blank" rel="noopener noreferrer" style={styles.viewBtn}>
            View Image
          </a>
        )}
      </div>
      
      {!data.assets?.pdf_url && !data.assets?.image_url && (
        <div style={styles.noAssets}>
          <p>Certificate assets are being generated. Please check back shortly.</p>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: 900, margin: '0 auto', padding: 20 },
  loading: { textAlign: 'center', padding: 40, color: '#666' },
  error: { textAlign: 'center', padding: 40, color: '#f44336', fontSize: 18 },
  header: { display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' },
  badge: { padding: '6px 12px', borderRadius: 4, color: '#fff', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' },
  statusBadge: { padding: '6px 12px', borderRadius: 4, color: '#fff', fontSize: 12, fontWeight: 600, marginLeft: 'auto' },
  recipientInfo: { marginBottom: 20 },
  recipientName: { margin: '0 0 5px 0', fontSize: 28, color: '#333' },
  recipientEmail: { margin: 0, fontSize: 16, color: '#666' },
  details: { backgroundColor: '#f5f5f5', padding: 20, borderRadius: 8, marginBottom: 20, fontSize: 15, lineHeight: 1.8 },
  certId: { marginTop: 15, paddingTop: 15, borderTop: '1px solid #ddd', fontFamily: 'monospace' },
  imageContainer: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, color: '#333', marginBottom: 15 },
  certificateImage: { maxWidth: '100%', borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' },
  actions: { display: 'flex', gap: 15, marginTop: 20 },
  downloadBtn: { 
    display: 'inline-block', 
    padding: '12px 24px', 
    backgroundColor: '#1976D2', 
    color: '#fff', 
    textDecoration: 'none', 
    borderRadius: 6, 
    fontWeight: 600,
    fontSize: 14
  },
  viewBtn: { 
    display: 'inline-block', 
    padding: '12px 24px', 
    backgroundColor: '#43A047', 
    color: '#fff', 
    textDecoration: 'none', 
    borderRadius: 6, 
    fontWeight: 600,
    fontSize: 14
  },
  noAssets: { backgroundColor: '#fff3cd', padding: 20, borderRadius: 8, color: '#856404', textAlign: 'center' }
};