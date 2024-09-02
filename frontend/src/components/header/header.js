import styles from './header.module.scss'
import Button from '../button/button'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import userService from '../../services/userService'
import { useUserContext } from '../../context/UserContext'
import icon from '../../assets/icon/icon'

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
    },[])
    
    if (path=='/login' || path=='/sign-up') return;
    return (
        <div className={styles.container}>
            <div style={{fontFamily:'Londrina Solid',fontSize:'2em',cursor:'pointer'}} onClick={() => navigate('/home')}><span style={{color:'#379777' }}>Event</span><span style={{color:'#000'}}>Hub</span> </div>
            <div className={styles.options}>
           
            {
                !sessionInfo ?
                <Button name={'Đăng nhập | Đăng ký'} borderRadius='50px' width={'15em'} color='#379777' onClick={() => navigate('/login')}/>
                :
                <div className='d-flex y-center gap-1'>
                    <div className={styles.cart}><img src={icon.cart} style={{width:'2em'}}/></div>
                    <div>{sessionInfo.fullName}</div>
                </div>
            }
            
                
            </div>
        </div>
    )
}