import { FieldConfig, TemplateFormData } from '../types';

export function isLineField(type: string): boolean {
  return type === 'line_horizontal' || type === 'line_vertical';
}

export function validateTemplateName(name: string): string | null {
  if (!name.trim()) {
    return 'Please enter a template name';
  }
  return null;
}

export function validateFields(fields: FieldConfig[]): string | null {
  if (fields.length === 0) {
    return 'Please add at least one field';
  }
  
  const emptyFields = fields.filter(f => {
    if (!f.key.trim()) return true;
    if (isLineField(f.type)) return false;
    const mode = f.mode || 'static';
    if (mode === 'static' && !f.staticContent?.trim()) return true;
    if (mode === 'dynamic' && !f.placeholder?.trim()) return true;
    return false;
  });
  
  if (emptyFields.length > 0) {
    return 'All fields must have a key. Static fields need content, dynamic fields need a placeholder.';
  }
  
  const keys = fields.map(f => f.key.trim().toLowerCase());
  const duplicateKeys = keys.filter((key, index) => keys.indexOf(key) !== index);
  if (duplicateKeys.length > 0) {
    return `Duplicate field keys found: ${[...new Set(duplicateKeys)].join(', ')}. Each field must have a unique key.`;
  }
  
  return null;
}

export function validateTemplate(formData: TemplateFormData): { valid: boolean; error: string | null; step: number } {
  const nameError = validateTemplateName(formData.name);
  if (nameError) {
    return { valid: false, error: nameError, step: 1 };
  }
  
  const fieldsError = validateFields(formData.fields);
  if (fieldsError) {
    return { valid: false, error: fieldsError, step: 3 };
  }
  
  return { valid: true, error: null, step: 4 };
}
