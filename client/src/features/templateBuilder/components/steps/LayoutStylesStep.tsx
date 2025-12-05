import React from 'react';
import { TemplateFormData } from '../../types';
import { LabelWithInfo, InfoIcon } from '../shared';
import { styles } from '../styles';
import { 
  FONT_FAMILIES, 
  ORIENTATIONS, 
  COLOR_THEMES, 
  BACKGROUND_SIZES, 
  BACKGROUND_POSITIONS 
} from '../../utils/constants';

interface LayoutStylesStepProps {
  formData: TemplateFormData;
  updateLayout: (key: string, value: any) => void;
  updateStyles: (key: string, value: any) => void;
  updateMeta: (key: string, value: any) => void;
  updateSignatureBlock: (key: string, value: any) => void;
  uploading: boolean;
  removing: boolean;
  backgroundFilename: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveBackground: () => void;
}

export function LayoutStylesStep({
  formData,
  updateLayout,
  updateStyles,
  updateMeta,
  updateSignatureBlock,
  uploading,
  removing,
  backgroundFilename,
  fileInputRef,
  onFileUpload,
  onRemoveBackground
}: LayoutStylesStepProps) {
  return (
    <div style={styles.stepContent}>
      <h3 style={styles.stepTitle}>Layout & Styles</h3>

      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Layout Settings</h4>
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <LabelWithInfo 
              label="Width (px)" 
              tooltip="The width of the certificate in pixels. Standard sizes: 1056px (letter landscape), 816px (letter portrait), 1920px (HD)."
            />
            <input
              type="number"
              value={formData.layout.width}
              onChange={e => updateLayout('width', parseInt(e.target.value) || 1056)}
              style={styles.input}
              min={400}
              max={2000}
            />
          </div>
          <div style={styles.formGroup}>
            <LabelWithInfo 
              label="Height (px)" 
              tooltip="The height of the certificate in pixels. Standard sizes: 816px (letter landscape), 1056px (letter portrait), 1080px (HD)."
            />
            <input
              type="number"
              value={formData.layout.height}
              onChange={e => updateLayout('height', parseInt(e.target.value) || 816)}
              style={styles.input}
              min={300}
              max={2000}
            />
          </div>
        </div>
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <LabelWithInfo 
              label="Orientation" 
              tooltip="Choose landscape for wide certificates, portrait for tall ones, or square for balanced designs."
            />
            <select
              value={formData.layout.orientation}
              onChange={e => updateLayout('orientation', e.target.value)}
              style={styles.input}
            >
              {ORIENTATIONS.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Background Image</h4>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Upload Background</label>
          <div style={styles.uploadArea}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileUpload}
              accept="image/png,image/jpeg,image/jpg,image/webp"
              style={{ display: 'none' }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={styles.uploadBtn}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Choose Image'}
            </button>
            <span style={styles.uploadHint}>PNG, JPG, WebP (max 5MB)</span>
          </div>
        </div>

        {formData.layout.background_url && (
          <>
            <div style={styles.uploadedIndicator}>
              <span style={styles.checkIcon}>&#10003;</span>
              <span style={styles.uploadedText}>
                {backgroundFilename || 'Background image uploaded'}
              </span>
            </div>
            
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Background Size</label>
                <select
                  value={formData.layout.background_size}
                  onChange={e => updateLayout('background_size', e.target.value)}
                  style={styles.input}
                >
                  {BACKGROUND_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Background Position</label>
                <select
                  value={formData.layout.background_position}
                  onChange={e => updateLayout('background_position', e.target.value)}
                  style={styles.input}
                >
                  {BACKGROUND_POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            
            <div style={styles.bgPreview}>
              <div style={{
                width: 200,
                height: 150,
                backgroundImage: `url(${formData.layout.background_url})`,
                backgroundSize: formData.layout.background_size,
                backgroundPosition: formData.layout.background_position,
                backgroundRepeat: 'no-repeat',
                border: '1px solid #ddd',
                borderRadius: 4
              }} />
              <button
                type="button"
                onClick={onRemoveBackground}
                style={styles.removeBtn}
                disabled={removing}
              >
                {removing ? 'Removing...' : 'Remove Background'}
              </button>
            </div>
          </>
        )}
      </div>

      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Global Styles</h4>
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Global Font Family</label>
            <select
              value={formData.styles.global_font_family}
              onChange={e => updateStyles('global_font_family', e.target.value)}
              style={styles.input}
            >
              {FONT_FAMILIES.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Color Theme</label>
            <select
              value={formData.styles.color_theme}
              onChange={e => updateStyles('color_theme', e.target.value)}
              style={styles.input}
            >
              {COLOR_THEMES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Meta Settings</h4>
        <div style={styles.formGroup}>
          <label style={styles.label}>Issued By Label</label>
          <input
            type="text"
            value={formData.meta.issued_by_label}
            onChange={e => updateMeta('issued_by_label', e.target.value)}
            style={styles.input}
            placeholder="e.g., NexSAA Academy"
          />
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Default Expiry (months)</label>
            <input
              type="number"
              value={formData.meta.default_expiry_months || ''}
              onChange={e => updateMeta('default_expiry_months', e.target.value ? parseInt(e.target.value) : null)}
              style={styles.input}
              placeholder="Leave empty for no expiry"
              min={1}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>&nbsp;</label>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.meta.allow_expiry_override}
                onChange={e => updateMeta('allow_expiry_override', e.target.checked)}
              />
              Allow expiry override per certificate
            </label>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={formData.meta.signature_block.show}
              onChange={e => updateSignatureBlock('show', e.target.checked)}
            />
            Show Signature Block
          </label>
        </div>

        {formData.meta.signature_block.show && (
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Signatory Name</label>
              <input
                type="text"
                value={formData.meta.signature_block.name}
                onChange={e => updateSignatureBlock('name', e.target.value)}
                style={styles.input}
                placeholder="e.g., John Smith"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Designation</label>
              <input
                type="text"
                value={formData.meta.signature_block.designation}
                onChange={e => updateSignatureBlock('designation', e.target.value)}
                style={styles.input}
                placeholder="e.g., Director of Education"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
