import styles from './header.module.scss'
import Button from '../button/button'
import { useNavigate } from 'react-router-dom'

export default function Header () {
    const navigate = useNavigate()
    return (
        <div className={styles.container}>
            <div>EventHub </div>
            <div className={styles.options}>
           
            <Button name={'Đăng nhập | Đăng ký'} borderRadius='50px' width={'15em'} color='#379777' onClick={() => navigate('/login')}/>
            
                
            </div>
        </div>
    )
}