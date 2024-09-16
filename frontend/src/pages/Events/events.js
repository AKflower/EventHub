import styles from './events.module.scss'
import EventList from '../../components/eventList/eventList'
import { useParams } from 'react-router-dom';

export default function Events () {
    const {categoryId} = useParams()
    return (
        <div className='main'>
            <EventList category={categoryId}/>
        </div>
    )
}