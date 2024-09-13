// Modal.jsx
import React from 'react';
import styles from './modal.module.scss';

export default function Modal({ title, children, onSubmit, onClose, submitButtonLabel, submitDeleteButton, onDelete }) {
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
                    {onSubmit && <button className={styles.submitButton} onClick={onSubmit}>
                        {submitButtonLabel || 'Lưu'}
                    </button>}
                    {onDelete 
                        && <button className={styles.deleteButton} onClick={onDelete}>
                        {submitDeleteButton || 'Xóa'}
                    </button>
                    }
                    <button className={styles.cancelButton} onClick={onClose}>Đóng</button>
                </div>
            </div>
        </div>
    );
}
