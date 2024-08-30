import styles from './button.module.scss'

export default function Button({ onClick,name,color="#1F95A7",disabled=false, width, isCircle=false, borderRadius='10px'}) {
    return (
        <div className={styles.container} onClick={onClick}>
            <button style={{background:color, width: width ? width : '100%',borderRadius: borderRadius}} disabled={disabled}>{name}</button>
        </div>
    )
}