import styles from './progressBar.module.scss'
import icon from '../../assets/icon/icon'

export default function ProgressBar ({statusCurr=1}) {
    const data= [
        {
            id: 1,
            status: 'Chọn vé'
        },
        {
            id: 2,
            status: 'Xác nhận thông tin'
        },
        {
            id: 3,
            status: 'Thanh toán'
        },
    ]
    return (
        <div className={styles.container}>
            {data.map((item) => (
                <div className={statusCurr>=item.id ?  styles.statusItemActive : statusCurr+1==item.id ? styles.statusItemNow : styles.statusItem}>
                    <div className={styles.circle} style={item.id<=statusCurr ? {backgroundImage:`url(${icon.tickIcon})`} : {}}></div>
                    <div className={styles.statusName}>{item.status}</div>
                   {item.id!=3 && <div className={styles.line}></div>}
                </div>
                
            ))}
        </div>
    )
}