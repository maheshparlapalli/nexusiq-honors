import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'wouter';

interface FieldConfig {
  key: string;
  label: string;
  type: string;
  placeholder: string;
  position: { x: number; y: number };
  font: { size: number; color: string; weight: string; family: string };
}

interface TemplateFormData {
  name: string;
  type: string;
  category: string;
  layout: {
    background_url: string;
    width: number;
    height: number;
    orientation: string;
  };
  fields: FieldConfig[];
  styles: {
    global_font_family: string;
    color_theme: string;
  };
  meta: {
    default_expiry_months: number | null;
    allow_expiry_override: boolean;
    issued_by_label: string;
    signature_block: {
      show: boolean;
      signature_url: string;
      name: string;
      designation: string;
    };
    seal_url: string;
  };
  active: boolean;
}

const INITIAL_FORM_DATA: TemplateFormData = {
  name: '',
  type: 'certificate',
  category: 'course',
  layout: {
    background_url: '',
    width: 1056,
    height: 816,
    orientation: 'landscape'
  },
  fields: [],
  styles: {
    global_font_family: 'Georgia',
    color_theme: 'classic-blue'
  },
  meta: {
    default_expiry_months: null,
    allow_expiry_override: false,
    issued_by_label: 'NexSAA Academy',
    signature_block: {
      show: true,
      signature_url: '',
      name: '',
      designation: ''
    },
    seal_url: ''
  },
  active: true
};

const EMPTY_FIELD: FieldConfig = {
  key: '',
  label: '',
  type: 'text',
  placeholder: '',
  position: { x: 528, y: 400 },
  font: { size: 24, color: '#333333', weight: 'normal', family: 'Arial' }
};

const FIELD_TYPES = ['text', 'date', 'number', 'textarea', 'image'];
const FONT_FAMILIES = ['Georgia', 'Arial', 'Times New Roman', 'Helvetica', 'Roboto', 'Verdana', 'Courier New'];
const FONT_WEIGHTS = ['normal', 'bold', 'lighter'];
const ORIENTATIONS = ['landscape', 'portrait', 'square'];
const COLOR_THEMES = ['classic-blue', 'achievement-gold', 'event-purple', 'custom-teal', 'professional-navy', 'modern-green'];

