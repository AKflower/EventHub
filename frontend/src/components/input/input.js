import styles from './input.module.scss'

export default function Input({label, value, type='text',name,onChange,isTextArea=false,isDisabled=false, placeholder='', isError=false,color='black'}) {
    return (
        <div className={styles.inputContainer}>
            <label style={{color:color}} className={styles.label}>{label}</label>
            {!isTextArea ?
               ( <input name={name} type={type} onChange={onChange} value={value} disabled={isDisabled} placeholder={placeholder} style={isError? {border: '1px solid red'} : {}}/>) : 
               (<textarea name={name} type={type} onChange={onChange} value={value} placeholder={placeholder}></textarea>)}
        </div>
    )
   

    
}