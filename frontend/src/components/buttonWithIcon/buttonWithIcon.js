import styles from './buttonWithIcon.module.scss'

export default function ButtonWithIcon({icon,name}) {
    return (
        <button className={styles.container}>
            <img src={icon} style={{ width: '2em' }} />
            <span>{name}</span>
        </button>
    )
}