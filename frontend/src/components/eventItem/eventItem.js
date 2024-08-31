import styles from './eventItem.module.scss'
import icon from '../../assets/icon/icon'
import { useNavigate } from 'react-router-dom';


export default function EventItem ({event}) {
    const navigate = useNavigate()
    console.log(event);
    return (
        <div className={styles.event} style={{ backgroundImage: `url(${event.coverImg})` }} onClick={() => navigate(`/events/detail/${event.id}`)}>
                        <div className={styles.eventInfor}>
                            <div className={styles.content}>
                                <h5>{event.name}</h5>
                                <div className={styles.footer}>
                                    <div className={styles.price}>
                                        <img src={icon.priceIcon} style={{ width: '1.5em' }} />
                                        <span>từ 100.0000</span>
                                    </div>
                                    <div className={styles.date}>
                                        <img src={icon.calendarIcon} style={{ width: '1.5em' }} />
                                        <span>{event.startTime}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
        </div>
    )
}