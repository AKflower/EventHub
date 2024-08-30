// Select.jsx
import React from 'react';
import styles from './select.module.scss';

export default function Select({ label, name, options, value, onChange, isDisabled=false }) {
    console.log('Option: ',options);
    return (
        <div className={styles.selectGroup}>
            {label && <label>{label}</label>}
            <select name={name} value={value} onChange={onChange} disabled={isDisabled} >
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
