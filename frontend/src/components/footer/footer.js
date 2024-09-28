import styles from './footer.module.scss'
import { useLocation, useNavigate } from 'react-router-dom'
import Ptitle from '../ptitle/ptitle'

export default function Footer () {
    const navigate = useNavigate()
    const location = useLocation()
    const path = location.pathname;
    if (path.includes('/manage') || path=='/profile' || path=='/login' || path=='/sign-up') return;
    return (
        <div className={styles.container}>
            <div style={{padding: '1em 0',textAlign:'center'}}> <div style={{fontFamily:'Londrina Solid',fontSize:'2em',cursor:'pointer'}} onClick={() => window.location.href = `http://localhost:3000/home` }><span style={{color:'#379777' }}>Event</span><span style={{color:'#000'}}>Hub</span> </div></div>
            <div className={styles.slogan}>
                <h3 style={{color:'yellow'}}>"Đặt vé thật dễ dàng!"</h3>
            </div>
            <div className={styles.info}>
                <Ptitle title={'Email'} content={'eventhub173@gmail.vn'}/>
                <Ptitle title={'Số điện thoại'} content={'0581762903'}/>
                <Ptitle title={'Địa chỉ'} content={'TP. Hồ Chí Minh'}/>


            </div>
        </div>
    )
}