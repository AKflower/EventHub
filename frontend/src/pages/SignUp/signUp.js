import styles from './signUp.module.scss'
import Input from '../../components/input/input'
import Button from '../../components/button/button'
import icon from '../../assets/icon/icon'
import ButtonWithIcon from '../../components/buttonWithIcon/buttonWithIcon'
import  { Link } from 'react-router-dom'

export default function SignUp () {
    return (
        <div className={styles.container}>
            <div className={styles.cover}></div>
            <div className={styles.right}>
                <h1 className={styles.header}>Sign Up</h1>
                <div className={styles.form}>
                    <Input label={'Email'} color='#F4CE14'/>
                    <Input label={'Password'} color='#F4CE14'/>
                    <Input label={'Re-type Password'} color='#F4CE14'/>

                    
                    <div style={{margin:'2em 0 0 0'}}><Button name={'Đăng ký'} color='#F4CE14'/></div>
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
                    <span>Join us before? </span>
                    <Link to={'/sign-up'}>Login now</Link>
                </div>
            </div>
        </div>
    )
}