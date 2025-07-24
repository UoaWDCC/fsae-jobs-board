import React, { useState } from 'react';

interface DeletePostModalProps {
    opened: boolean;    
    onClose: () => void;
    onDelete: (reason: string) => void;
}

const DeletePostModal: React.FC<DeletePostModalProps> = ({ opened, onClose, onDelete }) => {
  const [violationChecked, setViolationChecked] = useState(false);
  const [otherChecked, setOtherChecked] = useState(false);
  const [otherReason, setOtherReason] = useState('');

  const effectiveReason =
    violationChecked && !otherChecked
      ? 'Violation of the guidelines'
      : otherChecked
      ? otherReason.trim()
      : '';

  const handleViolationChange = () => {
    setViolationChecked((v) => !v);
  };

  const handleOtherChange = () => {
    setOtherChecked((v) => {
      const next = !v;
      if (!next) setOtherReason('');
      return next;
    });
  };

  const handleDelete = () => {
    const trimmedReason = effectiveReason.trim();
    const isValid =
      (violationChecked && !otherChecked) ||
      (otherChecked && trimmedReason.length > 0);

    if (!isValid) return;
    onDelete(trimmedReason);
  };


  if (!opened) return null;

  return (
    <div style={styles.overlay} role="dialog" aria-modal="true">
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>Delete Post</h3>
          <span style={styles.close} onClick={onClose} aria-label="Close">
            &times;
          </span>
        </div>

        <div style={styles.warning}>
          <div style={{ fontSize: '2rem', color: '#ff4d4f' }}>&#9888;</div>
          <p style={styles.warningText}>
            Are you sure you want to delete this post? <br />
            All of its data will be permanently lost. This action cannot be undone. <br />
            Please specify the reason below.
          </p>
        </div>

        <div>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={violationChecked}
              onChange={handleViolationChange}
              style={styles.checkbox}
            />
            Violation of the guidelines
          </label>

          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={otherChecked}
              onChange={handleOtherChange}
              style={styles.checkbox}
            />
            Other
          </label>
        </div>

        {otherChecked && (
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
          <button
            style={styles.deleteBtn}
            onClick={handleDelete}
            disabled={
              (!violationChecked && !otherChecked) ||
              (otherChecked && otherReason.trim() === '')
            }
          >
            Delete
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
  deleteBtn: {
    background: '#c0392b',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    color: 'white',
    cursor: 'pointer',
  },
};

export default DeletePostModal;
