import React from 'react';
import { styles } from '../styles';

interface StepperProps {
  currentStep: number;
  steps: string[];
}

export function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div style={styles.stepIndicator}>
      {steps.map((label, i) => (
        <div 
          key={i} 
          style={{
            ...styles.stepItem,
            opacity: i + 1 <= currentStep ? 1 : 0.5
          }}
        >
          <div style={{
            ...styles.stepCircle,
            backgroundColor: i + 1 <= currentStep ? '#1976D2' : '#e0e0e0',
            color: i + 1 <= currentStep ? '#fff' : '#666'
          }}>
            {i + 1}
          </div>
          <span style={styles.stepLabel}>{label}</span>
        </div>
      ))}
    </div>
  );
}
