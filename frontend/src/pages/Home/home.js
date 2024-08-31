import styles from './home.module.scss'
import EventList from '../../components/eventList/eventList'
import Search from '../../components/search/search'
import { useUserContext } from '../../context/UserContext'
import { useState, useEffect } from 'react'
import eventService from '../../services/eventService'

export default function Home () {
    const { sessionInfo } =  useUserContext()
    const [events, setEvents] = useState([]);
  
    useEffect(() => {

    }, [])
    return (
        <div className='main'>
            <Search />
            <EventList category={'Music'} isShort={true}/>
            <EventList category={'Sport'} isShort={true}/>
            <EventList category={'Theaters & Art'} isShort={true}/>
            <EventList category={'Others'} isShort={true}/>
        </div>
    )
}