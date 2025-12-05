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

const DEFAULT_FIELDS: Record<string, any[]> = {
  course: [
    { key: 'recipient_name', label: 'Recipient Name', type: 'text', position: { x: 528, y: 350 }, font: { size: 48, color: '#1a1a1a', weight: 'bold', family: 'Georgia' } },
    { key: 'course_title', label: 'Course Title', type: 'text', position: { x: 528, y: 420 }, font: { size: 28, color: '#333333', weight: 'normal', family: 'Arial' } },
    { key: 'completion_date', label: 'Completion Date', type: 'date', position: { x: 528, y: 500 }, font: { size: 18, color: '#666666', weight: 'normal', family: 'Arial' } }
  ],
  exam: [
    { key: 'recipient_name', label: 'Recipient Name', type: 'text', position: { x: 528, y: 320 }, font: { size: 48, color: '#1a1a1a', weight: 'bold', family: 'Georgia' } },
    { key: 'exam_title', label: 'Exam Title', type: 'text', position: { x: 528, y: 400 }, font: { size: 28, color: '#333333', weight: 'normal', family: 'Arial' } },
    { key: 'score', label: 'Score', type: 'text', position: { x: 528, y: 460 }, font: { size: 24, color: '#2e7d32', weight: 'bold', family: 'Arial' } }
  ],
  participation: [
    { key: 'recipient_name', label: 'Recipient Name', type: 'text', position: { x: 528, y: 340 }, font: { size: 44, color: '#1a1a1a', weight: 'bold', family: 'Georgia' } },
    { key: 'event_title', label: 'Event Title', type: 'text', position: { x: 528, y: 420 }, font: { size: 26, color: '#333333', weight: 'normal', family: 'Arial' } },
    { key: 'event_date', label: 'Event Date', type: 'date', position: { x: 528, y: 490 }, font: { size: 18, color: '#666666', weight: 'normal', family: 'Arial' } }
  ],
  custom: [
    { key: 'recipient_name', label: 'Recipient Name', type: 'text', position: { x: 528, y: 350 }, font: { size: 48, color: '#1a1a1a', weight: 'bold', family: 'Georgia' } },
    { key: 'achievement_title', label: 'Achievement', type: 'text', position: { x: 528, y: 430 }, font: { size: 28, color: '#333333', weight: 'normal', family: 'Arial' } }
  ]
};

