import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'wouter';

const HONOR_TYPES: Record<number, string> = { 1: 'Certificate', 2: 'Badge' };
const EVENT_TYPES: Record<number, string> = { 1: 'Course', 2: 'Exam', 3: 'Participation', 4: 'Custom' };

export default function AllCertificates() {
  const [honors, setHonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({ honorType: '', eventType: '', status: '' });

  useEffect(() => {
    fetchHonors();
  }, []);

  async function fetchHonors() {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/honors');
      setHonors(res.data.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  }

  const filteredHonors = honors.filter(h => {
    if (filter.honorType && h.honor_type !== parseInt(filter.honorType)) return false;
    if (filter.eventType && h.event_type !== parseInt(filter.eventType)) return false;
    if (filter.status && h.status !== filter.status) return false;
    return true;
  });

  if (loading) return <div style={styles.loading}>Loading certificates...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>All Certificates & Badges</h2>
      
      <div style={styles.filters}>
        <select 
          value={filter.honorType} 
          onChange={e => setFilter({...filter, honorType: e.target.value})}
          style={styles.select}
        >
          <option value="">All Types</option>
          <option value="1">Certificates</option>
          <option value="2">Badges</option>
        </select>
        
        <select 
          value={filter.eventType} 
          onChange={e => setFilter({...filter, eventType: e.target.value})}
          style={styles.select}
        >
          <option value="">All Events</option>
          <option value="1">Course</option>
          <option value="2">Exam</option>
          <option value="3">Participation</option>
          <option value="4">Custom</option>
        </select>
        
        <select 
          value={filter.status} 
          onChange={e => setFilter({...filter, status: e.target.value})}
          style={styles.select}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="revoked">Revoked</option>
          <option value="expired">Expired</option>
        </select>
        
        <span style={styles.count}>{filteredHonors.length} of {honors.length} items</span>
      </div>

      <div style={styles.grid}>
        {filteredHonors.map(honor => (
          <div key={honor._id} style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={{...styles.badge, backgroundColor: honor.honor_type === 1 ? '#2196F3' : '#9C27B0'}}>
                {HONOR_TYPES[honor.honor_type]}
              </span>
              <span style={{...styles.badge, backgroundColor: '#607D8B'}}>
                {EVENT_TYPES[honor.event_type]}
              </span>
              <span style={{
                ...styles.statusBadge, 
                backgroundColor: honor.status === 'active' ? '#4CAF50' : honor.status === 'revoked' ? '#f44336' : '#FF9800'
              }}>
                {honor.status}
              </span>
            </div>
            
            <h3 style={styles.recipientName}>{honor.recipient?.name}</h3>
            <p style={styles.recipientEmail}>{honor.recipient?.email}</p>
            
            <div style={styles.details}>
              {honor.course?.title && <p><strong>Course:</strong> {honor.course.title}</p>}
              {honor.exam?.exam_title && <p><strong>Exam:</strong> {honor.exam.exam_title}</p>}
              {honor.participation?.event_title && <p><strong>Event:</strong> {honor.participation.event_title}</p>}
              {honor.badge?.badge_name && <p><strong>Badge:</strong> {honor.badge.badge_name}</p>}
            </div>
            
            <div style={styles.cardFooter}>
              <Link href={`/c/${honor.public_slug}`}>
                <button style={styles.viewBtn}>View Certificate</button>
              </Link>
              <small style={styles.date}>
                {new Date(honor.createdAt).toLocaleDateString()}
              </small>
            </div>
          </div>
        ))}
      </div>
      
      {filteredHonors.length === 0 && (
        <div style={styles.empty}>No certificates found matching the filters.</div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: 1200, margin: '0 auto' },
  title: { marginBottom: 20, color: '#333' },
  loading: { textAlign: 'center', padding: 40, color: '#666' },
  error: { textAlign: 'center', padding: 40, color: '#f44336' },
  filters: { display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' },
  select: { padding: '8px 12px', borderRadius: 4, border: '1px solid #ddd', fontSize: 14 },
  count: { marginLeft: 'auto', color: '#666', fontSize: 14 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 },
  card: { 
    border: '1px solid #e0e0e0', 
    borderRadius: 8, 
    padding: 16, 
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  cardHeader: { display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  badge: { 
    padding: '4px 8px', 
    borderRadius: 4, 
    color: '#fff', 
    fontSize: 11, 
    fontWeight: 600,
    textTransform: 'uppercase'
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: 4,
    color: '#fff',
    fontSize: 11,
    fontWeight: 600,
    marginLeft: 'auto'
  },
  recipientName: { margin: '0 0 4px 0', fontSize: 18, color: '#333' },
  recipientEmail: { margin: 0, fontSize: 14, color: '#666' },
  details: { margin: '12px 0', fontSize: 13, color: '#555' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: '1px solid #eee' },
  viewBtn: { 
    padding: '8px 16px', 
    backgroundColor: '#1976D2', 
    color: '#fff', 
    border: 'none', 
    borderRadius: 4, 
    cursor: 'pointer',
    fontSize: 13
  },
  date: { color: '#999' },
  empty: { textAlign: 'center', padding: 40, color: '#666' }
};
