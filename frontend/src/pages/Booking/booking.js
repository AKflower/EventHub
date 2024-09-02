import styles from './booking.module.scss'
import Input from '../../components/input/input'
import Button from '../../components/button/button'
import ProgressBar from '../../components/progressBar/progressBar'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import bookingService from '../../services/bookingService'
import eventService from '../../services/eventService'
import ticketTypeService from '../../services/ticketTypeService'
import { useUserContext } from '../../context/UserContext'

export default function Booking() {
    const {sessionInfo} = useUserContext()
    const { bookingId } = useParams()

    const navigate = useNavigate();

    const [booking, setBooking] = useState()
    const [event, setEvent] = useState()
    const [ticketTypes, setTicketTypes] = useState([])
    const [formData,setFormData] = useState({
        mail: '',
        phone: '',
    })
    const fetchBooking = async () => {
        const res = await bookingService.getBookingById(bookingId)
        if (res.userId !=sessionInfo.id) navigate('/home'); // Block another user access;
        const eventData = await eventService.getEventById(res.eventId);
        setEvent(eventData)
        const ticketTypesData = await ticketTypeService.getTicketTypesByEventId(res.eventId);
        ticketTypesData.forEach(async (ticket) => {
            const tempIndex = res.ticketInfo.findIndex((item) => ticket.id == item.ticketTypeId);
            if (tempIndex !== -1) {
                // Cập nhật phần tử trong mảng
                res.ticketInfo[tempIndex] = {
                    ...res.ticketInfo[tempIndex],
                    ...ticket,
                };
                console.log(res.ticketInfo[tempIndex]);
            }
        })
        console.log(res);
        res.ticketInfo.forEach((ticket) => {
            var temp = ticketTypesData.find((item) => ticket.ticketTypeId == item.id);
            temp.booked = ticket.quant;
        })
        setBooking(res);
        setTicketTypes(ticketTypesData);
    }
    useEffect(() => {
        if (!sessionInfo) return;
        fetchBooking()
    }, [bookingId,sessionInfo])
    
    const formatPrice = (num) => {
        return num.toLocaleString('vi-VN');
    }
    const findTotal =  () => {
        var total = 0;
        booking.ticketInfo.forEach((item) => {
            total += item.quant*item.price;
        })
        return total;
    }
    const handleChange = async (e) => {

        const { name, value } = e.target;
        setFormData((prevData) => (
            {
                ...prevData,
                [name]: value
            }
        ))
    }


    const handleSubmit = async () => {
        var bookingData = {...booking};
        bookingData.mail = formData.mail;
        bookingData.phone = formData.phone;
        const res = await bookingService.updateBooking(bookingId,bookingData);
        navigate(`/booking/${bookingId}/payment`)
    }
    if (!booking) return;
    return (

        <div className='main'>
            <ProgressBar />
            <div className={styles.infor}>
                <div className={styles.userInfor}>
                    <Input label={'Email'} name={'mail'} onChange={handleChange}/>
                    <Input label={'Số điện thoại'} name={'phone'} onChange={handleChange}/>
                    <div className='d-flex x-center'><Button name={'Xác nhận'} width={'10em'} color='#379777' onClick={handleSubmit} /></div>
                </div>
                <div className={styles.ticketInfor}>
                    <h3>Thông tin đặt vé</h3>
                    <div className={styles.table}>
                        <div className={styles.left}><span style={{ fontWeight: '600' }}>Hạng vé</span></div>
                        <div className={styles.right}><span style={{ fontWeight: '600' }}>Số lượng</span></div>

                    </div>
                    {booking.ticketInfo.map((ticket) => (
                        <div className={styles.ticket}>
                            <div className={styles.left}>
                                <div>{ticket.name}</div>
                                <div>{formatPrice(parseInt(ticket.price,10))}</div>
                            </div>
                            <div className={styles.right}>
                                <div>{ticket.quant}</div>
                                <div>{formatPrice(ticket.price*ticket.quant)}</div>
                            </div>
                        </div>
                    ))
                    }
                    <div className={styles.table} style={{ padding: '1em 0' }}>
                        <div className={styles.left}><span>Tổng tiền</span></div>
                        <div className={styles.right}><span style={{ fontWeight: '600' }}>{formatPrice(findTotal())}</span></div>
                    </div>
                </div>
            </div>
        </div>
    )
}