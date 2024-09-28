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
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ticketTypeService from '../../services/ticketTypeService';
import EventItem from '../eventItem/eventItem';
import Ptitle from '../ptitle/ptitle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';

export default function ManageEvent() {
    const userId = localStorage.getItem('userId')
    const [save,setSave] = useState(false);
    const [preview, setPreview] = useState('');
    const [file, setFile] = useState(null);
    const [isSaving,setIsSaving] = useState(false)
    const [events,setEvents] = useState([])
    const [showModal,setShowModal] = useState(false)
    const [eventSelected,setEventSelected] = useState()
    const [isManageTicket,setIsManageTicket] = useState(false)
    const [ticketTypes,setTicketTypes] = useState();
    const [showTicketModal,setShowTicketModal] = useState(false)
    const [showNewTicketModal,setShowNewTicketModal] = useState(false)
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
        var { name, value } = e.target;
        var strArr = []
        console.log('Test',name,value);
        console.log(value.split('.'));
        if (name == 'price')  {
            strArr = value.split('.');
        var newValue = ''
        for (let i = 0; i < strArr.length; i++) {
            newValue += strArr[i]

        }

        value = parseInt(newValue)
        } 
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
    const handleBack = async () => {
        fetchEvents()
        setTicketTypes();
        setEventSelected();
        setIsManageTicket(false);
    }
    const handleManageTicket = async (e,event) => {
        e.stopPropagation();
        const res = await ticketTypeService.getTicketTypesByEventId(event.id);
        setTicketTypes(res);
        setEventSelected(event);
        setIsManageTicket(true);

    }

    const handleNewTicket = async () => {
        setShowNewTicketModal(true);
        setFormData({
            
            name: "",
            description: "",
            eventId: "",
            price: 0,   
            eventId: eventSelected.id,
            total: 1,
            minBuy: 1,
            maxBuy: 4,
            startTime: eventSelected.startTime,
            endTime: eventSelected.endTime
          })
    }
    const handleNewTicketSubmit  = async () => {
        const ticketType = await ticketTypeService.createTicketType(formData)
        const res = await ticketTypeService.getTicketTypesByEventId(eventSelected.id);
        setTicketTypes(res);
        setShowNewTicketModal(false);
        setFormData();
        toast.success('Cập nhật thành công')

    }
    const handleEditTicket = async (ticket) => {
        setShowTicketModal(true);
        setFormData(ticket)
    }
    const handleEditTicketSubmit  = async () => {
        const ticketType = await ticketTypeService.updateTicketType(formData.id,formData)
        const res = await ticketTypeService.getTicketTypesByEventId(eventSelected.id);
        setTicketTypes(res);
        setShowTicketModal(false);
        setFormData();
        toast.success('Cập nhật thành công')

    }
    const handleFetch =  async () => {
        setShowModal(false);
        setEventSelected()
        setSave(false)
        fetchEvents()
    }
    const handleActive = async () => {
        const res = await eventService.patchEventIsActive(eventSelected.id,true);
        toast.success('Sự kiện đã được mở bán vé!');
        setEventSelected(res);
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
        const res = await eventService.getEventsByCreatedById(userId)
        setEvents(res);
    }
    const handleEdit = (event) => {
        setEventSelected(event);
        setShowModal(true);
    }
    useEffect(() => {
       if (!userId) return;
        fetchEvents()
    }, [userId])
    return (
        <div className={styles.container}>
            {ticketTypes && <div className={styles.back} onClick={() => handleBack()}><ArrowBackIcon /> </div>}
            <h3 style={{margin:'1em 0'}}>{ticketTypes ? 'Quản lý vé': 'Sự kiện của tôi'}</h3>
            {!ticketTypes && <table className='table'>
            <thead>
                <tr>
                    <th>Tên sự kiện</th>
                    <th>Loại sự kiện</th>
                    <th>Địa điểm</th>
                    <th>Bắt đầu</th>
                    <th>Kết thúc</th>
                    <th>Trạng thái</th>
                    <th></th>
                
                </tr>
            </thead>
            <tbody>
                {events.map((event) => (
                    <tr onClick={() => handleEdit(event)}>
                        <td>{event.name}</td>
                        <td>{event.category}</td>
                        <td>{`${event.venueName} ${event.street} ${event.ward} ${event.district} ${event.city}`}</td>
                        <td>{formatService.formatDate(event.startTime)}</td>
                        <td>{formatService.formatDate(event.endTime)}</td>
                        <td>{event.isActive ? event.statusName : 'Chưa mở bán vé'}</td>
                        <td onClick={(e) => handleManageTicket(e,event)}>
                            <ArrowForwardIosIcon />
                        </td>
                    </tr>
                ))}
                
            </tbody>
        </table>}
        {
            showTicketModal && 
            <Modal 
                title={'Cập nhật loại vé'}
                onClose={() => {
                    setShowTicketModal(false)
                    
                }}
                onSubmit={() => handleEditTicketSubmit()}
            >
            <div style={{ maxHeight: '30em', overflow: 'auto' }}>
                <Input label={'Tên loại vé'} name={'name'} value={formData.name} onChange={handleChange}/>
                <div className='formGroup2'>
                  
                    <Input label={'Giá tiền'} name={'price'} value={formatService.formatPrice(parseInt(formData.price))} onChange={handleChange}/>
                    <Input label={'Tổng số vé'} type='number' name={'total'} value={formData.total} onChange={handleChange}/>
                </div>
                <Input label={'Mô tả'} isTextArea={true} name={'description'} value={formData.description} onChange={handleChange}/>
            </div>
          
            </Modal>
        }
        {
            showNewTicketModal && 
            <Modal 
                title={'Tạo vé mới'}
                onClose={() => {
                    setShowNewTicketModal(false)
                    
                }}
                onSubmit={() => handleNewTicketSubmit()}
            >
            <div style={{ maxHeight: '30em', overflow: 'auto' }}>
                <Input label={'Tên loại vé'} name={'name'} value={formData.name} onChange={handleChange}/>
                <div className='formGroup2'>
                  
                    <Input label={'Giá tiền'} name={'price'} value={formatService.formatPrice(parseInt(formData.price,10))} onChange={handleChange}/>
                    <Input label={'Tổng số vé'} type='number' name={'total'} value={formData.total} onChange={handleChange}/>
                </div>
                <Input label={'Mô tả'} isTextArea={true} name={'description'} value={formData.description} onChange={handleChange}/>
            </div>
          
            </Modal>
        }
        {ticketTypes &&
            <>
            <div className={styles.eventDetail}>
                <div className={styles.img} style={{backgroundImage: `url(${ galleryService.getLinkImage(eventSelected.coverImg) })`}}></div>
                <div className={styles.info}>
                    <h3>{eventSelected.name}</h3>
                    <div style={{fontSize:'12px'}}><Ptitle title={'Địa chỉ'} content={`${eventSelected.venueName} ${eventSelected.street} ${eventSelected.ward} ${eventSelected.district} ${eventSelected.city}`}/></div>
                    <div className={styles.detail}>
                        <Ptitle title={'Trạng thái'} content={eventSelected.isActive ?  eventSelected.statusName : 'Chưa mở bán vé'}/>
                        <Ptitle title={'Bắt đầu'} content={formatService.formatDate(eventSelected.startTime)}/>
                        <Ptitle title={'Kết thúc'} content={formatService.formatDate(eventSelected.endTime)}/>
                    </div>
                    {!eventSelected.isActive && <div>
                        <Button name={'Mở bán vé'} color={ticketTypes.length==0 ? 'silver' : ''} onClick={() => {
             
                        if (ticketTypes.length==0) toast.warning('Phải có ít nhất 1 loại vé!');
                        else   handleActive()
                        }}/>
                    </div>}
                </div>
            </div>
            {eventSelected.statusId==1 && <div className={styles.tool}>
                <div className={styles.add} onClick={() => handleNewTicket()}><AddIcon /> </div>
            </div>}
            <table className='table'>
            <thead>
                <tr>
                    <th>Loại vé</th>
                    <th>Giá</th>
                    <th>Mô tả</th>
                    <th>Tổng số vé</th>
                    <th>Đã bán</th>
                  
                
                </tr>
            </thead>
            <tbody>
                {ticketTypes.map((ticketType) => (
                    <tr onClick={() => handleEditTicket(ticketType)}>
                        <td>{ticketType.name}</td>
                        <td>{formatService.formatPrice(parseInt(ticketType.price,10))}</td>
                       
                        <td>{ticketType.description}</td>
                        <td>{ticketType.total}</td>
                        <td>{(ticketType.total-ticketType.available)}</td>
                       
                    </tr>
                ))}
            </tbody>

        </table>
        {ticketTypes.length==0 && <h3 style={{margin: '2em 0'}} className='d-flex x-center'>Hãy tạo vé cho sự kiện của bạn!</h3>}

        </>
        }
        
        
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