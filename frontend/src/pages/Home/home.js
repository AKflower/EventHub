import styles from './home.module.scss'
import EventList from '../../components/eventList/eventList'
import Search from '../../components/search/search'
import { useUserContext } from '../../context/UserContext'
import { useState, useEffect } from 'react'
import eventService from '../../services/eventService'
import { useSearchParams } from 'react-router-dom'

export default function Home() {
    const { sessionInfo } = useUserContext()
    const [events, setEvents] = useState([]);
    const [searchRes, setSearchRes] = useState(null)
    const [searchParams] = useSearchParams();
    const name = searchParams.get('name');
    const categories = searchParams.get('categories');
    const handleSearch = async () => {
        console.log('search: ', name,categories);
        const res = await eventService.searchEvents({name,categories});
        setSearchRes(res)
        console.log('Test',res);
    }
    useEffect(() => {
        handleSearch()
    }, [name, categories])
    return (
        <div className='main'>
            <Search />

            {!searchRes &&
            <>
                <EventList category={'Hot'} isShort={true} />
                <EventList category={1} isShort={true} />
                <EventList category={3} isShort={true} />
                <EventList category={2} isShort={true} />
                <EventList category={4} isShort={true} />
            </>
            }
            {
                searchRes && 
                <EventList category={'Search'} isShort={false} eventList={searchRes}/>
            }

        </div>
    )
}