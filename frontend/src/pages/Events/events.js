import styles from './events.module.scss'
import EventList from '../../components/eventList/eventList'
import { useParams } from 'react-router-dom';

export default function Events () {
    const {category} = useParams()
    return (
        <div className='main'>
            <EventList category={category}/>
        </div>
    )
}