export default function TemplateBuilder() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<TemplateFormData>(INITIAL_FORM_DATA);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = 5;

  function updateLayout(key: string, value: any) {
    setFormData(prev => ({
      ...prev,
      layout: { ...prev.layout, [key]: value }
    }));
  }

  function updateStyles(key: string, value: any) {
    setFormData(prev => ({
      ...prev,
      styles: { ...prev.styles, [key]: value }
    }));
  }

  function updateMeta(key: string, value: any) {
    setFormData(prev => ({
      ...prev,
      meta: { ...prev.meta, [key]: value }
    }));
  }

  function updateSignatureBlock(key: string, value: any) {
    setFormData(prev => ({
      ...prev,
      meta: {
        ...prev.meta,
        signature_block: { ...prev.meta.signature_block, [key]: value }
      }
    }));
  }

  function addField() {
    const newField = { 
      ...EMPTY_FIELD, 
      key: `field_${formData.fields.length + 1}`,
      position: { x: 528, y: 300 + (formData.fields.length * 60) }
    };
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  }

  function updateField(index: number, updates: Partial<FieldConfig>) {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) => i === index ? { ...f, ...updates } : f)
    }));
  }

  function updateFieldPosition(index: number, axis: 'x' | 'y', value: number) {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) => 
        i === index ? { ...f, position: { ...f.position, [axis]: value } } : f
      )
    }));
  }

  function updateFieldFont(index: number, key: string, value: any) {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) => 
        i === index ? { ...f, font: { ...f.font, [key]: value } } : f
      )
    }));
  }

  function removeField(index: number) {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
  }

  function moveField(index: number, direction: 'up' | 'down') {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === formData.fields.length - 1)) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newFields = [...formData.fields];
    [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
    setFormData(prev => ({ ...prev, fields: newFields }));
  }

  async function handleSubmit() {
    if (!formData.name.trim()) {
      setError('Please enter a template name');
      setStep(1);
      return;
    }
    if (formData.fields.length === 0) {
      setError('Please add at least one field');
      setStep(2);
      return;
    }
    
    const emptyFields = formData.fields.filter(f => !f.key.trim() || !f.label.trim());
    if (emptyFields.length > 0) {
      setError('All fields must have a key and label. Please complete all field information.');
      setStep(2);
      return;
    }
    
    const keys = formData.fields.map(f => f.key.trim().toLowerCase());
    const duplicateKeys = keys.filter((key, index) => keys.indexOf(key) !== index);
    if (duplicateKeys.length > 0) {
      setError(`Duplicate field keys found: ${[...new Set(duplicateKeys)].join(', ')}. Each field must have a unique key.`);
      setStep(2);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const templateData = {
        client_id: 'nexsaa-demo',
        ...formData,
        version: 1
      };

      await axios.post('/api/v1/templates', templateData);
      setLocation('/templates');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create template');
    } finally {
      setSaving(false);
    }
  }

  function renderStepIndicator() {
    const steps = ['Basic Info', 'Fields', 'Layout', 'Styles', 'Review'];
    return (
      <div style={styles.stepIndicator}>
        {steps.map((label, i) => (
          <div 
            key={i} 
            style={{
              ...styles.stepItem,
              ...(step === i + 1 ? styles.stepActive : {}),
              ...(step > i + 1 ? styles.stepCompleted : {})
            }}
            onClick={() => setStep(i + 1)}
          >
            <div style={styles.stepNumber}>{i + 1}</div>
            <span style={styles.stepLabel}>{label}</span>
          </div>
        ))}
      </div>
    );
  }

  function renderStep1() {
    return (
      <div style={styles.stepContent}>
        <h3 style={styles.stepTitle}>Basic Information</h3>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Template Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            style={styles.input}
            placeholder="e.g., Advanced Course Certificate"
          />
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Type</label>
            <select
              value={formData.type}
              onChange={e => {
                const type = e.target.value;
                const isBadge = type === 'badge';
                setFormData(prev => ({
                  ...prev,
                  type,
                  layout: {
                    ...prev.layout,
                    width: isBadge ? 400 : 1056,
                    height: isBadge ? 400 : 816,
                    orientation: isBadge ? 'square' : 'landscape'
                  }
                }));
              }}
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
              onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
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
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={formData.active}
              onChange={e => setFormData(prev => ({ ...prev, active: e.target.checked }))}
            />
            Template Active (can be used to issue certificates)
          </label>
        </div>
      </div>
    );
  }

  function InfoIcon({ tooltip }: { tooltip: string }) {
    const [showTooltip, setShowTooltip] = useState(false);
    return (
      <span 
        style={styles.infoIcon}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
      >
        ⓘ
        {showTooltip && (
          <span style={styles.tooltip}>{tooltip}</span>
        )}
      </span>
    );
  }

  function LabelWithInfo({ label, tooltip }: { label: string; tooltip: string }) {
    return (
      <label style={styles.labelWithInfo}>
        {label}
        <InfoIcon tooltip={tooltip} />
      </label>
    );
  }

  function renderStep2() {
    return (
      <div style={styles.stepContent}>
        <h3 style={styles.stepTitle}>Template Fields</h3>
        <p style={styles.helpText}>Define the dynamic fields that will be populated when issuing certificates.</p>

        <button onClick={addField} style={styles.addBtn}>+ Add Field</button>

        {formData.fields.length === 0 && (
          <div style={styles.emptyFields}>
            No fields added yet. Click "Add Field" to create your first field.
          </div>
        )}

        {formData.fields.map((field, index) => (
          <div key={index} style={styles.fieldCard}>
            <div style={styles.fieldHeader}>
              <span style={styles.fieldIndex}>Field {index + 1}</span>
              <div style={styles.fieldActions}>
                <button onClick={() => moveField(index, 'up')} style={styles.iconBtn} disabled={index === 0}>↑</button>
                <button onClick={() => moveField(index, 'down')} style={styles.iconBtn} disabled={index === formData.fields.length - 1}>↓</button>
                <button onClick={() => removeField(index)} style={styles.deleteBtn}>Remove</button>
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <LabelWithInfo 
                  label="Key (identifier)" 
                  tooltip="A unique identifier for this field used in the system (e.g., recipient_name, course_title). Use lowercase with underscores, no spaces."
                />
                <input
                  type="text"
                  value={field.key}
                  onChange={e => updateField(index, { key: e.target.value })}
                  style={styles.input}
                  placeholder="e.g., recipient_name"
                />
              </div>
              <div style={styles.formGroup}>
                <LabelWithInfo 
                  label="Label" 
                  tooltip="The display name shown to users when filling out the certificate. This is the human-readable version of the key (e.g., 'Recipient Name', 'Course Title')."
                />
                <input
                  type="text"
                  value={field.label}
                  onChange={e => updateField(index, { label: e.target.value })}
                  style={styles.input}
                  placeholder="e.g., Recipient Name"
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <LabelWithInfo 
                  label="Field Type" 
                  tooltip="The type of data this field accepts: 'text' for names/titles, 'date' for dates, 'number' for scores/grades, 'textarea' for longer text, 'image' for photos."
                />
                <select
                  value={field.type}
                  onChange={e => updateField(index, { type: e.target.value })}
                  style={styles.input}
                >
                  {FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={styles.formGroup}>
                <LabelWithInfo 
                  label="Placeholder" 
                  tooltip="Example text shown in the input field before the user enters a value. Helps guide users on what to enter (e.g., 'Enter student name...')."
                />
                <input
                  type="text"
                  value={field.placeholder}
                  onChange={e => updateField(index, { placeholder: e.target.value })}
                  style={styles.input}
                  placeholder="e.g., Enter name..."
                />
              </div>
            </div>

            <div style={styles.sectionLabel}>Position <InfoIcon tooltip="Controls where this field appears on the certificate. X is horizontal position (left/right), Y is vertical position (top/bottom). Values are in pixels from the top-left corner." /></div>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <LabelWithInfo 
                  label="X Position (px)" 
                  tooltip="Horizontal position from the left edge. For centered text, use half the template width (e.g., 528 for a 1056px wide certificate)."
                />
                <input
                  type="number"
                  value={field.position.x}
                  onChange={e => updateFieldPosition(index, 'x', parseInt(e.target.value) || 0)}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <LabelWithInfo 
                  label="Y Position (px)" 
                  tooltip="Vertical position from the top edge. Lower values place the field higher on the certificate. Space fields 50-80px apart for readability."
                />
                <input
                  type="number"
                  value={field.position.y}
                  onChange={e => updateFieldPosition(index, 'y', parseInt(e.target.value) || 0)}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.sectionLabel}>Font Settings <InfoIcon tooltip="Controls how the text appears on the certificate. Larger fonts (36-48px) work well for names, smaller fonts (18-24px) for dates and details." /></div>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <LabelWithInfo 
                  label="Font Family" 
                  tooltip="The typeface for this field. Georgia and Times New Roman are classic/formal, Arial and Helvetica are modern/clean, Roboto is contemporary."
                />
                <select
                  value={field.font.family}
                  onChange={e => updateFieldFont(index, 'family', e.target.value)}
                  style={styles.input}
                >
                  {FONT_FAMILIES.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div style={styles.formGroup}>
                <LabelWithInfo 
                  label="Size (px)" 
                  tooltip="Font size in pixels. Recommended: 36-48px for recipient names, 24-32px for titles, 16-20px for dates and small text."
                />
                <input
                  type="number"
                  value={field.font.size}
                  onChange={e => updateFieldFont(index, 'size', parseInt(e.target.value) || 12)}
                  style={styles.input}
                  min={8}
                  max={120}
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <LabelWithInfo 
                  label="Font Weight" 
                  tooltip="Text thickness. 'bold' for emphasis (names, titles), 'normal' for regular text (dates, details), 'lighter' for subtle text."
                />
                <select
                  value={field.font.weight}
                  onChange={e => updateFieldFont(index, 'weight', e.target.value)}
                  style={styles.input}
                >
                  {FONT_WEIGHTS.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              <div style={styles.formGroup}>
                <LabelWithInfo 
                  label="Color" 
                  tooltip="Text color. Dark colors (#333333, #1a1a1a) for main text, accent colors for highlights. Click the color box or enter a hex code."
                />
                <div style={styles.colorInputWrapper}>
                  <input
                    type="color"
                    value={field.font.color}
                    onChange={e => updateFieldFont(index, 'color', e.target.value)}
                    style={styles.colorInput}
                  />
                  <input
                    type="text"
                    value={field.font.color}
                    onChange={e => updateFieldFont(index, 'color', e.target.value)}
                    style={styles.colorText}
                    placeholder="#333333"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  function renderStep3() {
    return (
      <div style={styles.stepContent}>
        <h3 style={styles.stepTitle}>Layout Settings</h3>

        <div style={styles.formGroup}>
          <label style={styles.label}>Background Image URL</label>
          <input
            type="text"
            value={formData.layout.background_url}
            onChange={e => updateLayout('background_url', e.target.value)}
            style={styles.input}
            placeholder="https://example.com/background.png or /templates/bg.png"
          />
          <small style={styles.helpText}>Enter a URL to your background image or leave empty for default styling</small>
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Width (px)</label>
            <input
              type="number"
              value={formData.layout.width}
              onChange={e => updateLayout('width', parseInt(e.target.value) || 1056)}
              style={styles.input}
              min={200}
              max={2000}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Height (px)</label>
            <input
              type="number"
              value={formData.layout.height}
              onChange={e => updateLayout('height', parseInt(e.target.value) || 816)}
              style={styles.input}
              min={200}
              max={2000}
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Orientation</label>
          <select
            value={formData.layout.orientation}
            onChange={e => updateLayout('orientation', e.target.value)}
            style={styles.input}
          >
            {ORIENTATIONS.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
          </select>
        </div>

        <div style={styles.previewBox}>
          <h4>Layout Preview</h4>
          <div style={{
            width: Math.min(formData.layout.width / 3, 300),
            height: Math.min(formData.layout.height / 3, 250),
            border: '2px solid #1a365d',
            backgroundColor: '#f8f9fa',
            backgroundImage: formData.layout.background_url ? `url(${formData.layout.background_url})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
            fontSize: 12
          }}>
            {formData.layout.width} x {formData.layout.height}
          </div>
        </div>
      </div>
    );
  }

  function renderStep4() {
    return (
      <div style={styles.stepContent}>
        <h3 style={styles.stepTitle}>Styles & Meta Settings</h3>

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
          <h4 style={styles.sectionTitle}>Certificate Settings</h4>
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
                Allow Expiry Override
              </label>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Signature Block</h4>
          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.meta.signature_block.show}
                onChange={e => updateSignatureBlock('show', e.target.checked)}
              />
              Show Signature Block on Certificate
            </label>
          </div>

          {formData.meta.signature_block.show && (
            <>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Signatory Name</label>
                  <input
                    type="text"
                    value={formData.meta.signature_block.name}
                    onChange={e => updateSignatureBlock('name', e.target.value)}
                    style={styles.input}
                    placeholder="e.g., Dr. John Smith"
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
              <div style={styles.formGroup}>
                <label style={styles.label}>Signature Image URL</label>
                <input
                  type="text"
                  value={formData.meta.signature_block.signature_url}
                  onChange={e => updateSignatureBlock('signature_url', e.target.value)}
                  style={styles.input}
                  placeholder="https://example.com/signature.png"
                />
              </div>
            </>
          )}
        </div>

        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Seal</h4>
          <div style={styles.formGroup}>
            <label style={styles.label}>Seal Image URL</label>
            <input
              type="text"
              value={formData.meta.seal_url}
              onChange={e => updateMeta('seal_url', e.target.value)}
              style={styles.input}
              placeholder="https://example.com/seal.png"
            />
          </div>
        </div>
      </div>
    );
  }

  function renderStep5() {
    return (
      <div style={styles.stepContent}>
        <h3 style={styles.stepTitle}>Review & Create</h3>

        <div style={styles.reviewSection}>
          <h4>Basic Information</h4>
          <div style={styles.reviewGrid}>
            <div><strong>Name:</strong> {formData.name || '(not set)'}</div>
            <div><strong>Type:</strong> {formData.type}</div>
            <div><strong>Category:</strong> {formData.category}</div>
            <div><strong>Active:</strong> {formData.active ? 'Yes' : 'No'}</div>
          </div>
        </div>

        <div style={styles.reviewSection}>
          <h4>Layout</h4>
          <div style={styles.reviewGrid}>
            <div><strong>Size:</strong> {formData.layout.width} x {formData.layout.height}px</div>
            <div><strong>Orientation:</strong> {formData.layout.orientation}</div>
            <div><strong>Background:</strong> {formData.layout.background_url || '(default)'}</div>
          </div>
        </div>

        <div style={styles.reviewSection}>
          <h4>Fields ({formData.fields.length})</h4>
          {formData.fields.length === 0 ? (
            <p style={styles.warning}>No fields defined. Please go back and add at least one field.</p>
          ) : (
            <div style={styles.fieldsList}>
              {formData.fields.map((f, i) => (
                <div key={i} style={styles.reviewField}>
                  <strong>{f.key}</strong> ({f.type}) - {f.font.family} {f.font.size}px at ({f.position.x}, {f.position.y})
                </div>
              ))}
            </div>
          )}
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

  function getThemeColors(theme: string) {
    const themes: Record<string, { primary: string; secondary: string; accent: string; border: string }> = {
      'classic-blue': { primary: '#1a365d', secondary: '#2c5282', accent: '#3182ce', border: '#90cdf4' },
      'achievement-gold': { primary: '#744210', secondary: '#975a16', accent: '#d69e2e', border: '#ecc94b' },
      'event-purple': { primary: '#44337a', secondary: '#553c9a', accent: '#805ad5', border: '#b794f4' },
      'custom-teal': { primary: '#234e52', secondary: '#285e61', accent: '#319795', border: '#81e6d9' },
      'professional-navy': { primary: '#1a202c', secondary: '#2d3748', accent: '#4a5568', border: '#a0aec0' },
      'modern-green': { primary: '#22543d', secondary: '#276749', accent: '#38a169', border: '#9ae6b4' }
    };
    return themes[theme] || themes['classic-blue'];
  }

  function renderLivePreview() {
    const { layout, fields, styles: formStyles, meta, type, name, category } = formData;
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
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: `3px solid ${colors.border}`,
            borderRadius: 8,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            {!layout.background_url && (
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: `linear-gradient(135deg, ${colors.border}22 0%, ${colors.primary}11 100%)`,
                borderTop: `${8 * scale}px solid ${colors.primary}`,
                borderBottom: `${8 * scale}px solid ${colors.primary}`
              }} />
            )}
            
            <div style={{
              position: 'absolute',
              top: 30 * scale,
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
              width: '80%'
            }}>
              <div style={{
                fontSize: Math.max(8, 14 * scale),
                color: colors.primary,
                fontFamily: formStyles.global_font_family,
                textTransform: 'uppercase',
                letterSpacing: 2 * scale,
                marginBottom: 8 * scale
              }}>
                {type === 'badge' ? 'Badge of' : 'Certificate of'}
              </div>
              <div style={{
                fontSize: Math.max(10, 20 * scale),
                fontWeight: 'bold',
                color: colors.secondary,
                fontFamily: formStyles.global_font_family
              }}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </div>
            </div>

            {fields.map((field, idx) => (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  left: field.position.x * scale,
                  top: field.position.y * scale,
                  transform: 'translateX(-50%)',
                  fontSize: Math.max(6, field.font.size * scale),
                  color: field.font.color,
                  fontFamily: field.font.family,
                  fontWeight: field.font.weight as any,
                  whiteSpace: 'nowrap',
                  textAlign: 'center'
                }}
              >
                [{field.label || field.key || `Field ${idx + 1}`}]
              </div>
            ))}

            {meta.signature_block.show && type === 'certificate' && (
              <div style={{
                position: 'absolute',
                bottom: 60 * scale,
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                borderTop: `1px solid ${colors.primary}`,
                paddingTop: 8 * scale,
                minWidth: 120 * scale
              }}>
                <div style={{ fontSize: Math.max(6, 10 * scale), color: colors.primary, fontFamily: formStyles.global_font_family }}>
                  {meta.signature_block.name || 'Signatory Name'}
                </div>
                <div style={{ fontSize: Math.max(5, 8 * scale), color: '#666', fontStyle: 'italic' }}>
                  {meta.signature_block.designation || 'Designation'}
                </div>
              </div>
            )}

            {meta.issued_by_label && (
              <div style={{
                position: 'absolute',
                bottom: 20 * scale,
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: Math.max(5, 8 * scale),
                color: colors.primary,
                fontFamily: formStyles.global_font_family
              }}>
                Issued by {meta.issued_by_label}
              </div>
            )}
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

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Create New Template</h2>
          <button onClick={() => setLocation('/templates')} style={styles.backBtn}>
            Back to Templates
          </button>
        </div>

        {renderStepIndicator()}

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.mainLayout}>
          <div style={styles.formContainer}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
            {step === 5 && renderStep5()}
          </div>
          
          {renderLivePreview()}
        </div>

        <div style={styles.navigation}>
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            style={styles.navBtn}
            disabled={step === 1}
          >
            Previous
          </button>
          
          {step < totalSteps ? (
            <button
              onClick={() => setStep(Math.min(totalSteps, step + 1))}
              style={styles.navBtnPrimary}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              style={styles.submitBtn}
              disabled={saving}
            >
              {saving ? 'Creating...' : 'Create Template'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  pageContainer: { backgroundColor: '#f5f5f5', minHeight: '100vh' },
  container: { maxWidth: 1200, margin: '0 auto', padding: 20 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { margin: 0, fontSize: 28, color: '#333' },
  backBtn: { padding: '8px 16px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer' },
  stepIndicator: { display: 'flex', justifyContent: 'space-between', marginBottom: 30, padding: '0 20px' },
  mainLayout: { display: 'flex', gap: 24, alignItems: 'flex-start' },
  stepItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', opacity: 0.5 },
  stepActive: { opacity: 1 },
  stepCompleted: { opacity: 0.8 },
  stepNumber: { 
    width: 32, height: 32, borderRadius: '50%', backgroundColor: '#e0e0e0', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', 
    fontWeight: 'bold', marginBottom: 4 
  },
  stepLabel: { fontSize: 12, color: '#666' },
  formContainer: { flex: 1, backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, padding: 30, marginBottom: 20 },
  stepContent: {},
  stepTitle: { margin: '0 0 20px 0', fontSize: 22, color: '#333', borderBottom: '2px solid #e0e0e0', paddingBottom: 10 },
  formGroup: { marginBottom: 16, flex: 1 },
  formRow: { display: 'flex', gap: 16 },
  label: { display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500, color: '#333' },
  input: { width: '100%', padding: '10px 12px', borderRadius: 4, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#333', cursor: 'pointer', padding: '10px 0' },
  helpText: { fontSize: 12, color: '#888', marginTop: 4 },
  navigation: { display: 'flex', justifyContent: 'space-between' },
  navBtn: { padding: '12px 24px', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer', fontSize: 14 },
  navBtnPrimary: { padding: '12px 24px', backgroundColor: '#1976D2', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontWeight: 600 },
  submitBtn: { padding: '12px 32px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontWeight: 600 },
  error: { backgroundColor: '#ffebee', color: '#c62828', padding: 12, borderRadius: 4, marginBottom: 20 },
  addBtn: { padding: '10px 20px', backgroundColor: '#1976D2', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', marginBottom: 20, fontSize: 14 },
  emptyFields: { textAlign: 'center', padding: 40, color: '#666', backgroundColor: '#f9f9f9', borderRadius: 8 },
  fieldCard: { border: '1px solid #e0e0e0', borderRadius: 8, padding: 20, marginBottom: 16, backgroundColor: '#fafafa' },
  fieldHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  fieldIndex: { fontWeight: 600, color: '#1976D2' },
  fieldActions: { display: 'flex', gap: 8 },
  iconBtn: { padding: '4px 8px', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer' },
  deleteBtn: { padding: '4px 12px', backgroundColor: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', borderRadius: 4, cursor: 'pointer' },
  sectionLabel: { fontSize: 13, fontWeight: 600, color: '#666', marginTop: 16, marginBottom: 8, textTransform: 'uppercase' },
  colorInputWrapper: { display: 'flex', gap: 8 },
  colorInput: { width: 50, height: 38, padding: 2, border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer' },
  colorText: { flex: 1, padding: '10px 12px', borderRadius: 4, border: '1px solid #ddd', fontSize: 14 },
  previewBox: { marginTop: 20, padding: 20, backgroundColor: '#f5f5f5', borderRadius: 8, textAlign: 'center' },
  section: { marginBottom: 30, paddingBottom: 20, borderBottom: '1px solid #eee' },
  sectionTitle: { margin: '0 0 16px 0', fontSize: 16, color: '#1976D2' },
  reviewSection: { marginBottom: 20, padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8 },
  reviewGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, fontSize: 14 },
  fieldsList: { display: 'flex', flexDirection: 'column', gap: 8 },
  reviewField: { padding: 8, backgroundColor: '#fff', borderRadius: 4, fontSize: 13, border: '1px solid #e0e0e0' },
  warning: { color: '#f57c00', fontWeight: 500 },
  previewPanel: { 
    width: 400, 
    backgroundColor: '#fff', 
    border: '1px solid #e0e0e0', 
    borderRadius: 8, 
    padding: 20, 
    position: 'sticky',
    top: 20
  },
  previewTitle: { 
    margin: '0 0 16px 0', 
    fontSize: 16, 
    color: '#333', 
    textAlign: 'center',
    borderBottom: '1px solid #eee',
    paddingBottom: 12
  },
  previewScaleContainer: { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center' 
  },
  previewMeta: { 
    display: 'flex', 
    gap: 16, 
    marginTop: 12, 
    fontSize: 12, 
    color: '#666' 
  },
  infoIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 16,
    height: 16,
    marginLeft: 6,
    fontSize: 12,
    color: '#1976D2',
    cursor: 'pointer',
    position: 'relative',
    verticalAlign: 'middle'
  },
  tooltip: {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#333',
    color: '#fff',
    padding: '10px 14px',
    borderRadius: 6,
    fontSize: 12,
    lineHeight: 1.5,
    width: 260,
    textAlign: 'left',
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    marginBottom: 8,
    fontWeight: 'normal'
  },
  labelWithInfo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 6,
    fontSize: 14,
    fontWeight: 500,
    color: '#333'
  }
};
