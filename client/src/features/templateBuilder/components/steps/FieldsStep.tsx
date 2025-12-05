import React from 'react';
import { TemplateFormData, FieldConfig } from '../../types';
import { FieldCard } from './FieldCard';
import { styles } from '../styles';

interface FieldsStepProps {
  formData: TemplateFormData;
  addField: () => void;
  updateField: (index: number, updates: Partial<FieldConfig>) => void;
  updateFieldPosition: (index: number, axis: 'x' | 'y', value: number) => void;
  updateFieldLine: (index: number, key: string, value: any) => void;
  removeField: (index: number) => void;
  moveField: (index: number, direction: 'up' | 'down') => void;
}

export function FieldsStep({
  formData,
  addField,
  updateField,
  updateFieldPosition,
  updateFieldLine,
  removeField,
  moveField
}: FieldsStepProps) {
  return (
    <div style={styles.stepContent}>
      <h3 style={styles.stepTitle}>Template Fields</h3>
      <p style={styles.helpText}>Add all elements that appear on your certificate. Use <strong>Static</strong> for fixed text like "Certificate of Participation", and <strong>Dynamic</strong> for content that changes per recipient like student name or date.</p>

      <button onClick={addField} style={styles.addBtn}>+ Add Field</button>

      {formData.fields.length === 0 && (
        <div style={styles.emptyFields}>
          No fields added yet. Click "Add Field" to create your first field.
        </div>
      )}

      {formData.fields.map((field, index) => (
        <FieldCard
          key={index}
          field={field}
          index={index}
          totalFields={formData.fields.length}
          updateField={updateField}
          updateFieldPosition={updateFieldPosition}
          updateFieldLine={updateFieldLine}
          removeField={removeField}
          moveField={moveField}
        />
      ))}
    </div>
  );
}