export default function AllTemplates() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({ type: '', category: '' });
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'certificate',
    category: 'course',
    signatureName: '',
    signatureDesignation: '',
    showSignature: true,
    expiryMonths: ''
  });

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

  async function handleCreateTemplate(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a template name');
      return;
    }

    setCreating(true);
    try {
      const isBadge = formData.type === 'badge';
      const templateData = {
        client_id: 'nexsaa-demo',
        name: formData.name,
        type: formData.type,
        category: formData.category,
        layout: {
          background_url: `/templates/${formData.category}-${formData.type}-bg.png`,
          width: isBadge ? 400 : 1056,
          height: isBadge ? 400 : 816,
          orientation: isBadge ? 'square' : 'landscape'
        },
        fields: DEFAULT_FIELDS[formData.category] || DEFAULT_FIELDS.custom,
        styles: {
          global_font_family: isBadge ? 'Arial' : 'Georgia',
          color_theme: `${formData.category}-${formData.type}`
        },
        meta: {
          default_expiry_months: formData.expiryMonths ? parseInt(formData.expiryMonths) : null,
          allow_expiry_override: !!formData.expiryMonths,
          issued_by_label: 'NexSAA Academy',
          signature_block: {
            show: formData.showSignature && !isBadge,
            signature_url: '/signatures/default.png',
            name: formData.signatureName || 'Director',
            designation: formData.signatureDesignation || 'NexSAA Academy'
          },
          seal_url: '/seals/nexsaa-seal.png'
        },
        version: 1,
        active: true
      };

      await axios.post('/api/v1/templates', templateData);
      setShowModal(false);
      setFormData({
        name: '',
        type: 'certificate',
        category: 'course',
        signatureName: '',
        signatureDesignation: '',
        showSignature: true,
        expiryMonths: ''
      });
      fetchTemplates();
    } catch (err: any) {
      alert('Failed to create template: ' + (err.response?.data?.message || err.message));
    } finally {
      setCreating(false);
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
      <div style={styles.headerRow}>
        <h2 style={styles.title}>All Templates</h2>
        <button style={styles.createBtn} onClick={() => setShowModal(true)}>
          + Create New Template
        </button>
      </div>
      
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

      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Create New Template</h3>
            <form onSubmit={handleCreateTemplate}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Template Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  style={styles.input}
                  placeholder="e.g., Advanced Course Certificate"
                  required
                />
              </div>
              
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Type</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    style={styles.input}
                  >
                    <option value="certificate">Certificate</option>
                    <option value="badge">Badge</option>
                  </select>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    style={styles.input}
                  >
                    <option value="course">Course</option>
                    <option value="exam">Exam</option>
                    <option value="participation">Participation</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Expiry (months, leave empty for no expiry)</label>
                <input
                  type="number"
                  value={formData.expiryMonths}
                  onChange={e => setFormData({...formData, expiryMonths: e.target.value})}
                  style={styles.input}
                  placeholder="e.g., 12"
                  min="1"
                />
              </div>
              
              {formData.type === 'certificate' && (
                <>
                  <div style={styles.formGroup}>
                    <label style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.showSignature}
                        onChange={e => setFormData({...formData, showSignature: e.target.checked})}
                      />
                      Show Signature Block
                    </label>
                  </div>
                  
                  {formData.showSignature && (
                    <div style={styles.formRow}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Signatory Name</label>
                        <input
                          type="text"
                          value={formData.signatureName}
                          onChange={e => setFormData({...formData, signatureName: e.target.value})}
                          style={styles.input}
                          placeholder="e.g., Dr. John Smith"
                        />
                      </div>
                      
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Designation</label>
                        <input
                          type="text"
                          value={formData.signatureDesignation}
                          onChange={e => setFormData({...formData, signatureDesignation: e.target.value})}
                          style={styles.input}
                          placeholder="e.g., Director of Education"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
              
              <div style={styles.modalActions}>
                <button 
                  type="button" 
                  style={styles.cancelBtn} 
                  onClick={() => setShowModal(false)}
                  disabled={creating}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={styles.submitBtn}
                  disabled={creating}
                >
                  {creating ? 'Creating...' : 'Create Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 },
  title: { margin: 0, color: '#333' },
  createBtn: { 
    padding: '10px 20px', 
    backgroundColor: '#4CAF50', 
    color: '#fff', 
    border: 'none', 
    borderRadius: 6, 
    cursor: 'pointer', 
    fontSize: 14, 
    fontWeight: 600 
  },
  loading: { textAlign: 'center', padding: 40, color: '#666' },
  error: { textAlign: 'center', padding: 40, color: '#f44336' },
  filters: { display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' },
  select: { padding: '8px 12px', borderRadius: 4, border: '1px solid #ddd', fontSize: 14 },
  count: { marginLeft: 'auto', color: '#666', fontSize: 14 },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 30,
    width: '90%',
    maxWidth: 500,
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
  },
  modalTitle: { margin: '0 0 20px 0', fontSize: 22, color: '#333' },
  formGroup: { marginBottom: 16 },
  formRow: { display: 'flex', gap: 16 },
  label: { display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500, color: '#333' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#333', cursor: 'pointer' },
  input: { 
    width: '100%', 
    padding: '10px 12px', 
    borderRadius: 4, 
    border: '1px solid #ddd', 
    fontSize: 14, 
    boxSizing: 'border-box' 
  },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24, paddingTop: 16, borderTop: '1px solid #eee' },
  cancelBtn: { 
    padding: '10px 20px', 
    backgroundColor: '#f5f5f5', 
    color: '#666', 
    border: '1px solid #ddd', 
    borderRadius: 6, 
    cursor: 'pointer', 
    fontSize: 14 
  },
  submitBtn: { 
    padding: '10px 24px', 
    backgroundColor: '#4CAF50', 
    color: '#fff', 
    border: 'none', 
    borderRadius: 6, 
    cursor: 'pointer', 
    fontSize: 14, 
    fontWeight: 600 
  },
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
