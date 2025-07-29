import React, { useState } from 'react';

interface DeactivateAccountModalProps {
  onClose: () => void;
  onConfirm: (reason: string) => void;
  opened: boolean;
}

const DeactivateAccountModal: React.FC<DeactivateAccountModalProps> = ({ onClose, onConfirm, opened }) => {
  const [reasons, setReasons] = useState({
    unusual: false,
    violation: false,
    request: false,
    other: false,
  });

  const [otherReason, setOtherReason] = useState('');

  const handleCheckboxChange = (key: keyof typeof reasons) => {
    setReasons((prev) => ({ ...prev, [key]: !prev[key] }));
    if (key === 'other' && reasons.other) setOtherReason('');
  };

  const getReason = (): string => {
    if (reasons.unusual) return 'Unusual activity';
    if (reasons.violation) return 'Violation of the guidelines';
    if (reasons.request) return 'Request for deactivation';
    if (reasons.other && otherReason.trim()) return otherReason.trim();
    return '';
  };

  const canDeactivate = !!getReason();

  if(!opened) return null;
  
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>Deactivate Account</h3>
          <span style={styles.close} onClick={onClose}>
            &times;
          </span>
        </div>

        <div style={styles.warning}>
          <div style={{ fontSize: '2rem', color: '#ff4d4f' }}>&#9888;</div>
          <p style={styles.warningText}>
            Are you sure you want to deactivate this account? All of their data will be permanently lost.
            This action cannot be undone. Please specify the reason below.
          </p>
        </div>

        <div>
          {[
            { key: 'unusual', label: 'Unusual activity' },
            { key: 'violation', label: 'Violation of the guidelines' },
            { key: 'request', label: 'Request for deactivation' },
            { key: 'other', label: 'Other' },
          ].map((opt) => (
            <label key={opt.key} style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={reasons[opt.key as keyof typeof reasons]}
                onChange={() => handleCheckboxChange(opt.key as keyof typeof reasons)}
                style={styles.checkbox}
              />
              {opt.label}
            </label>
          ))}
        </div>

        {reasons.other && (
          <div style={{ marginTop: '1rem' }}>
            <textarea
              maxLength={250}
              placeholder="Please specify..."
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              style={styles.textarea}
            />
            <div style={styles.charCount}>{otherReason.length} / 250</div>
          </div>
        )}

        <div style={styles.actions}>
          <button style={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button style={styles.deactivateBtn} onClick={() => onConfirm(getReason())} disabled={!canDeactivate}>
            Deactivate
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modal: {
    background: '#2d2d2d',
    borderRadius: '12px',
    padding: '2rem',
    width: '480px',
    color: '#fff',
    fontFamily: 'sans-serif',
    position: 'relative',
  },
  header: {
    position: 'relative',
    textAlign: 'center',
    marginBottom: '1rem',
    borderBottom: '2px solid #a63232',
    paddingBottom: '0.5rem',
  },
  title: {
    fontSize: '1.25rem',
    margin: 0,
  },
  close: {
    position: 'absolute',
    right: '1rem',
    top: '0',
    cursor: 'pointer',
    fontSize: '1.25rem',
  },
  warning: {
    textAlign: 'center',
    marginBottom: '1rem',
  },
  warningText: {
    marginTop: '0.5rem',
    fontSize: '0.95rem',
  },
  checkboxLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    cursor: 'pointer',
  },
  checkbox: {
    marginRight: '0.5rem',
  },
  textarea: {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '6px',
    border: 'none',
    resize: 'none',
    fontFamily: 'inherit',
  },
  charCount: {
    textAlign: 'right',
    fontSize: '0.875rem',
    color: '#aaa',
    marginTop: '0.25rem',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
    marginTop: '1.5rem',
  },
  cancelBtn: {
    background: '#555',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    color: 'white',
    cursor: 'pointer',
  },
  deactivateBtn: {
    background: '#c0392b',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    color: 'white',
    cursor: 'pointer',
  },
};

export default DeactivateAccountModal;
