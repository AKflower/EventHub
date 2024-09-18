import styles from './profile.module.scss'
import Button from '../../components/button/button'
import Input from '../../components/input/input'
import userService from '../../services/userService'
import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import formatService from '../../services/formatService'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify'
import Modal from '../../components/modal/modal'
import authService from '../../services/authService'

export default function Profile() {
    const userId = localStorage.getItem('userId')
    const navigate = useNavigate()
    const [user, setUser] = useState()
    const [formData, setFormData] = useState()
    const [showModal, setShowModal] = useState(false);
    const [err,setErr] = useState(
        {
            errPass: false,
            errNewPass: false,
        }
    )
    const [formPass, setFormPass] = useState({
        oldPassword: '',
        newPassword: '',
        reNewPassword: ''
    })
    const handleChange = async (e) => {

        const { name, value } = e.target;
        setFormData((prevData) => (
            {
                ...prevData,
                [name]: value
            }
        ))
    }
    const changePassword = async () => {
        setFormPass(
            {
                oldPassword: '',
                newPassword: '',
                reNewPassword: ''
            }
        )
        setShowModal(true)
    }
    const handleChangePassword = async () => {
        if (formPass.newPassword!=formPass.reNewPassword) {

        }
    }
    const fetchUser = async () => {
        const res = await userService.getUserById(userId);
        setUser(res)
        setFormData(res)
    }
    const handleUpdateUser = async () => {
        const res = await userService.updateUser(formData.id, formData)
        fetchUser();
        toast.success('Cập nhật thành công!')
    }
    const handleSubmit = async () => {
        if (!formPass.newPassword || !formPass.oldPassword || !formPass.reNewPassword) {
            toast.warning('You must fill out all!');
            return;
        }
        else if (formPass.newPassword != formPass.reNewPassword) {
            toast.warning('Wrong password!');
            return;
        }
        try {
            const res = await userService.changePassword(formData.id,{...formPass,mail: user.mail})
            toast.success('Đổi mật khẩu thành công!')
            setShowModal(false)
        }
        catch(err) {
            toast.error('Failed!')
        }
       

    }
    const handleChangeFomPass = async (e) => {
        const { name, value } = e.target;
        setFormPass((prevData) => (
            {
                ...prevData,
                [name]: value
            }
        ))
    }
    useEffect(() => {
        if (userId) fetchUser();
        else navigate('/home');
    }, [])
    
    const gender = [{ value: 'male', label: 'Nam' }, { value: 'female', label: 'Nữ' }, { value: 'other', label: 'Khác' }]
    if (!formData) return;
    return (
        <div className={styles.container}>
            <div className={styles.profile}>
                <div className={styles.back} onClick={() => navigate('/home')}><ArrowBackIcon /></div>
                <h1>Thông tin cá nhân</h1>
                <p>Cung cấp thông tin chính xác sẽ hỗ trợ bạn trong quá trình mua vé, hoặc khi cần xác thực vé</p>
                <Input label={'Họ tên'} name={'fullName'} value={formData.fullName} onChange={handleChange} />
                <Input label={'Số điện thoại'} name={'phone'} value={formData.phone} onChange={handleChange} />
                <Input label={'Email'} name={'mail'} value={formData.mail} type='email' onChange={handleChange} />
                <Input label={'Năm sinh'} name={'birth'} type='date' onChange={handleChange} value={formatService.formatDateYYYYMMDD(formData.birth)} />
                <div>
                    <label>Giới tính</label>
                    <div className={styles.gender}>
                        {gender.map((item) => (
                            <div className=''><input name='gender' value={item.value} type='radio' checked={formData.gender == item.value} onClick={(e) => handleChange(e)} /><span>{item.label}</span></div>
                        ))}
                    </div>
                </div>
                <div style={{ padding: '0 0' }}><Button name={'Lưu'} onClick={handleUpdateUser} color='#379777' /></div>
                <div style={{ padding: '0 0' }}><Button name={'Đổi mật khẩu'} color='#474747' onClick={changePassword} /></div>

            </div>
            {
                showModal &&
                <Modal
                    title={'Đổi mật khẩu'}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleSubmit}
                >
                    <div className={styles.form}>
                        <Input label={'Mật khẩu cũ'} type='password' name={'oldPassword'} value={formPass.oldPassword}  isError={err.errPass} onChange={handleChangeFomPass}/>
                        <Input label={'Mật khẩu mới'} type='password' name={'newPassword'} value={formPass.newPassword} isError={err.errNewPass} onChange={handleChangeFomPass}/>
                        <Input label={'Xác nhận mật khẩu mới'} type='password' name={'reNewPassword'} value={formPass.reNewPassword} isError={err.errNewPass} onChange={handleChangeFomPass}/>
                    </div>
                </Modal>
            }
        </div>
    )
}