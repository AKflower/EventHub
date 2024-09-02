import styles from './cart.module.scss'
import bookingService from '../../services/bookingService'
import { useEffect, useState } from 'react'
import { useUserContext } from '../../context/UserContext'
import eventService from '../../services/eventService'
import EventCart from '../../components/eventCart/eventCart'

export default function Cart () {

    const { sessionInfo } = useUserContext()

    const status = [
        {
            id: 0,
            name: 'Tất cả'
        },
        {
            id: 1,
            name: 'Thành công'
        },
        {
            id: 2,
            name: 'Đã hủy'
        },
    ]
    const [bookings,setBookings] = useState([])
    const [events,setEvents] = useState()
    const eventGrouping = async (data) => {
        var eventArr = [];
        var prevBooking = null;
        data.forEach(async (booking) => {
            if (!prevBooking || (prevBooking && booking.eventId != prevBooking.eventId)) {
                var event = {
                    eventId: booking.eventId,
                    bookingInfo : [booking]
                };
                eventArr.push(event);
                prevBooking=booking;
            }
            else {
                await eventArr[eventArr.length-1].bookingInfo.push(booking);
            }
        })
        console.log(eventArr);
        setEvents(eventArr)
    }
    const fetchBooking = async () => {
        const res = await  bookingService.getBookingByUserIdAndFilter(sessionInfo.id,0)
        var data = [...res];
        await eventGrouping(data);
        
        setBookings(res);
    }
    useEffect(() => {
        if (!sessionInfo) return;
        fetchBooking();
    }, [sessionInfo])
    if (!events) return;
    return (
        <div className='main'>
            <div className={styles.container}>
                <div className={styles.sidebar}></div>
                <div className={styles.cart}>
                    <h2 className={styles.header}>Vé của bạn</h2>
                    <div className={styles.tabContainer}>
                        {status.map((item) => (
                            <div className={styles.tab} key={item.id}>{item.name}</div>
                        ))}
                    </div>
                    <div className={styles.ticketContainer}>
                            {events.map((event) => (
                                <EventCart event={event}/>
                            ) )}
                    </div>
                </div>
            </div>
        </div>
    )
}