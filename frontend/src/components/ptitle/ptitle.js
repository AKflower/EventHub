import styles from './ptitle.module.scss'

export default function Ptitle ({title,content, onClick}) {
    return (
        <p>
            <span className={styles.title}>{title}: </span>
            <span style={onClick ? {cursor:'pointer'} : {}} onClick={onClick}>{content}</span>
        </p>
    )
}