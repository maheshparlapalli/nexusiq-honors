import React from 'react';

export const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 1400,
    margin: '0 auto',
    padding: 20
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  title: {
    fontSize: 28,
    fontWeight: 600,
    color: '#1a1a1a',
    margin: 0
  },
  backBtn: {
    padding: '8px 16px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 14
  },
  mainLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: 24
  },
  formPanel: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  stepIndicator: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 32
  },
  stepItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    flex: 1
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 8
  },
  stepLabel: {
    fontSize: 12,
    color: '#666'
  },
  stepContent: {},
  stepTitle: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 8,
    color: '#1a1a1a'
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20
  },
  section: {
    marginBottom: 24,
    paddingBottom: 20,
    borderBottom: '1px solid #eee'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 16,
    color: '#333'
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: '#555',
    marginBottom: 12,
    marginTop: 16,
    display: 'flex',
    alignItems: 'center'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    marginBottom: 16
  },
  formGroup: {
    marginBottom: 12
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 6,
    fontSize: 14,
    fontWeight: 500,
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: 6,
    fontSize: 14,
    boxSizing: 'border-box' as const
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 14,
    cursor: 'pointer'
  },
  navButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingTop: 20,
    borderTop: '1px solid #eee'
  },
  prevBtn: {
    padding: '12px 24px',
    backgroundColor: '#f5f5f5',
    color: '#333',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500
  },
  nextBtn: {
    padding: '12px 24px',
    backgroundColor: '#1976D2',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500
  },
  previewPanel: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    position: 'sticky' as const,
    top: 20,
    height: 'fit-content'
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 16,
    textAlign: 'center' as const
  },
  previewScaleContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center'
  },
  previewMeta: {
    display: 'flex',
    gap: 16,
    marginTop: 12,
    fontSize: 12,
    color: '#666'
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '12px 16px',
    borderRadius: 6,
    marginBottom: 16,
    fontSize: 14
  },
  addBtn: {
    padding: '10px 20px',
    backgroundColor: '#1976D2',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 20
  },
  emptyFields: {
    textAlign: 'center' as const,
    padding: 40,
    color: '#888',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    border: '2px dashed #ddd'
  },
  fieldCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    border: '1px solid #eee'
  },
  fieldHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  fieldIndex: {
    fontSize: 16,
    fontWeight: 600,
    color: '#1976D2'
  },
  fieldActions: {
    display: 'flex',
    gap: 8
  },
  iconBtn: {
    padding: '6px 10px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 14
  },
  deleteBtn: {
    padding: '6px 12px',
    backgroundColor: '#ffebee',
    color: '#c62828',
    border: '1px solid #ffcdd2',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 13
  },
  colorInputWrapper: {
    display: 'flex',
    gap: 8,
    alignItems: 'center'
  },
  colorInput: {
    width: 40,
    height: 36,
    padding: 2,
    border: '1px solid #ddd',
    borderRadius: 4,
    cursor: 'pointer'
  },
  colorText: {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: 6,
    fontSize: 14
  },
  reviewSection: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8
  },
  reviewGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 8,
    fontSize: 14
  },
  reviewFieldList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 8
  },
  reviewField: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 6,
    border: '1px solid #eee'
  },
  uploadArea: {
    display: 'flex',
    alignItems: 'center',
    gap: 12
  },
  uploadBtn: {
    padding: '10px 20px',
    backgroundColor: '#1976D2',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500
  },
  uploadHint: {
    fontSize: 12,
    color: '#888'
  },
  bgPreview: {
    marginTop: 16,
    display: 'flex',
    alignItems: 'flex-end',
    gap: 16
  },
  removeBtn: {
    padding: '8px 16px',
    backgroundColor: '#ffebee',
    color: '#c62828',
    border: '1px solid #ffcdd2',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 13
  },
  uploadedIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 14px',
    backgroundColor: '#e8f5e9',
    border: '1px solid #c8e6c9',
    borderRadius: 6,
    marginBottom: 12
  },
  checkIcon: {
    color: '#2e7d32',
    fontSize: 16,
    fontWeight: 'bold'
  },
  uploadedText: {
    color: '#2e7d32',
    fontSize: 14,
    fontWeight: 500
  }
};
