import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'wouter';

const TEMPLATE_TYPES: Record<string, { label: string; color: string }> = {
  certificate: { label: 'Certificate', color: '#2196F3' },
  badge: { label: 'Badge', color: '#9C27B0' }
};

const CATEGORIES: Record<string, { label: string; color: string }> = {
  course: { label: 'Course', color: '#4CAF50' },
  exam: { label: 'Exam', color: '#FF9800' },
  participation: { label: 'Participation', color: '#E91E63' },
  custom: { label: 'Custom', color: '#00BCD4' }
};

export default function AllTemplates() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({ type: '', category: '' });

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/templates');
      setTemplates(res.data.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  }

  const filteredTemplates = templates.filter(t => {
    if (filter.type && t.type !== filter.type) return false;
    if (filter.category && t.category !== filter.category) return false;
    return true;
  });

  if (loading) return <div style={styles.loading}>Loading templates...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>All Templates</h2>
      
      <div style={styles.filters}>
        <select 
          value={filter.type} 
          onChange={e => setFilter({...filter, type: e.target.value})}
          style={styles.select}
        >
          <option value="">All Types</option>
          <option value="certificate">Certificates</option>
          <option value="badge">Badges</option>
        </select>
        
        <select 
          value={filter.category} 
          onChange={e => setFilter({...filter, category: e.target.value})}
          style={styles.select}
        >
          <option value="">All Categories</option>
          <option value="course">Course</option>
          <option value="exam">Exam</option>
          <option value="participation">Participation</option>
          <option value="custom">Custom</option>
        </select>
        
        <span style={styles.count}>{filteredTemplates.length} of {templates.length} templates</span>
      </div>

      <div style={styles.grid}>
        {filteredTemplates.map(template => (
          <div key={template._id} style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={{
                ...styles.badge, 
                backgroundColor: TEMPLATE_TYPES[template.type]?.color || '#607D8B'
              }}>
                {TEMPLATE_TYPES[template.type]?.label || template.type}
              </span>
              <span style={{
                ...styles.badge, 
                backgroundColor: CATEGORIES[template.category]?.color || '#607D8B'
              }}>
                {CATEGORIES[template.category]?.label || template.category}
              </span>
              <span style={{
                ...styles.statusBadge,
                backgroundColor: template.active ? '#4CAF50' : '#9E9E9E'
              }}>
                {template.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <h3 style={styles.templateName}>{template.name}</h3>
            
            <div style={styles.layoutInfo}>
              <p><strong>Orientation:</strong> {template.layout?.orientation || 'N/A'}</p>
              <p><strong>Size:</strong> {template.layout?.width} x {template.layout?.height}px</p>
              <p><strong>Version:</strong> {template.version}</p>
              <p><strong>Fields:</strong> {template.fields?.length || 0}</p>
            </div>
            
            {template.meta?.signature_block?.show && (
              <div style={styles.signatureInfo}>
                <p><strong>Signed by:</strong> {template.meta.signature_block.name}</p>
                <p style={styles.designation}>{template.meta.signature_block.designation}</p>
              </div>
            )}
            
            <div style={styles.cardFooter}>
              <Link href={`/preview/${template._id}`}>
                <button style={styles.previewBtn}>Preview Template</button>
              </Link>
              <small style={styles.date}>
                Updated: {new Date(template.updatedAt).toLocaleDateString()}
              </small>
            </div>
          </div>
        ))}
      </div>
      
      {filteredTemplates.length === 0 && (
        <div style={styles.empty}>No templates found matching the filters.</div>
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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 },
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
  templateName: { margin: '0 0 12px 0', fontSize: 18, color: '#333' },
  layoutInfo: { 
    margin: '0 0 12px 0', 
    fontSize: 13, 
    color: '#555',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 4
  },
  signatureInfo: {
    margin: '0 0 12px 0',
    fontSize: 13,
    color: '#555',
    borderLeft: '3px solid #1976D2',
    paddingLeft: 10
  },
  designation: { margin: 0, fontStyle: 'italic', color: '#888' },
  cardFooter: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 12, 
    paddingTop: 12, 
    borderTop: '1px solid #eee' 
  },
  previewBtn: { 
    padding: '8px 16px', 
    backgroundColor: '#9C27B0', 
    color: '#fff', 
    border: 'none', 
    borderRadius: 4, 
    cursor: 'pointer',
    fontSize: 13
  },
  date: { color: '#999' },
  empty: { textAlign: 'center', padding: 40, color: '#666' }
};
