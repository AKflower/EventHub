import styles from './eventDetail.module.scss'
import coverImg1 from '../../assets/img/coverImg1.png'
import { useState, useEffect } from 'react'
import eventService from '../../services/eventService'
import { useParams, useNavigate } from 'react-router-dom'
import { format, isSameDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import icon from '../../assets/icon/icon'
import ticketTypeService from '../../services/ticketTypeService'


export default function EventDetail() {
    const { eventId } = useParams();

    const navigate = useNavigate();

    const [event, setEvent] = useState()
    const [ticketTypes, setTicketTypes] = useState()

    const fetchEvent = async () => {
        const res = await eventService.getEventById(eventId);
        setEvent(res);
    }
    const fetchTicketTypes = async () => {
        const res = await ticketTypeService.getTicketTypesByEventId(eventId);
        setTicketTypes(res);

    }
    useEffect(() => {
        fetchEvent();
        fetchTicketTypes()
    }, [])


    function formatTimeRange(startTime, endTime, timeZone = 'UTC') {
        const start = toZonedTime(new Date(startTime), timeZone);
        const end = toZonedTime(new Date(endTime), timeZone);

        // Định dạng thời gian và ngày
        const timeFormat = 'HH:mm';
        const dateFormat = 'dd/MM/yyyy';

        // Kiểm tra nếu giờ, phút, giây đều là 00:00:00
        const isStartTimeMidnight = start.getHours() === 0 && start.getMinutes() === 0 && start.getSeconds() === 0;
        const isEndTimeMidnight = end.getHours() === 0 && end.getMinutes() === 0 && end.getSeconds() === 0;

        if (isSameDay(start, end)) {
            // Nếu cùng ngày và giờ phút giây đều là 00:00:00, chỉ hiển thị ngày
            if (isStartTimeMidnight && isEndTimeMidnight) {
                return format(start, dateFormat);
            } else {
                return `${format(start, timeFormat)} - ${format(end, timeFormat)}, ${format(start, dateFormat)}`;
            }
        } else {
            // Nếu khác ngày và giờ phút giây đều là 00:00:00, chỉ hiển thị ngày
            if (isStartTimeMidnight && isEndTimeMidnight) {
                return `${format(start, dateFormat)} - ${format(end, dateFormat)}`;
            } else {
                return `${format(start, isStartTimeMidnight ? dateFormat : `${timeFormat}, ${dateFormat}`)} - ${format(end, isEndTimeMidnight ? dateFormat : `${timeFormat}, ${dateFormat}`)}`;
            }
        }
    }
    if (!event || !ticketTypes) return;
    return (
        <div className='main'>
            <div className={styles.infor}>
                <div className={styles.coverContainer}>
                    <div className={styles.cover} style={{ backgroundImage: `url(${coverImg1})` }}>

                    </div>
                </div>

                <div className={styles.content}>
                    <h3>{event.name}</h3>
                    <div className={styles.info}>
                        <div className={styles.date}>
                            <img src={icon.calendarGreenIcon} style={{ width: '2em' }} />
                            {formatTimeRange(event.startTime, event.endTime, 'Asia/Ho_Chi_Minh')}
                        </div>
                        <div className={styles.location}>
                            <img src={icon.locationIcon} style={{ width: '2em' }} />
                            {event.venueName + ' ' + event.street + ' ' + event.ward + ' ' + event.district + ' ' + event.city}
                        </div>
                    </div>
                    <h4 className='d-flex y-center gap-1' style={{ color: '#379777', position: 'absolute', bottom: 0 }}>
                        <img src={icon.priceGreenIcon} style={{ width: '2em' }} />
                        Từ 100.000 VND
                    </h4>
                </div>

            </div>
            <div className={styles.subInfor}>
                <div className={styles.description}>
                    <h3>Giới thiệu</h3>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                </div>
                <div className={styles.price}>
                    <h3>Hạng vé</h3>
                    {ticketTypes.map((ticket) => (
                        <div className={styles.ticket}>
                            <h4>{ticket.name}</h4>
                        </div>
                    ))
                    }
                </div>
            </div>
        </div>
    )
}