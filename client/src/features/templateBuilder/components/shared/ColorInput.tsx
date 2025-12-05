import React from 'react';
import { styles } from '../styles';

interface ColorInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ColorInput({ value, onChange }: ColorInputProps) {
  return (
    <div style={styles.colorInputWrapper}>
      <input
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={styles.colorInput}
      />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={styles.colorText}
        placeholder="#333333"
      />
    </div>
  );
}
