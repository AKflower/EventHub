import styles from './login.module.scss'
import Input from '../../components/input/input'
import Button from '../../components/button/button'
import icon from '../../assets/icon/icon'
import ButtonWithIcon from '../../components/buttonWithIcon/buttonWithIcon'
import  { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useState,useEffect} from 'react'
import authService from '../../services/authService'


export default function Login () {
    const navigate = useNavigate()
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) navigate('/home');
    },[])
   
    const [formData,setFormData] = useState({
        mail: '',
        password: ''
    })
    const handleChange = async (e) => {
        console.log(e.target.value);
        const { name, value } = e.target;
        setFormData((prevData) => (
            {
                ...prevData,
                [name]: value
            }
        ))
    }
    const handleLogin = async () => {
        try {
            const res = await authService.login(formData);
            localStorage.setItem('token',res.token)
            localStorage.setItem('userId',res.userId)
            navigate('/home')
        }
        catch (err) {
            console.error(err)
        }
        
    }
    
    return (
        <div className={styles.container}>
            <div className={styles.cover}></div>
            <div className={styles.right}>
                <h1 className={styles.header}>Login</h1>
                <div className={styles.form}>
                    <Input label={'Email'} color='#F4CE14' name={'mail'} value={formData.mail} onChange={handleChange}/>
                    <Input label={'Password'} color='#F4CE14' name={'password'} value={formData.password} onChange={handleChange}/>
                    <div style={{textAlign:'right',padding:'1em 0'}}><Link to={'/forgot-passwrod'}>Forgot Password</Link></div>
                    
                    <Button name={'Đăng nhập'} color='#F4CE14' onClick={() => handleLogin()}/>
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