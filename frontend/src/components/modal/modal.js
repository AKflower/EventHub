// Modal.jsx
import React from 'react';
import styles from './modal.module.scss';

export default function Modal({ title, children, onSubmit, onClose, submitButtonLabel }) {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2>{title}</h2>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>
                <div className={styles.modalContent}>
                    {children}
                </div>
                <div className={styles.modalFooter}>
                    <button className={styles.submitButton} onClick={onSubmit}>
                        {submitButtonLabel || 'Lưu'}
                    </button>
                    <button className={styles.cancelButton} onClick={onClose}>Hủy</button>
                </div>
            </div>
        </div>
    );
}
