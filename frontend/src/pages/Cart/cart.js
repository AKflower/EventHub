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
            id: 3,
            name: 'Thành công'
        },
        {
            id: 4,
            name: 'Đã hủy'
        },
    ]
    const [bookings,setBookings] = useState([])
    const [events,setEvents] = useState()
    const [tab,setTab] = useState(0)
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
        var newEventArr = [...eventArr];
        newEventArr.forEach((event) => {
            event = {...sortBooking(event)};
        })
        console.log(newEventArr);
        setEvents(newEventArr)
    }
    const fetchBooking = async (status) => {
        const res = await  bookingService.getBookingByUserIdAndFilter(sessionInfo.id,status)
        var data = [...res];
        await eventGrouping(data);
        
        setBookings(res);
    }
    useEffect(() => {
        if (!sessionInfo) return;
        fetchBooking(tab);
    }, [sessionInfo,tab])
    const sortBooking = (event) => {
        const newEvent = [...event.bookingInfo.sort((a,b) => b.id - a.id)];
        return newEvent;
    }
    if (!events) return;
    return (
        <div className='main'>
            <div className={styles.container}>
                <div className={styles.sidebar}></div>
                <div className={styles.cart}>
                    <h2 className={styles.header}>Vé của bạn</h2>
                    <div className={styles.tabContainer}>
                        {status.map((item) => (
                            <div className={tab==item.id ? styles.tabActive : styles.tab} key={item.id} onClick={()=>setTab(item.id)}>{item.name}</div>
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