import React from 'react';
import axios from 'axios';
import { Link } from 'wouter';

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
  description: 'For exceptional contributions',
  issue_date: 'December 5, 2024',
  badge_name: 'Expert Badge',
  level: 'Level 3',
  criteria: 'Complete all advanced courses',
  score_badge: '95%',
  event_year: '2024',
  achievement: 'Special Achievement',
  student_name: 'Jane Smith',
  date: 'December 5, 2024',
  title: 'Sample Title',
  name: 'Sample Name'
};

export default function TemplatePreview({ params }: any) {
  const { id } = params;
  const [tpl, setTpl] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    axios.get(`/api/v1/templates/${id}`)
      .then(r => setTpl(r.data.data))
      .catch(() => setTpl(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={styles.loading}>Loading template...</div>;
  if (!tpl) return <div style={styles.error}>Template not found</div>;

  const isBadge = tpl.type === 'badge';
  const layout = tpl.layout || {};

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>{tpl.name}</h2>
          <div style={styles.badges}>
            <span style={{ ...styles.badge, backgroundColor: isBadge ? '#9C27B0' : '#2196F3' }}>
              {tpl.type}
            </span>
            <span style={{ ...styles.badge, backgroundColor: '#607D8B' }}>
              {tpl.category}
            </span>
            <span style={{ ...styles.badge, backgroundColor: tpl.active ? '#4CAF50' : '#f44336' }}>
              {tpl.active ? 'Active' : 'Inactive'}
            </span>
            <span style={{ ...styles.badge, backgroundColor: '#FF9800' }}>
              v{tpl.version}
            </span>
          </div>
        </div>
        <Link href="/templates" style={styles.backBtn}>
          Back to Templates
        </Link>
      </div>

      <div style={styles.previewSection}>
        <h3 style={styles.sectionTitle}>Template Preview</h3>
        <p style={styles.previewNote}>
          This preview shows how the template will look. Dynamic fields display sample values.
        </p>
        <div style={styles.previewWrapper}>
          <FieldBasedPreview template={tpl} />
        </div>
        <div style={styles.previewInfo}>
          <span>{layout.width || 1056} x {layout.height || 816}px</span>
          <span>{layout.orientation || 'landscape'}</span>
          <span>{tpl.fields?.length || 0} fields</span>
        </div>
      </div>

      <div style={styles.detailsSection}>
        <h3 style={styles.sectionTitle}>Template Details</h3>
        <div style={styles.detailsGrid}>
          <div style={styles.detailCard}>
            <h4 style={styles.cardTitle}>Layout</h4>
            <p><strong>Dimensions:</strong> {layout.width || 1056} x {layout.height || 816}px</p>
            <p><strong>Orientation:</strong> {layout.orientation || 'landscape'}</p>
            <p><strong>Background:</strong> {layout.background_url ? 'Custom image' : 'None'}</p>
          </div>

          <div style={styles.detailCard}>
            <h4 style={styles.cardTitle}>Styles</h4>
            <p><strong>Font:</strong> {tpl.styles?.global_font_family || 'Georgia'}</p>
            <p><strong>Theme:</strong> {tpl.styles?.color_theme || 'default'}</p>
          </div>

          <div style={styles.detailCard}>
            <h4 style={styles.cardTitle}>Settings</h4>
            <p><strong>Issued By:</strong> {tpl.meta?.issued_by_label || 'Not set'}</p>
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
        {tpl.fields?.length > 0 ? (
          <div style={styles.fieldsList}>
            {tpl.fields.map((field: any, idx: number) => (
              <div key={idx} style={styles.fieldItem}>
                <div style={styles.fieldHeader}>
                  <span style={styles.fieldKey}>{field.key}</span>
                  <div style={styles.fieldBadges}>
                    <span style={styles.fieldType}>{field.type}</span>
                    <span style={{
                      ...styles.fieldMode,
                      backgroundColor: field.mode === 'static' ? '#e8f5e9' : '#e3f2fd',
                      color: field.mode === 'static' ? '#2e7d32' : '#1976D2'
                    }}>
                      {field.mode || 'dynamic'}
                    </span>
                  </div>
                </div>
                <div style={styles.fieldDetails}>
                  <span><strong>Label:</strong> {field.label}</span>
                  <span><strong>Position:</strong> ({field.position?.x}, {field.position?.y})</span>
                  {field.type === 'line_horizontal' || field.type === 'line_vertical' ? (
                    <span><strong>Line:</strong> {field.line?.length}px x {field.line?.thickness}px, {field.line?.color}</span>
                  ) : (
                    <span style={{ color: field.font?.color }}>
                      <strong>Font:</strong> {field.font?.family} {field.font?.size}px {field.font?.weight}
                    </span>
                  )}
                  {field.mode === 'static' && field.staticContent && (
                    <span><strong>Content:</strong> "{field.staticContent}"</span>
                  )}
                  {field.mode === 'dynamic' && field.placeholder && (
                    <span><strong>Placeholder:</strong> [{field.placeholder}]</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.noFields}>No fields configured for this template.</div>
        )}
      </div>
    </div>
  );
}

function FieldBasedPreview({ template }: { template: any }) {
  const layout = template.layout || {};
  const fields = template.fields || [];
  const styles = template.styles || {};
  
  const width = layout.width || 1056;
  const height = layout.height || 816;
  const scale = Math.min(700 / width, 500 / height, 1);

  const previewStyle: React.CSSProperties = {
    width: width * scale,
    height: height * scale,
    position: 'relative',
    backgroundColor: '#ffffff',
    backgroundImage: layout.background_url ? `url(${layout.background_url})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    border: '1px solid #ccc',
    borderRadius: 4,
    overflow: 'hidden',
    fontFamily: styles.global_font_family || 'Georgia'
  };

  function getDisplayValue(field: any): string {
    if (field.mode === 'static' && field.staticContent) {
      return field.staticContent;
    }
    const key = field.key?.toLowerCase().replace(/[\s_-]/g, '_');
    return PLACEHOLDER_VALUES[key] || PLACEHOLDER_VALUES[field.key] || field.placeholder || `[${field.label}]`;
  }

  function renderField(field: any, index: number) {
    const x = (field.position?.x || 0) * scale;
    const y = (field.position?.y || 0) * scale;

    if (field.type === 'line_horizontal') {
      const lineLength = (field.line?.length || 100) * scale;
      const thickness = (field.line?.thickness || 2) * scale;
      return (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width: lineLength,
            height: thickness,
            backgroundColor: field.line?.color || '#000000'
          }}
        />
      );
    }

    if (field.type === 'line_vertical') {
      const lineLength = (field.line?.length || 100) * scale;
      const thickness = (field.line?.thickness || 2) * scale;
      return (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width: thickness,
            height: lineLength,
            backgroundColor: field.line?.color || '#000000'
          }}
        />
      );
    }

    if (field.type === 'image') {
      const imgWidth = (field.image?.width || 100) * scale;
      const imgHeight = (field.image?.height || 100) * scale;
      return (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width: imgWidth,
            height: imgHeight,
            backgroundColor: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10 * scale,
            color: '#666',
            border: '1px dashed #999'
          }}
        >
          [Image]
        </div>
      );
    }

    const fontSize = (field.font?.size || 16) * scale;
    const displayValue = getDisplayValue(field);
    const isDynamic = field.mode !== 'static';

    return (
      <div
        key={index}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          fontSize,
          fontFamily: field.font?.family || styles.global_font_family || 'Georgia',
          fontWeight: field.font?.weight || 'normal',
          color: field.font?.color || '#000000',
          fontStyle: isDynamic ? 'italic' : 'normal',
          whiteSpace: 'nowrap',
          textAlign: field.font?.align || 'left'
        }}
      >
        {isDynamic ? displayValue : displayValue}
      </div>
    );
  }

  if (fields.length === 0) {
    return (
      <div style={previewStyle}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: '#999'
        }}>
          <div style={{ fontSize: 14, marginBottom: 4 }}>Empty Template</div>
          <div style={{ fontSize: 11 }}>No fields configured</div>
        </div>
      </div>
    );
  }

  return (
    <div style={previewStyle}>
      {fields.map((field: any, index: number) => renderField(field, index))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: 1000, margin: '0 auto', padding: 20 },
  loading: { textAlign: 'center', padding: 60, color: '#666', fontSize: 18 },
  error: { textAlign: 'center', padding: 60, color: '#f44336', fontSize: 18 },
  header: { marginBottom: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 },
  title: { margin: '0 0 15px 0', fontSize: 28, color: '#333' },
  badges: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  badge: { padding: '6px 14px', borderRadius: 4, color: '#fff', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' },
  backBtn: { padding: '10px 20px', backgroundColor: '#f5f5f5', color: '#333', textDecoration: 'none', borderRadius: 6, fontSize: 14, border: '1px solid #ddd' },
  previewSection: { marginBottom: 40 },
  sectionTitle: { fontSize: 18, color: '#333', marginBottom: 15, borderBottom: '2px solid #e0e0e0', paddingBottom: 10 },
  previewNote: { color: '#666', fontSize: 13, marginBottom: 15 },
  previewWrapper: { display: 'flex', justifyContent: 'center', backgroundColor: '#f5f5f5', padding: 30, borderRadius: 8 },
  previewInfo: { display: 'flex', justifyContent: 'center', gap: 20, marginTop: 12, color: '#666', fontSize: 13 },
  detailsSection: { marginBottom: 40 },
  detailsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 },
  detailCard: { backgroundColor: '#f9f9f9', padding: 20, borderRadius: 8, border: '1px solid #e0e0e0' },
  cardTitle: { margin: '0 0 12px 0', fontSize: 16, color: '#1976D2' },
  fieldsSection: { marginBottom: 40 },
  fieldsList: { display: 'flex', flexDirection: 'column', gap: 10 },
  fieldItem: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 6, border: '1px solid #e0e0e0' },
  fieldHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' },
  fieldKey: { fontWeight: 600, color: '#333', fontFamily: 'monospace' },
  fieldBadges: { display: 'flex', gap: 8 },
  fieldType: { backgroundColor: '#e3f2fd', color: '#1976D2', padding: '2px 8px', borderRadius: 4, fontSize: 12 },
  fieldMode: { padding: '2px 8px', borderRadius: 4, fontSize: 12 },
  fieldDetails: { display: 'flex', gap: 20, fontSize: 13, color: '#666', flexWrap: 'wrap' },
  noFields: { textAlign: 'center', padding: 40, color: '#999', backgroundColor: '#f9f9f9', borderRadius: 8 }
};
