import React from 'react';
import { FieldConfig } from '../../types';
import { LabelWithInfo, InfoIcon } from '../shared';
import { styles } from '../styles';
import { FIELD_TYPES, FONT_FAMILIES, FONT_WEIGHTS } from '../../utils/constants';

interface FieldCardProps {
  field: FieldConfig;
  index: number;
  totalFields: number;
  updateField: (index: number, updates: Partial<FieldConfig>) => void;
  updateFieldPosition: (index: number, axis: 'x' | 'y', value: number) => void;
  updateFieldLine: (index: number, key: string, value: any) => void;
  removeField: (index: number) => void;
  moveField: (index: number, direction: 'up' | 'down') => void;
}

export function FieldCard({
  field,
  index,
  totalFields,
  updateField,
  updateFieldPosition,
  updateFieldLine,
  removeField,
  moveField
}: FieldCardProps) {
  const isLine = field.type.startsWith('line_');

  return (
    <div style={styles.fieldCard}>
      <div style={styles.fieldHeader}>
        <span style={styles.fieldIndex}>Field {index + 1}</span>
        <div style={styles.fieldActions}>
          <button onClick={() => moveField(index, 'up')} style={styles.iconBtn} disabled={index === 0}>↑</button>
          <button onClick={() => moveField(index, 'down')} style={styles.iconBtn} disabled={index === totalFields - 1}>↓</button>
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
            placeholder={isLine ? 'No Label Required' : 'e.g., Recipient Name'}
          />
        </div>
      </div>

      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <LabelWithInfo 
            label="Field Type" 
            tooltip="Choose the type: 'text' for names/titles, 'date' for dates, 'number' for scores, 'image' for photos, 'line_horizontal' or 'line_vertical' for decorative lines."
          />
          <select
            value={field.type}
            onChange={e => updateField(index, { type: e.target.value })}
            style={styles.input}
          >
            {FIELD_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
          </select>
        </div>
        {!isLine && (
          <div style={styles.formGroup}>
            <LabelWithInfo 
              label="Content Mode" 
              tooltip="Static: Fixed text that stays the same on every certificate (e.g., 'Certificate of Participation'). Dynamic: Placeholder that gets filled with different data for each recipient (e.g., student name)."
            />
            <select
              value={field.mode || 'static'}
              onChange={e => updateField(index, { mode: e.target.value as 'static' | 'dynamic' })}
              style={styles.input}
            >
              <option value="static">Static (Fixed Text)</option>
              <option value="dynamic">Dynamic (Per Recipient)</option>
            </select>
          </div>
        )}
      </div>

      {!isLine && (
        <div style={styles.formRow}>
          {(field.mode || 'static') === 'static' ? (
            <div style={{ ...styles.formGroup, flex: 1 }}>
              <LabelWithInfo 
                label="Static Content" 
                tooltip="The exact text that will appear on every certificate. This won't change per recipient."
              />
              <input
                type="text"
                value={field.staticContent || ''}
                onChange={e => updateField(index, { staticContent: e.target.value })}
                style={styles.input}
                placeholder="e.g., Certificate of Participation"
              />
            </div>
          ) : (
            <div style={{ ...styles.formGroup, flex: 1 }}>
              <LabelWithInfo 
                label="Placeholder Text" 
                tooltip="Sample text shown in the preview to indicate what data will be filled. Shown in brackets like [Student Name]."
              />
              <input
                type="text"
                value={field.placeholder || ''}
                onChange={e => updateField(index, { placeholder: e.target.value })}
                style={styles.input}
                placeholder="e.g., Student Name"
              />
            </div>
          )}
        </div>
      )}

      <div style={styles.sectionLabel}>Position <InfoIcon tooltip="Controls where this field appears on the certificate. X is horizontal position (left/right), Y is vertical position (top/bottom). Values are in pixels from the top-left corner." /></div>
      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <LabelWithInfo 
            label="X Position (px)" 
            tooltip="Horizontal position from the left edge. For centered elements, use half the template width (e.g., 528 for a 1056px wide certificate)."
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
            tooltip="Vertical position from the top edge. Lower values place the element higher on the certificate. Space elements 50-80px apart for readability."
          />
          <input
            type="number"
            value={field.position.y}
            onChange={e => updateFieldPosition(index, 'y', parseInt(e.target.value) || 0)}
            style={styles.input}
          />
        </div>
      </div>

      {isLine ? (
        <>
          <div style={styles.sectionLabel}>Line Settings <InfoIcon tooltip="Configure the appearance of this decorative line. Adjust length, thickness, and color to match your design." /></div>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <LabelWithInfo 
                label="Length (px)" 
                tooltip="The length of the line in pixels. For signature lines, 150-250px works well. For decorative dividers, try 300-500px."
              />
              <input
                type="number"
                value={field.line?.width || 200}
                onChange={e => updateFieldLine(index, 'width', parseInt(e.target.value) || 200)}
                style={styles.input}
                min={10}
                max={1000}
              />
            </div>
            <div style={styles.formGroup}>
              <LabelWithInfo 
                label="Thickness (px)" 
                tooltip="The thickness of the line in pixels. Use 1-2px for subtle lines, 3-5px for visible dividers, 6+ for bold decorative elements."
              />
              <input
                type="number"
                value={field.line?.height || 2}
                onChange={e => updateFieldLine(index, 'height', parseInt(e.target.value) || 2)}
                style={styles.input}
                min={1}
                max={20}
              />
            </div>
          </div>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <LabelWithInfo 
                label="Line Color" 
                tooltip="The color of the line. Match your theme colors or use subtle grays for understated dividers."
              />
              <div style={styles.colorInputWrapper}>
                <input
                  type="color"
                  value={field.line?.color || '#333333'}
                  onChange={e => updateFieldLine(index, 'color', e.target.value)}
                  style={styles.colorInput}
                />
                <input
                  type="text"
                  value={field.line?.color || '#333333'}
                  onChange={e => updateFieldLine(index, 'color', e.target.value)}
                  style={styles.colorText}
                  placeholder="#333333"
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div style={styles.sectionLabel}>Font Settings <InfoIcon tooltip="Customize the appearance of text for this field. Adjust font family, size, weight, and color to match your design." /></div>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <LabelWithInfo 
                label="Font Family" 
                tooltip="Choose a font that matches your certificate style. Use serif fonts (Georgia, Times) for formal certificates, sans-serif (Arial, Helvetica) for modern designs."
              />
              <select
                value={field.font.family}
                onChange={e => updateField(index, { font: { ...field.font, family: e.target.value } })}
                style={styles.input}
              >
                {FONT_FAMILIES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div style={styles.formGroup}>
              <LabelWithInfo 
                label="Font Size (px)" 
                tooltip="Size in pixels. Titles: 36-48px, Headings: 24-32px, Body text: 16-20px, Fine print: 12-14px."
              />
              <input
                type="number"
                value={field.font.size}
                onChange={e => updateField(index, { font: { ...field.font, size: parseInt(e.target.value) || 24 } })}
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
                tooltip="Normal for body text, Bold for titles and emphasis, Lighter for subtle secondary information."
              />
              <select
                value={field.font.weight}
                onChange={e => updateField(index, { font: { ...field.font, weight: e.target.value } })}
                style={styles.input}
              >
                {FONT_WEIGHTS.map(w => <option key={w} value={w}>{w.charAt(0).toUpperCase() + w.slice(1)}</option>)}
              </select>
            </div>
            <div style={styles.formGroup}>
              <LabelWithInfo 
                label="Font Color" 
                tooltip="Choose a color that contrasts well with your background. Dark colors work best on light backgrounds."
              />
              <div style={styles.colorInputWrapper}>
                <input
                  type="color"
                  value={field.font.color}
                  onChange={e => updateField(index, { font: { ...field.font, color: e.target.value } })}
                  style={styles.colorInput}
                />
                <input
                  type="text"
                  value={field.font.color}
                  onChange={e => updateField(index, { font: { ...field.font, color: e.target.value } })}
                  style={styles.colorText}
                  placeholder="#333333"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
