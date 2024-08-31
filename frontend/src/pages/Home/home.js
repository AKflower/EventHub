import styles from './home.module.scss'
import EventList from '../../components/eventList/eventList'
import Search from '../../components/search/search'
import { useUserContext } from '../../context/UserContext'

export default function Home () {
    const { sessionInfo } =  useUserContext()
    
    return (
        <div className='main'>
            <Search />
            <EventList />
            <EventList />
            <EventList />
            <EventList />
        </div>
    )
}