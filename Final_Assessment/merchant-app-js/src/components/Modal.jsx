import React from 'react';

export default function Modal({ isOpen, title, onClose, children, actions }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          {title}
        </div>
        <div className="modal-body">
          {children}
        </div>
        {(actions || onClose) && (
          <div className="modal-footer">
            {actions || (
              <button className="btn-primary" onClick={onClose}>
                Close
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
