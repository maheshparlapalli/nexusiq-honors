import React from 'react';
import { TemplateFormData } from '../../types';
import { styles } from '../styles';

interface BasicInfoStepProps {
  formData: TemplateFormData;
  updateFormData: (updates: Partial<TemplateFormData>) => void;
}

export function BasicInfoStep({ formData, updateFormData }: BasicInfoStepProps) {
  return (
    <div style={styles.stepContent}>
      <h3 style={styles.stepTitle}>Basic Information</h3>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Template Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={e => updateFormData({ name: e.target.value })}
          style={styles.input}
          placeholder="e.g., Advanced Course Certificate"
        />
      </div>

      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Type</label>
          <select
            value={formData.type}
            onChange={e => updateFormData({ type: e.target.value })}
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
            onChange={e => updateFormData({ category: e.target.value })}
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
            onChange={e => updateFormData({ active: e.target.checked })}
          />
          Template Active (can be used to issue certificates)
        </label>
      </div>
    </div>
  );
}
