import styles from './signUp.module.scss'
import Input from '../../components/input/input'
import Button from '../../components/button/button'
import icon from '../../assets/icon/icon'
import ButtonWithIcon from '../../components/buttonWithIcon/buttonWithIcon'
import  { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import authService from '../../services/authService'
import { toast } from 'react-toastify'

export default function SignUp () {

    const navigate = useNavigate()

    

    const [isSaving,setIsSaving] = useState(false)
    const [formData,setFormData] = useState({
        mail: '',
        fullName: '',
        password: '',
        reTypePassword: '',
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
    const handleSignUp = async () => {
        if (isSaving) return;
        else {
            setIsSaving(true);
            if (formData.password != formData.reTypePassword) {
                toast.warning('Your password is not valid');
                setIsSaving(false)
                return;
            }
            else if (formData.fullName && formData.password && formData.reTypePassword && formData.mail) {
                try {
                    await authService.register(formData);
                    toast.success('Successfully!')
                    setIsSaving(false)
                   navigate('/login')
                    return;
                }
                catch (err) {
                    toast.error('Mail already exists!')
                    setIsSaving(false)

                }
                
            }
            else {
                toast.warning('You must fill out all!')
                setIsSaving(false)
                return;
            }
        }
    }
    return (
        <div className={styles.container}>
            <div className={styles.cover}></div>
            <div className={styles.right}>
                <h1 className={styles.header}>Sign Up</h1>
                <div className={styles.form}>
                
                    <Input label={'Email'} name={'mail'} value={formData.mail} color='#F4CE14' onChange={handleChange}/>
                    <Input label={'Full Name'} name={'fullName'} value={formData.fullName} color='#F4CE14' onChange={handleChange}/>

                    <Input label={'Password'} name={'password'} value={formData.password} color='#F4CE14'  type='password' onChange={handleChange}/>
                    <Input label={'Re-type Password'} name={'reTypePassword'} value={formData.reTypePassword} color='#F4CE14' type='password' onChange={handleChange}/>

                    
                    <div style={{margin:'2em 0 0 0'}}><Button name={'Đăng ký'} color='#F4CE14' onClick={() => handleSignUp()} disabled={isSaving}/></div>
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