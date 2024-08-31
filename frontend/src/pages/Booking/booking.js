import styles from './booking.module.scss'
import Input from '../../components/input/input'
import Button from '../../components/button/button'
import ProgressBar from '../../components/progressBar/progressBar'
import { useNavigate } from 'react-router-dom'

export default function Booking() {
    const navigate = useNavigate();

    const handleSubmit = async () => {
        navigate('/booking/payment')
    }
    return (

        <div className='main'>
            <ProgressBar />
            <div className={styles.infor}>
                <div className={styles.userInfor}>
                    <Input label={'Email'} />
                    <Input label={'Số điện thoại'} />
                    <div className='d-flex x-center'><Button name={'Xác nhận'} width={'10em'} color='#379777' onClick={handleSubmit}/></div>
                </div>
                <div className={styles.ticketInfor}>
                    <h3>Thông tin đặt vé</h3>
                    <div className={styles.table}>
                        <div className={styles.left}><span style={{fontWeight:'600'}}>Hạng vé</span></div>
                        <div className={styles.right}><span style={{fontWeight:'600'}}>Số lượng</span></div>
                    </div>
                </div>
            </div>
        </div>
    )
}