import React, { useState } from 'react';

interface InfoIconProps {
  tooltip: string;
}

export function InfoIcon({ tooltip }: InfoIconProps) {
  const [show, setShow] = useState(false);
  
  return (
    <span 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 16,
        height: 16,
        borderRadius: '50%',
        backgroundColor: '#e3f2fd',
        color: '#1976D2',
        fontSize: 11,
        fontWeight: 'bold',
        cursor: 'help',
        marginLeft: 6,
        position: 'relative'
      }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      i
      {show && (
        <span style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#333',
          color: '#fff',
          padding: '8px 12px',
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 'normal',
          whiteSpace: 'normal',
          width: 220,
          textAlign: 'left',
          marginBottom: 8,
          zIndex: 1000,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          lineHeight: 1.4
        }}>
          {tooltip}
        </span>
      )}
    </span>
  );
}
