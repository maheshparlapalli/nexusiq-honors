import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'wouter';
import {
  TemplateFormData,
  useTemplateForm,
  useBackgroundUpload,
  validateTemplate,
  BasicInfoStep,
  LayoutStylesStep,
  FieldsStep,
  ReviewStep,
  Stepper,
  LivePreview,
  styles
} from '../features/templateBuilder';

const STEPS = ['Basic Info', 'Layout & Styles', 'Fields', 'Review'];

export default function TemplateBuilder() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
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
    moveField
  } = useTemplateForm();

  const {
    uploading,
    removing,
    backgroundFilename,
    fileInputRef,
    handleFileUpload,
    handleRemoveBackground,
    setBackgroundFilename
  } = useBackgroundUpload();

  function handleNext() {
    if (step < STEPS.length) setStep(step + 1);
  }

  function handlePrev() {
    if (step > 1) setStep(step - 1);
  }

  function onFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    handleFileUpload(
      e,
      (url, key, filename) => {
        setFormData(prev => ({
          ...prev,
          layout: {
            ...prev.layout,
            background_url: url,
            background_key: key
          }
        }));
      },
      (message) => setError(message)
    );
  }

  function onRemoveBackground() {
    handleRemoveBackground(formData.layout.background_key, () => {
      setFormData(prev => ({
        ...prev,
        layout: {
          ...prev.layout,
          background_url: '',
          background_key: ''
        }
      }));
    });
    setBackgroundFilename('');
  }

  async function handleSubmit() {
    const validation = validateTemplate(formData);
    if (!validation.valid) {
      setError(validation.error);
      setStep(validation.step);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const templateData = {
        client_id: 'nexsaa-demo',
        ...formData,
        version: 1
      };

      await axios.post('/api/v1/templates', templateData);
      setLocation('/templates');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create template');
    } finally {
      setSaving(false);
    }
  }

  function updateFormData(updates: Partial<TemplateFormData>) {
    setFormData(prev => ({ ...prev, ...updates }));
  }

  function renderCurrentStep() {
    switch (step) {
      case 1:
        return (
          <BasicInfoStep 
            formData={formData} 
            updateFormData={updateFormData}
          />
        );
      case 2:
        return (
          <LayoutStylesStep
            formData={formData}
            updateLayout={updateLayout}
            updateStyles={updateStyles}
            updateMeta={updateMeta}
            updateSignatureBlock={updateSignatureBlock}
            uploading={uploading}
            removing={removing}
            backgroundFilename={backgroundFilename}
            fileInputRef={fileInputRef}
            onFileUpload={onFileUpload}
            onRemoveBackground={onRemoveBackground}
          />
        );
      case 3:
        return (
          <FieldsStep
            formData={formData}
            addField={addField}
            updateField={updateField}
            updateFieldPosition={updateFieldPosition}
            updateFieldLine={updateFieldLine}
            removeField={removeField}
            moveField={moveField}
          />
        );
      case 4:
        return (
          <ReviewStep 
            formData={formData}
            backgroundFilename={backgroundFilename}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Create New Template</h1>
        <button onClick={() => setLocation('/templates')} style={styles.backBtn}>
          Back to Templates
        </button>
      </div>

      <div style={styles.mainLayout}>
        <div style={styles.formPanel}>
          <Stepper currentStep={step} steps={STEPS} />
          
          {error && <div style={styles.error}>{error}</div>}
          
          {renderCurrentStep()}

          <div style={styles.navButtons}>
            <button 
              onClick={handlePrev} 
              style={{ ...styles.prevBtn, opacity: step === 1 ? 0.5 : 1 }}
              disabled={step === 1}
            >
              Previous
            </button>
            
            {step < STEPS.length ? (
              <button onClick={handleNext} style={styles.nextBtn}>
                Next
              </button>
            ) : (
              <button 
                onClick={handleSubmit} 
                style={{ ...styles.nextBtn, backgroundColor: '#2e7d32' }}
                disabled={saving}
              >
                {saving ? 'Creating...' : 'Create Template'}
              </button>
            )}
          </div>
        </div>

        <LivePreview formData={formData} />
      </div>
    </div>
  );
}
