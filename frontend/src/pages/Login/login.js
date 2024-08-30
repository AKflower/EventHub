import styles from './login.module.scss'
import Input from '../../components/input/input'
import Button from '../../components/button/button'
import icon from '../../assets/icon/icon'
import ButtonWithIcon from '../../components/buttonWithIcon/buttonWithIcon'
import  { Link } from 'react-router-dom'

export default function Login () {
    return (
        <div className={styles.container}>
            <div className={styles.cover}></div>
            <div className={styles.right}>
                <h1 className={styles.header}>Login</h1>
                <div className={styles.form}>
                    <Input label={'Email'} color='#F4CE14'/>
                    <Input label={'Password'} color='#F4CE14'/>
                    <div style={{textAlign:'right',padding:'1em 0'}}><Link to={'/forgot-passwrod'}>Forgot Password</Link></div>
                    
                    <Button name={'Đăng nhập'} color='#F4CE14'/>
                </div>
                <div className='divider'>
                <hr className="line" />
                or
                <hr className="line" />
                </div>
                <div style={{width:'80%',padding:'2em 0'}}>
                    <ButtonWithIcon icon={icon.googleIcon} name={'Login with Google'}/>
                </div>
                <div className={styles.footer}>
                    <span>New member? </span>
                    <Link to={'/sign-up'}>Sign up now</Link>
                </div>
            </div>
        </div>
    )
}