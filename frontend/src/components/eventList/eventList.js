import styles from './eventList.module.scss'
import coverImg1 from '../../assets/img/coverImg1.png'
import icon from '../../assets/icon/icon'
import EventItem from '../eventItem/eventItem'
import { useNavigate } from 'react-router-dom'


export default function EventList() {
    const navigate = useNavigate()
    const data = [
        {
            name: 'Yên Concert',
            startTime: '11/08/2024',
            coverImg: coverImg1,
            minPrice: '',
        },
        {
            name: 'Yên Concert',
            startTime: '11/08/2024',
            coverImg: coverImg1,
            minPrice: '',
        },
        {
            name: 'Yên Concert',
            startTime: '11/08/2024',
            coverImg: coverImg1,
            minPrice: '',
        },


    ]
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>Âm nhạc</h3>
                <p onClick={() => navigate(`/events/1`)} style={{cursor:'pointer'}}>Xem thêm</p>
            </div>
            <div className={styles.events}>
                {data.map((event) => (
                   <EventItem event={event}/>
                ))}
            </div>


        </div>
    )
}