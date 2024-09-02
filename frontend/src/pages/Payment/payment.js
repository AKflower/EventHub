import styles from './payment.module.scss'
import ProgressBar from '../../components/progressBar/progressBar'
import icon from '../../assets/icon/icon'
import Button from '../../components/button/button'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import bookingService from '../../services/bookingService'
import eventService from '../../services/eventService'
import ticketTypeService from '../../services/ticketTypeService'
import { useUserContext } from '../../context/UserContext'
import paymentService from '../../services/paymentService'
import paymentSuccess from '../../assets/img/payment-success.png'

export default function Payment({ status = 0 }) {
    const data = [
        {
            id: 1,
            name: 'Thanh toán bằng Momo',
            icon: 'momo'
        },
        {
            id: 2,
            name: 'Thanh toán bằng VNPay',
            icon: 'vnpay'
        },
        {
            id: 3,
            name: 'Thanh toán ATM/Internet Banking',
            icon: 'atm'
        }
    ]
    const { sessionInfo } = useUserContext()
    const { bookingId } = useParams()
    const navigate = useNavigate();

    const [booking, setBooking] = useState()
    const [event, setEvent] = useState()
    const [ticketTypes, setTicketTypes] = useState([])
    const fetchBooking = async () => {
        const res = await bookingService.getBookingById(bookingId)
        if (res.userId != sessionInfo.id) navigate('/home'); // Block another user access;
        if (res.statusId!=3 && status==1) navigate('/home');
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
    }, [bookingId, sessionInfo])
    const formatPrice = (num) => {
        return num.toLocaleString('vi-VN');
    }
    const findTotal = () => {
        var total = 0;
        booking.ticketInfo.forEach((item) => {
            total += item.quant * item.price;
        })
        return total;
    }

    const handlePay = async () => {
        var total = findTotal();
        const res = await paymentService.payWithVNPay(total, bookingId);
        window.location.href = res.paymentUrl;
    }
    if (!booking) return;
    return (
        <div className='main'>
            <ProgressBar statusCurr={status == 0 ? 2 : 3} />
            <div className={styles.container}>
                {status == 0 && <div className={styles.payment}>
                    <h3>Chọn phương thức thanh toán</h3>
                    {data.map((item) => (
                        <div className={styles.paymentMethod}>
                            <input type='radio' name='method' />
                            <div className={styles.content}>
                                <div className={styles.icon} style={{ backgroundImage: `url(${icon[item.icon]})` }}></div>
                                <h4>{item.name}</h4>
                                <div></div>
                            </div>
                        </div>
                    ))}
                    <div className='d-flex x-center' style={{ padding: '1em 0' }}><Button name={'Thanh toán'} width={'10em'} color='#379777' onClick={handlePay} /></div>
                </div>}
                {status == 1 &&
                    <div className={styles.payment}>
                        <div className='d-flex x-center' style={{fontWeight:'600',color:'#379777',fontSize:'2em'}}>Đặt vé thành công</div>
                        <div className='d-flex x-center'>
                           <img src={paymentSuccess} style={{width:'20em', borderRadius:'50%'}}/>
                        </div>
                        <div className='d-flex x-center' style={{fontFamily:'Londrina Solid',fontSize:'2em'}}><span style={{color:'#379777' }}>Event</span><span style={{color:'#000'}}>Hub</span></div>  
                        <div className='d-flex x-center y-center'>xin chân thành cảm ơn bạn vì đã sử dụng dịch vụ của chúng tôi.</div>
                        <div className='d-flex x-center' style={{ padding: '1em 0' }}><Button name={'Xem vé đã mua'} width={'15em'} color='#379777'  /></div>

                    </div>
                }
                <div className={styles.infor}>
                    <div className={styles.userInfo}>
                        <h3>Thông tin nhận vé</h3>
                        <div className={styles.info}>
                            <p>{sessionInfo.fullName}</p>
                            <p>{booking.phone}</p>
                        </div>
                        <div className={styles.info}>
                            <p>{booking.mail}</p>
                        </div>
                    </div>
                    <div className={styles.ticketInfo}>
                        <h3>Thông tin đặt vé</h3>
                        <div className={styles.table}>
                            <div className={styles.left}><span style={{ fontWeight: '600' }}>Hạng vé</span></div>
                            <div className={styles.right}><span style={{ fontWeight: '600' }}>Số lượng</span></div>

                        </div>
                        {booking.ticketInfo.map((ticket) => (
                            <div className={styles.ticket}>
                                <div className={styles.left}>
                                    <div>{ticket.name}</div>
                                    <div>{formatPrice(parseInt(ticket.price, 10))}</div>
                                </div>
                                <div className={styles.right}>
                                    <div>{ticket.quant}</div>
                                    <div>{formatPrice(ticket.price * ticket.quant)}</div>
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
        </div>
    )
}