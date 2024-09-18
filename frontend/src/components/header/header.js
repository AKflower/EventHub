import styles from './header.module.scss'
import Button from '../button/button'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import userService from '../../services/userService'
import { useUserContext } from '../../context/UserContext'
import icon from '../../assets/icon/icon'
import LogoutIcon from '@mui/icons-material/Logout';
import EventIcon from '@mui/icons-material/Event';

export default function Header () {
    const navigate = useNavigate()
    const location = useLocation()
    
    const path = location.pathname;
    const userId = localStorage.getItem('userId')

    const { setSessionInfo, sessionInfo } = useUserContext()
    const fetchSession = async () => {
        const res = await userService.getUserById(userId);
        setSessionInfo(res);
    }
    useEffect(() => {
       if (userId) fetchSession();
    },[userId])
    
    if (path=='/login' || path=='/sign-up' || path=='/profile') return;
    return (
        <div className={styles.container}>
            <div style={{fontFamily:'Londrina Solid',fontSize:'2em',cursor:'pointer'}} onClick={() => window.location.href = `http://localhost:3000/home` }><span style={{color:'#379777' }}>Event</span><span style={{color:'#000'}}>Hub</span> </div>
            <div className={styles.options}>
           
            {
                !sessionInfo ?
                <Button name={'Đăng nhập | Đăng ký'} borderRadius='50px' width={'15em'} color='#379777' onClick={() => navigate('/login')}/>
                :
                <div className='d-flex y-center gap-1'>
                    <div className={styles.event} onClick={() => navigate('/organizer')}>Sự kiện của tôi</div>
                    <div className={styles.cart} onClick={() => navigate('/my-tickets')}><img src={icon.cart} style={{width:'2em'}}/></div>
                    <div style={{cursor:'pointer'}} onClick={() => navigate('/profile')}>{sessionInfo.fullName}</div>
                    <span style={{cursor:'pointer'}} onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('userId');
                        window.location.href= 'http://localhost:3000/home';
                    }}><LogoutIcon /></span>
                </div>
            }
            
                
            </div>
        </div>
    )
}