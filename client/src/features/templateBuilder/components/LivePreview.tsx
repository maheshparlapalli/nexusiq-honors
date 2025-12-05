import React from 'react';
import { TemplateFormData } from '../types';
import { getThemeColors } from '../utils/constants';
import { styles } from './styles';

interface LivePreviewProps {
  formData: TemplateFormData;
}

export function LivePreview({ formData }: LivePreviewProps) {
  const { layout, fields, styles: formStyles } = formData;
  const scale = Math.min(350 / layout.width, 280 / layout.height);
  const colors = getThemeColors(formStyles.color_theme);

  return (
    <div style={styles.previewPanel}>
      <h4 style={styles.previewTitle}>Live Preview</h4>
      <div style={styles.previewScaleContainer}>
        <div style={{
          width: layout.width * scale,
          height: layout.height * scale,
          backgroundColor: '#fff',
          backgroundImage: layout.background_url ? `url(${layout.background_url})` : 'none',
          backgroundSize: layout.background_size || 'cover',
          backgroundPosition: layout.background_position || 'center',
          backgroundRepeat: 'no-repeat',
          border: `3px solid ${colors.border}`,
          borderRadius: 8,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          {fields.length === 0 && !layout.background_url && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: '#999',
              fontSize: Math.max(8, 12 * scale)
            }}>
              <div style={{ marginBottom: 8 }}>Empty Template</div>
              <div style={{ fontSize: Math.max(6, 10 * scale) }}>Add fields to see them here</div>
            </div>
          )}

          {fields.map((field, idx) => {
            if (field.type === 'line_horizontal') {
              return (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: field.position.x * scale,
                    top: field.position.y * scale,
                    transform: 'translateX(-50%)',
                    width: (field.line?.width || 200) * scale,
                    height: (field.line?.height || 2) * scale,
                    backgroundColor: field.line?.color || '#333333'
                  }}
                  title={field.label || field.key || 'Horizontal Line'}
                />
              );
            }
            if (field.type === 'line_vertical') {
              return (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: field.position.x * scale,
                    top: field.position.y * scale,
                    transform: 'translateX(-50%)',
                    width: (field.line?.height || 2) * scale,
                    height: (field.line?.width || 200) * scale,
                    backgroundColor: field.line?.color || '#333333'
                  }}
                  title={field.label || field.key || 'Vertical Line'}
                />
              );
            }
            
            const isStatic = (field.mode || 'static') === 'static';
            const displayText = isStatic 
              ? (field.staticContent || field.label || `[Static Field ${idx + 1}]`)
              : `[${field.placeholder || field.label || 'Dynamic Field'}]`;
            
            return (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  left: field.position.x * scale,
                  top: field.position.y * scale,
                  transform: 'translateX(-50%)',
                  fontSize: Math.max(6, field.font.size * scale),
                  color: isStatic ? field.font.color : '#666',
                  fontFamily: field.font.family,
                  fontWeight: field.font.weight as any,
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                  fontStyle: isStatic ? 'normal' : 'italic'
                }}
                title={isStatic ? 'Static: ' + (field.staticContent || field.label) : 'Dynamic: ' + (field.placeholder || field.label)}
              >
                {displayText}
              </div>
            );
          })}
        </div>
        
        <div style={styles.previewMeta}>
          <span>{layout.width} x {layout.height}px</span>
          <span>{layout.orientation}</span>
          <span>{fields.length} fields</span>
        </div>
      </div>
    </div>
  );
}
