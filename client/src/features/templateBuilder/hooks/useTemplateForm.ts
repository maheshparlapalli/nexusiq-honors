import { useState } from 'react';
import { TemplateFormData, FieldConfig } from '../types';
import { INITIAL_FORM_DATA, EMPTY_FIELD } from '../utils/constants';

interface UseTemplateFormReturn {
  formData: TemplateFormData;
  setFormData: React.Dispatch<React.SetStateAction<TemplateFormData>>;
  updateLayout: (key: string, value: any) => void;
  updateStyles: (key: string, value: any) => void;
  updateMeta: (key: string, value: any) => void;
  updateSignatureBlock: (key: string, value: any) => void;
  addField: () => void;
  updateField: (index: number, updates: Partial<FieldConfig>) => void;
  updateFieldPosition: (index: number, axis: 'x' | 'y', value: number) => void;
  updateFieldLine: (index: number, key: string, value: any) => void;
  removeField: (index: number) => void;
  moveField: (index: number, direction: 'up' | 'down') => void;
  resetForm: () => void;
}

export function useTemplateForm(): UseTemplateFormReturn {
  const [formData, setFormData] = useState<TemplateFormData>(INITIAL_FORM_DATA);

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
      position: { 
        x: Math.floor(formData.layout.width / 2), 
        y: 100 + (formData.fields.length * 60) 
      }
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

  function updateFieldLine(index: number, key: string, value: any) {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) => 
        i === index ? { ...f, line: { ...(f.line || { width: 200, height: 2, color: '#333333' }), [key]: value } } : f
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

  function resetForm() {
    setFormData(INITIAL_FORM_DATA);
  }

  return {
    formData,
    setFormData,
    updateLayout,
    updateStyles,
    updateMeta,
    updateSignatureBlock,
    addField,
    updateField,
    updateFieldPosition,
    updateFieldLine,
    removeField,
    moveField,
    resetForm
  };
}
