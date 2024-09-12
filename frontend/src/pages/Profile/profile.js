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
        password: '',
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
                password: '',
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
                >
                    <div className={styles.form}>
                        <Input label={'Mật khẩu cũ'} type='password' name={'password'} value={formPass.password}  isError={err.errPass}/>
                        <Input label={'Mật khẩu mới'} type='password' name={'newPassword'} value={formPass.newPassword} isError={err.errNewPass}/>
                        <Input label={'Xác nhận mật khẩu mới'} type='password' name={'reNewPassword'} value={formPass.reNewPassword} isError={err.errNewPass} />
                    </div>
                </Modal>
            }
        </div>
    )
}