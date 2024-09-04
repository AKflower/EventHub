import { useEffect, useState } from 'react'
import styles from './eventCart.module.scss'
import { useUserContext } from '../../context/UserContext'
import eventService from '../../services/eventService';
import ticketTypeService from '../../services/ticketTypeService';
import galleryService from '../../services/galleryService';
import icon from '../../assets/icon/icon';
import { parseISO, format } from 'date-fns';
import Modal from '../modal/modal';
import Ptitle from '../ptitle/ptitle';

export default function EventCart({event}) {
    const {sessionInfo} = useUserContext();
    const [showDetailModal,setShowDetailModal] = useState(false)
    const [modalDetailTitle, setModalDetailTitle] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
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
    const getTicketInfo = (id) => {
       return ticketTypes.find(item => item.id == id);
    }
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
    const handleOpenHistoryBooking = async () => {
        console.log('testsss',event);

        setModalTitle('Lịch sử đặt vé')
        setShowModal(true);

        
    }
    const handleOpenDetailBooking = async (booking) => {
        setBooking(booking)
        setModalDetailTitle('Chi tiết đặt vé')
        setShowDetailModal(true);
    }
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
        <>
        <div className={styles.container} onClick={() => handleOpenHistoryBooking()}>
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
        {showModal && (
            <Modal
                title={modalTitle}
                submitButtonLabel={modalTitle === 'Xóa Người Dùng' ? 'Xóa' : 'Lưu'}
                // onSubmit={

                //     modalTitle === 'Chỉnh Sửa Đề Xuất' ? handleEditThesisSubmit :
                //         handleAddThesisSubmit
                // }
                onClose={() => setShowModal(false)}
            >
                {modalTitle === 'Lịch sử đặt vé' ? (
                    <div style={{maxHeight:'30em',overflow:'auto'}}>
                        {event.bookingInfo.map((booking) => (
                            <div className={styles.bookingContainer}>
                                <div className={styles.time}>{formatDate(booking.createdTime)}</div>
                                <div className={styles.info}>
                                    <div className='d-flex gap-1 y-center'><Ptitle title={'Mã đặt vé'} content={'#'+booking.id}/><div className={styles.detail} onClick={() => handleOpenDetailBooking(booking)}>Xem chi tiết {'>>'}</div></div>
                                    <h4>Thông tin đặt vé</h4>
                                    <ul>
                                    {booking.ticketInfo.map((ticket) => (
                                        <li>{ticket.quant} x {getTicketInfo(ticket.ticketTypeId).name}</li>
                                    ))}
                                    </ul>
                                    <h4>Thông tin nhận vé</h4>
                                    <Ptitle title={'Email'} content={booking.mail}/>
                                    <Ptitle title={'Số điện thoại'} content={booking.phone}/>
                                </div>
                            </div>
                        ))}
                    </div>
                ) :  (
                  <div></div>
                )}
            </Modal>
        )}
        {showDetailModal && (
            <Modal
                title={modalDetailTitle}
                submitButtonLabel={modalDetailTitle === 'Xóa Người Dùng' ? 'Xóa' : 'Lưu'}
                // onSubmit={

                //     modalTitle === 'Chỉnh Sửa Đề Xuất' ? handleEditThesisSubmit :
                //         handleAddThesisSubmit
                // }
                onClose={() => setShowDetailModal(false)}
            >
                {modalDetailTitle === 'Chi tiết đặt vé' ? (
                    <div style={{maxHeight:'30em',overflow:'auto'}}>
                      {booking && <div>{booking.id}</div>}
                    </div>
                ) :  (
                  <div></div>
                )}
            </Modal>
        )}
        </>
    )
}