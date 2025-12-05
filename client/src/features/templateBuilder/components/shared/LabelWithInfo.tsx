import React from 'react';
import { InfoIcon } from './InfoIcon';

interface LabelWithInfoProps {
  label: string;
  tooltip: string;
}

export function LabelWithInfo({ label, tooltip }: LabelWithInfoProps) {
  return (
    <label style={{
      display: 'flex',
      alignItems: 'center',
      marginBottom: 6,
      fontSize: 14,
      fontWeight: 500,
      color: '#333'
    }}>
      {label}
      <InfoIcon tooltip={tooltip} />
    </label>
  );
}
