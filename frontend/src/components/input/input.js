import styles from './input.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export default function Input({ label, value, type = 'text', name, onChange, isTextArea = false, isDisabled = false, placeholder = '', isError = false, color = 'black' }) {
    const [typeState, setTypeState] = useState(type)
    return (
        <div className={styles.inputContainer}>
            <label style={{ color: color }} className={styles.label}>{label}</label>
            {!isTextArea ?
                (<input name={name} type={typeState} onChange={onChange} value={value} disabled={isDisabled} placeholder={placeholder} style={isError ? { border: '1px solid red' } : {}} />) :
                (<textarea name={name} type={typeState} onChange={onChange} value={value} placeholder={placeholder}></textarea>)}
            {type == 'password' &&
                <div className={styles.icon} onClick={() => setTypeState(typeState=='password' ? 'text' : 'password')}>
                {typeState=='password' ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                </div>
            }
        </div>
    )



}