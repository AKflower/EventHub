import styles from './home.module.scss'
import EventList from '../../components/eventList/eventList'
import Search from '../../components/search/search'

export default function Home () {
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