import { TemplateFormData, FieldConfig, ThemeColors } from '../types';

export const FIELD_TYPES = ['text', 'date', 'number', 'textarea', 'image', 'line_horizontal', 'line_vertical'];
export const FONT_FAMILIES = ['Georgia', 'Arial', 'Times New Roman', 'Helvetica', 'Roboto', 'Verdana', 'Courier New'];
export const FONT_WEIGHTS = ['normal', 'bold', 'lighter'];
export const ORIENTATIONS = ['landscape', 'portrait', 'square'];
export const COLOR_THEMES = ['classic-blue', 'achievement-gold', 'event-purple', 'custom-teal', 'professional-navy', 'modern-green'];
export const BACKGROUND_SIZES = ['cover', 'contain', 'auto', '100% 100%', '100% auto', 'auto 100%'];
export const BACKGROUND_POSITIONS = ['center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'];

export const INITIAL_FORM_DATA: TemplateFormData = {
  name: '',
  type: 'certificate',
  category: 'course',
  layout: {
    background_url: '',
    background_key: '',
    background_size: 'cover',
    background_position: 'center',
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

export const EMPTY_FIELD: FieldConfig = {
  key: '',
  label: '',
  type: 'text',
  mode: 'static',
  staticContent: '',
  placeholder: '',
  position: { x: 528, y: 400 },
  font: { size: 24, color: '#333333', weight: 'normal', family: 'Arial' },
  line: { width: 200, height: 2, color: '#333333' }
};

export const THEME_COLORS: Record<string, ThemeColors> = {
  'classic-blue': { primary: '#1a365d', secondary: '#2c5282', accent: '#3182ce', border: '#90cdf4' },
  'achievement-gold': { primary: '#744210', secondary: '#975a16', accent: '#d69e2e', border: '#ecc94b' },
  'event-purple': { primary: '#44337a', secondary: '#553c9a', accent: '#805ad5', border: '#b794f4' },
  'custom-teal': { primary: '#234e52', secondary: '#285e61', accent: '#319795', border: '#81e6d9' },
  'professional-navy': { primary: '#1a202c', secondary: '#2d3748', accent: '#4a5568', border: '#a0aec0' },
  'modern-green': { primary: '#22543d', secondary: '#276749', accent: '#38a169', border: '#9ae6b4' }
};

export function getThemeColors(theme: string): ThemeColors {
  return THEME_COLORS[theme] || THEME_COLORS['classic-blue'];
}
