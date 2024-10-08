import styles from './eventList.module.scss'
import coverImg1 from '../../assets/img/coverImg1.png'
import icon from '../../assets/icon/icon'
import EventItem from '../eventItem/eventItem'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import eventService from '../../services/eventService'


export default function EventList({ category, isShort,eventList }) {
    const navigate = useNavigate()
    const [events, setEvents] = useState([]);
    const fetchEvents = async () => {
        if (eventList) {
            setEvents(eventList)
            console.log(category);
        }
        else if (category == 'Hot') {
            const res = await eventService.getTop8EventsByTicketSales(6);
            var data = []
            if (isShort) {
                data = await res.filter((item, index) => index <= 2)
                setEvents(data)
            }
            else setEvents(res);
        }
        else {
            const res = await eventService.searchEvents({categories: category})
            var data = []
            if (isShort) {
                data = await res.filter((item, index) => index <= 2)
                setEvents(data)
            }
            else setEvents(res);
        }

    }
    useEffect(() => {
        fetchEvents()
    }, [])
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
    const convertTitleCategory = (a) => {
        switch (a) {
            case 'Hot':
                return 'Hot'
            case 1:
                return 'Âm nhạc'
            case 4:
                return 'Thể thao'
            case 2:
                return 'Sân khấu & Nghệ thuật'
            case 3:
                return 'Sự kiện khác'
            case 'Search':
                return 'Kết quả tìm kiếm'
        }
    }
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3> {
                    parseInt(category,10) ?  convertTitleCategory(parseInt(category,10)) : category
                }</h3>
                {isShort && <p onClick={() => navigate(`/events/${category}`)} style={{ cursor: 'pointer' }}>Xem thêm</p>}
            </div>
            <div className={styles.events}>
                {events.map((event) => (
                    <EventItem event={event} />
                ))}
            </div>


        </div>
    )
}