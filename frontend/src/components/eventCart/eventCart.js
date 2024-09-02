import { useEffect, useState } from 'react'
import styles from './eventCart.module.scss'
import { useUserContext } from '../../context/UserContext'
import eventService from '../../services/eventService';
import ticketTypeService from '../../services/ticketTypeService';
import galleryService from '../../services/galleryService';
import icon from '../../assets/icon/icon';
import { parseISO, format } from 'date-fns';


export default function EventCart({event}) {
    const {sessionInfo} = useUserContext();


    const [booking, setBooking] = useState()
    const [eventInfo, setEventInfo] = useState()
    const [ticketTypes, setTicketTypes] = useState([])
    const [ticketBooked,setTicketBooked] = useState()
    const fetchEvent = async () => {
        
        var ticketTypesArr = []
        event.bookingInfo.forEach((booking) => {
            booking.ticketInfo.forEach((ticket) => {
                ticketTypesArr.push(ticket);
            })
        })

        const eventData = await eventService.getEventById(event.eventId);
        setEventInfo(eventData)
        const ticketTypesData = await ticketTypeService.getTicketTypesByEventId(event.eventId);
        var ticketTypeBooked = []
        ticketTypesData.forEach((ticketType) => {
            var tempArr = ticketTypesArr.filter((ticket) => ticket.ticketTypeId == ticketType.id);
           if (tempArr.length==0) return;
            var temp = {
                ticketTypeId: ticketType.id,
                name: ticketType.name,
                quant: 0
            }
            tempArr.forEach((item) => {
                temp.quant+=item.quant
            })
            ticketTypeBooked.push(temp);
        })
        console.log('test: ',ticketTypeBooked)
        setTicketBooked(ticketTypeBooked)
        setTicketTypes(ticketTypesData);
    }
    useEffect(() => {
        if (!sessionInfo) return;
      
        fetchEvent()
    }, [ sessionInfo])
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
    
    if (!eventInfo || !ticketBooked) return;
    return(
        <div className={styles.container}>
            <div className={styles.coverImg} style={{ backgroundImage: `url(${galleryService.getLinkImage(eventInfo.coverImg)})` }}></div>
            <div className={styles.info}>
                <h4>{eventInfo.name}</h4>
                <div className={styles.date}>
                            <img src={icon.calendarGreenIcon} style={{ width: '1.5em' }} />
                            <span>{formatDate(eventInfo.startTime)}</span>
                </div>
                <div className={styles.tickets}>
                    {ticketBooked.map((ticket) => (
                        <div className={styles.ticket}>{ticket.name} x {ticket.quant}</div>
                    ))}
                </div>
            </div>
        </div>
    )
}