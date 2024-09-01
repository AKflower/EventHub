import styles from './eventItem.module.scss'
import icon from '../../assets/icon/icon'
import { useNavigate } from 'react-router-dom';
import galleryService from '../../services/galleryService';
import { parseISO, format } from 'date-fns';

export default function EventItem({ event }) {
    const navigate = useNavigate()
   
    function formatDate(timestamp) {
        try {
          // Chuyển đổi từ chuỗi ISO sang đối tượng Date
          const date = parseISO(timestamp);
      
          // Định dạng lại thành "DD/MM/YYYY"
          return format(date, 'dd/MM/yyyy');
        } catch (error) {
          console.error('Error parsing date:', error);
          return 'Invalid Date';
        }
      }
    
    return (
        <div className={styles.event} style={{ backgroundImage: `url(${galleryService.getLinkImage(event.coverImg)})` }} onClick={() => navigate(`/events/detail/${event.id}`)}>
            
            <div className={styles.eventInfor}>
                <div className={styles.content}>
                    <h5 style={event.name.length>=50 ? {fontSize:'.7em'} : {}}>{event.name}</h5>
                    <div className={styles.footer}>
                        <div className={styles.price}>
                            <img src={icon.priceIcon} style={{ width: '1.5em' }} />
                            <span>từ 100.0000</span>
                        </div>
                        <div className={styles.date}>
                            <img src={icon.calendarIcon} style={{ width: '1.5em' }} />
                            <span>{formatDate(event.startTime)}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}