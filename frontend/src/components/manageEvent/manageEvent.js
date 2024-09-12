import styles from './manageEvent.module.scss'
import { useEffect, useRef, useState } from 'react';
import Input from '../input/input';
import Select from '../select/select';
import Button from '../button/button';
import eventService from '../../services/eventService';
import galleryService from '../../services/galleryService'
import { toast } from 'react-toastify';
import formatService from '../../services/formatService';
import Modal from '../modal/modal';
import FormCreate from '../formCreate/formCreate';
import FormUpdate from '../FormUpdate/formUpdate';

export default function ManageEvent() {
    const [save,setSave] = useState(false);
    const [preview, setPreview] = useState('');
    const [file, setFile] = useState(null);
    const [isSaving,setIsSaving] = useState(false)
    const [events,setEvents] = useState([])
    const [showModal,setShowModal] = useState(false)
    const [eventSelected,setEventSelected] = useState()
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
        const event = await eventService.createEvent({...formData, coverImg: res.id});
        toast.success('Tạo thành công!');
        setIsSaving(false)
        
    }
    const handleFetch =  async () => {
        setShowModal(false);
        setEventSelected()
        setSave(false)
        fetchEvents()
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
    const fetchEvents = async () => {
        const res = await eventService.getAllEvents()
       
        setEvents(res);
    }
    const handleEdit = (event) => {
        setEventSelected(event);
        setShowModal(true);
    }
    useEffect(() => {
        fetchEvents()
    }, [])
    return (
        <div className={styles.container}>
            <h3>Sự kiện của tôi</h3>
            <table className='table'>
            <thead>
                <tr>
                    <th>Tên sự kiện</th>
                    <th>Loại sự kiện</th>
                    <th>Địa điểm</th>
                    <th>Bắt đầu</th>
                    <th>Kết thúc</th>
                    <th>Trạng thái</th>
                
                </tr>
            </thead>
            <tbody>
                {events.map((event) => (
                    <tr onClick={() => handleEdit(event)}>
                        <td>{event.name}</td>
                        <td>{event.category}</td>
                        <td>{`${event.venueName} ${event.street} ${event.ward} ${event.distict} ${event.city}`}</td>
                        <td>{formatService.formatDate(event.startTime)}</td>
                        <td>{formatService.formatDate(event.endTime)}</td>
                        <td>{event.statusName}</td>
                    </tr>
                ))}
                
            </tbody>
        </table>
        {
            showModal && 
            <Modal 
                title={'Cập nhật thông tin'}
                onClose={() => {
                    setShowModal(false)
                    setSave(false);
                }}
                onSubmit={() => setSave(true)}
            >
            <div style={{ maxHeight: '30em', overflow: 'auto' }}>
            <FormUpdate event={eventSelected} save={save} onFetch={() => handleFetch()}/>
            </div>
          
            </Modal>
        }
        </div>
    )
}