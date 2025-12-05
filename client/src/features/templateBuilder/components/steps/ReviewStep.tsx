import React from 'react';
import { TemplateFormData } from '../../types';
import { styles } from '../styles';

interface ReviewStepProps {
  formData: TemplateFormData;
  backgroundFilename: string;
}

export function ReviewStep({ formData, backgroundFilename }: ReviewStepProps) {
  return (
    <div style={styles.stepContent}>
      <h3 style={styles.stepTitle}>Review Template</h3>
      <p style={styles.helpText}>Please review your template configuration before creating.</p>

      <div style={styles.reviewSection}>
        <h4>Basic Information</h4>
        <div style={styles.reviewGrid}>
          <div><strong>Name:</strong> {formData.name || '(not set)'}</div>
          <div><strong>Type:</strong> {formData.type}</div>
          <div><strong>Category:</strong> {formData.category}</div>
          <div><strong>Status:</strong> {formData.active ? 'Active' : 'Inactive'}</div>
        </div>
      </div>

      <div style={styles.reviewSection}>
        <h4>Layout</h4>
        <div style={styles.reviewGrid}>
          <div><strong>Size:</strong> {formData.layout.width} x {formData.layout.height}px</div>
          <div><strong>Orientation:</strong> {formData.layout.orientation}</div>
          <div><strong>Background:</strong> {formData.layout.background_url ? (backgroundFilename || 'Custom image uploaded') : '(none)'}</div>
        </div>
      </div>

      <div style={styles.reviewSection}>
        <h4>Fields ({formData.fields.length})</h4>
        <div style={styles.reviewFieldList}>
          {formData.fields.length === 0 ? (
            <div style={{ color: '#888', fontStyle: 'italic' }}>No fields added</div>
          ) : (
            formData.fields.map((field, idx) => {
              const isLine = field.type.startsWith('line_');
              const mode = field.mode || 'static';
              return (
                <div key={idx} style={styles.reviewField}>
                  <strong>{field.key}</strong>
                  <span style={{ color: '#666', marginLeft: 8 }}>
                    ({field.type}{!isLine && `, ${mode}`})
                  </span>
                  {!isLine && (
                    <span style={{ marginLeft: 8, color: '#555' }}>
                      {mode === 'static' 
                        ? `"${field.staticContent || '(empty)'}"` 
                        : `[${field.placeholder || 'placeholder'}]`}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div style={styles.reviewSection}>
        <h4>Styles & Meta</h4>
        <div style={styles.reviewGrid}>
          <div><strong>Font:</strong> {formData.styles.global_font_family}</div>
          <div><strong>Theme:</strong> {formData.styles.color_theme}</div>
          <div><strong>Issued By:</strong> {formData.meta.issued_by_label}</div>
          <div><strong>Expiry:</strong> {formData.meta.default_expiry_months ? `${formData.meta.default_expiry_months} months` : 'Never'}</div>
          <div><strong>Signature:</strong> {formData.meta.signature_block.show ? formData.meta.signature_block.name || '(no name)' : 'Hidden'}</div>
        </div>
      </div>
    </div>
  );
}
