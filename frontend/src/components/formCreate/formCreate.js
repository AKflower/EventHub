import styles from './formCreate.module.scss'
import { useRef, useState } from 'react';
import Input from '../input/input';
import Select from '../select/select';
import Button from '../button/button';
import eventService from '../../services/eventService';
import galleryService from '../../services/galleryService'
import { toast } from 'react-toastify';

export default function FormCreate() {
    const userId = localStorage.getItem('userId')
    const [preview, setPreview] = useState('');
    const [file, setFile] = useState(null);
    const [isSaving,setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        venueName: '',
        district: '',
        ward: '',
        city: '',
        category: '',
        description: '',
        accOwner: '',
        accNumber: '',
        bank: '',
        branch: '',
        street: '',
        startTime: '',
        endTime: ''
    })
    function checkEmptyFields(data) {
        for (const key in data) {
            if (data[key] === '' || data[key] === null || data[key] === undefined) {
                console.log(key);
                return true; // Có ít nhất một trường rỗng
            }
        }
        return false; // Không có trường rỗng
    }
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
    const fileInputRef = useRef(null);
    const handleImageUploadClick = () => {
        fileInputRef.current.click(); // Kích hoạt click trên input file
    };
    const handleSubmit = async () => {
        if (isSaving) return;
        setIsSaving(true)
        if (checkEmptyFields()) {
            toast.warning('Bạn không được để trống trường nào!');
            setIsSaving(false)
            return;
        }
        if (!preview) {
            toast.warning('Vui lòng upload ảnh!') ;
            setIsSaving(false)
            return;
        };
        const res = await galleryService.addImage({name: formData.name,image:file})
        console.log(res.id);
        const event = await eventService.createEvent({...formData, coverImg: res.id,createdById: userId});
        toast.success('Tạo thành công!');
        setIsSaving(false)
        
    }
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);


        // Tạo URL xem trước từ tệp đã chọn
        if (selectedFile) {
            const previewURL = URL.createObjectURL(selectedFile);
            setPreview(previewURL);
        } else {
            setPreview(''); // Xóa URL xem trước nếu không có tệp
        }
    };
    return (
        <div className={styles.form}>
            <h3>Tạo sự kiện</h3>
            <div className={styles.formGroup}>
                <h4>Upload ảnh</h4>
                <div
                    className={styles.imgUpload}
                    style={preview ? { backgroundImage: `url(${preview})` } : { display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={handleImageUploadClick}>
                    {!preview && 'Thêm ảnh bìa'}
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleFileChange(e)}
                    style={{ display: 'none' }} // Ẩn input file
                />
            </div>

            <div className={styles.formGroup}>
                <Input label={'Tên sự kiện'} name={'name'} value={formData.name} onChange={handleChange} />

            </div>
            <div className={styles.formGroup}>
                <Select
                    label={'Thể loại sự kiện'}
                    name={'category'}
                    value={formData.category}
                    onChange={handleChange}
                    options={[
                        {
                            value: '',
                            label: 'Chọn sự kiện'
                        },
                        {
                            value: 'Music',
                            label: 'Âm nhạc',
                        },
                        {
                            value: 'Sport',
                            label: 'Thể thao',
                        },
                        {
                            value: 'Theater & Art',
                            label: 'Sân khấu & Nghệ thuật',
                        },
                        {
                            value: 'Others',
                            label: 'Sự kiện khác',
                        }
                    ]}
                />

            </div>
            <div className={styles.formGroup}>
                <Input label={'Tên địa điểm'} name={'venueName'} value={formData.venueName} onChange={handleChange} />
            </div>
            <div className={styles.formGroup2}>
                <Input label={'Tỉnh/Thành'} name={'city'} value={formData.city} onChange={handleChange} />
                <Input label={'Quận/Huyện'} name={'district'} value={formData.district} onChange={handleChange} />
                <Input label={'Phường/Xã'} name={'ward'} value={formData.ward} onChange={handleChange} />
                <Input label={'Số nhà/Đường'} name={'street'} value={formData.street} onChange={handleChange} />

            </div>
            <div className={styles.formGroup}>
                <Input label={'Mô tả'} name={'description'} isTextArea={true} />
            </div>
            <div className={styles.formGroup2}>
                <Input label={'Thời gian bắt đầu'} name={'startTime'} type='datetime-local' value={formData.startTime} onChange={handleChange} />
                <Input label={'Thời gian kết thúc'} name={'endTime'} type='datetime-local' value={formData.endTime} onChange={handleChange} />

            </div>
            <div className={styles.formGroup2}>
                <Input label={'Tên người tổ chức'} name={'accOwner'} value={formData.accOwner} onChange={handleChange} />
                <Input label={'Số điện thoại'} name={'accNumber'} value={formData.accNumber} onChange={handleChange} />
                <Input label={'Ngân hàng'} name={'bank'} value={formData.bank} onChange={handleChange} />
                <Input label={'Chi nhánh'} name={'branch'} value={formData.branch} onChange={handleChange} />

            </div>
            <div className={styles.formGroup}>
                <Button name={'Tạo sự kiện'} onClick={() => handleSubmit()} color={isSaving ? 'silver' : ''}/>
            </div>
        </div>
    )
}