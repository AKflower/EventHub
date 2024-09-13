import styles from './eventDetail.module.scss'
import coverImg1 from '../../assets/img/coverImg1.png'
import { useState, useEffect } from 'react'
import eventService from '../../services/eventService'
import { useParams, useNavigate } from 'react-router-dom'
import { format, isSameDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import icon from '../../assets/icon/icon'
import ticketTypeService from '../../services/ticketTypeService'
import Button from '../../components/button/button'
import galleryService from '../../services/galleryService'
import bookingService from '../../services/bookingService'
import { useUserContext } from '../../context/UserContext'
import formatService from '../../services/formatService'

export default function EventDetail() {
    const { eventId } = useParams();
    const { sessionInfo } = useUserContext()

    const navigate = useNavigate();

    const [event, setEvent] = useState()
    const [ticketTypes, setTicketTypes] = useState()
    const [total, setTotal] = useState(0)
    const [formData, setFormdata] = useState()
    const fetchEvent = async () => {
        const res = await eventService.getEventById(eventId);
        setEvent(res);
    }
    const fetchTicketTypes = async () => {
        const res = await ticketTypeService.getTicketTypesByEventId(eventId);

        const data = res.map((item) => ({
            ...item,
            booked: 0,
            isShow: false,
        }))
        setTicketTypes(data);
        // console.log(data);
        // setFormdata(data);
    }
    useEffect(() => {
        fetchEvent();
        fetchTicketTypes()
    }, [])

    const handleBooking = async () => {
        var ticketInfo = ticketTypes.filter((ticket) => ticket.booked > 0)
        .map((ticket) => ({
            ticketTypeId: ticket.id,
            quant: ticket.booked,
        }))

        const res = await bookingService.createBooking({
            userId: sessionInfo.id,
            eventId: eventId,
            ticketInfo: JSON.stringify(ticketInfo),
        })
        navigate(`/booking/${res.id}`);
    }

    const handleDescrease = async (id) => {
        console.log(id);
        var data = [...ticketTypes];
        console.log(data);
        var item = data.find((item) => item.id == id);
        console.log(item);
        if (item.booked > 0) item.booked = item.booked - 1;
        else return;
        var priceTotal = parseInt(total, 10) - parseInt(item.price);
        setTotal(priceTotal);
        setTicketTypes(data);

    }

    const handleIncrease = async (id) => {
        var data = [...ticketTypes];
        var item = data.find((item) => item.id == id);
        if (item.booked < item.total) item.booked = item.booked + 1;
        else return;
        console.log(total);
        var priceTotal = parseInt(total, 10) + parseInt(item.price);
        setTotal(priceTotal);
        setTicketTypes(data);

    }
    const handleShowDescription = async (id) => {
        var data = [...ticketTypes];
        var item = data.find((item) => item.id == id);
        item.isShow = true;
        setTicketTypes(data);

    }
    const handleHideDescription = async (id) => {
        var data = [...ticketTypes];
        var item = data.find((item) => item.id == id);
        item.isShow = false;
        setTicketTypes(data);

    }
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
    const formatPrice = (num) => {
        return num.toLocaleString('vi-VN');
    }
    if (!event || !ticketTypes) return;
    return (
        <div className='main'>
            <div className={styles.infor}>
                <div className={styles.coverContainer}>
                    <div className={styles.cover} style={{ backgroundImage: `url(${galleryService.getLinkImage(event.coverImg)})` }}>

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
                        Từ {formatService.formatPrice(parseInt(event.minPrice,10))} VND
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
                            <div className={styles.left}>
                                <div>{ticket.name}</div>
                                {!ticket.isShow && <div className={styles.show} onClick={() => handleShowDescription(ticket.id)}>show more</div>}
                                {ticket.isShow &&
                                    <div className={styles.des}>
                                        {ticket.description}
                                        <div className={styles.show} onClick={() => handleHideDescription(ticket.id)}>hide</div>
                                    </div>
                                }

                            </div>
                            <div className={styles.right}>
                                <div className={styles.quantity}>
                                    <div className={styles.modQuantity}
                                        style={{ backgroundImage: `url(${icon.minusIcon})` }}
                                        onClick={() => handleDescrease(ticket.id)}
                                    ></div>
                                    <input className={styles.input} value={ticket.booked} />
                                    <div className={styles.modQuantity}
                                        style={{ backgroundImage: `url(${icon.plusIcon})` }}
                                        onClick={() => handleIncrease(ticket.id)}
                                    ></div>


                                </div>
                                <p style={ticket.booked ? { color: '#000' } : { color: 'silver' }}>{formatPrice(ticket.price * (ticket.booked > 1 ? ticket.booked : 1))}</p>
                            </div>




                        </div>
                    ))
                    }
                    <div style={{ padding: '1em' }}>
                        <Button
                            name={total ? 'Tiếp tục - ' + formatPrice(total) + ' >>' : 'Vui lòng chọn vé'}
                            color={total ? '#379777' : 'silver'}
                            onClick={() => {
                                if (total > 0) {
                                    handleBooking()
                                }
                            }} /></div>
                </div>
            </div>
        </div>
    )
}