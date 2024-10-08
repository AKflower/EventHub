import styles from './search.module.scss'
import Button from '../button/button'
import Select from '../select/select'
import eventService from '../../services/eventService'
import { useState } from 'react'
import { useNavigate,useSearchParams } from 'react-router-dom'


export default function Search() {
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
    const [searchParams] = useSearchParams();
    const name = searchParams.get('name');
    const categories = searchParams.get('categories');
    const navigate = useNavigate()
    const [formData,setFormData] = useState({
        categories: categories ? categories : '',
        city: '',
        name: name ? name : '',
    })
    const handleSearch =  () => {
        window.location.href = `http://localhost:3000/home?categories=${formData.categories}&name=${formData.name}`
    }
    return (
        
        <div className={styles.container}>
            <div className={styles.searchInput}>
                <input placeholder='Sự kiện' name='name' value={formData.name} onChange={handleChange}/>
                <Button name={'Tìm kiếm'} width={'6em'} borderRadius='5px' onClick={() => handleSearch()}/>
            </div>
            <div className={styles.filter}>
                <Select
                    name={'categories'}
                    value={formData.categories}
                    onChange={handleChange}
                    options={[
                        {
                            value: '',
                            label: 'Tất cả thể loại',
                        },
                        {
                            value: '1',
                            label: 'Âm nhạc',
                        },
                        {
                            value: '4',
                            label: 'Thể thao',
                        },
                        {
                            value: '2',
                            label: 'Sân khấu & Nghệ thuật',
                        },
                        {
                            value: '3',
                            label: 'Sự kiện khác',
                        }
                    ]}
                    
                />
                <Select
                    
                    options={[
                        {
                            value: 0,
                            label: 'Toàn quốc',
                        },
                        {
                            value: 1,
                            label: 'Hồ Chí Minh',
                        },
                        {
                            value: 2,
                            label: 'Hà Nội',
                        },
                        {
                            value: 3,
                            label: 'Đà Lạt',
                        },
                        {
                            value: 4,
                            label: 'Khác',
                        },

                    ]}
                />
                <Select
                    
                options={[
                    {
                        value: 0,
                        label: 'Mức giá',
                    },
                    {
                        value: 1,
                        label: 'Miễn phí',
                    },
                    {
                        value: 2,
                        label: 'Dưới 100.0000',
                    },
                    {
                        value: 3,
                        label: 'Dưới 500.0000',
                    },
                    {
                        value: 4,
                        label: 'Dưới 1.000.0000',
                    },
                    {
                        value: 5,
                        label: 'Dưới 2.000.0000',
                    },
                    {
                        value: 6,
                        label: 'Trên 2.000.0000',
                    }
                ]}
            />
            </div>

        </div>
    )
}