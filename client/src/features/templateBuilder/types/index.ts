export interface FieldConfig {
  key: string;
  label: string;
  type: string;
  mode: 'static' | 'dynamic';
  staticContent: string;
  placeholder: string;
  position: { x: number; y: number };
  font: { size: number; color: string; weight: string; family: string };
  line?: { width: number; height: number; color: string };
}

export interface BackgroundImage {
  key: string;
  url: string;
  filename: string;
}

export interface LayoutConfig {
  background_url: string;
  background_key: string;
  background_size: string;
  background_position: string;
  width: number;
  height: number;
  orientation: string;
}

export interface StylesConfig {
  global_font_family: string;
  color_theme: string;
}

export interface SignatureBlock {
  show: boolean;
  signature_url: string;
  name: string;
  designation: string;
}

export interface MetaConfig {
  default_expiry_months: number | null;
  allow_expiry_override: boolean;
  issued_by_label: string;
  signature_block: SignatureBlock;
  seal_url: string;
}

export interface TemplateFormData {
  name: string;
  type: string;
  category: string;
  layout: LayoutConfig;
  fields: FieldConfig[];
  styles: StylesConfig;
  meta: MetaConfig;
  active: boolean;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  border: string;
}
