import styles from './organizer.module.scss'
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import EditIcon from '@mui/icons-material/Edit';
import FormCreate from '../../components/formCreate/formCreate';
import { useState } from 'react';
import ManageEvent from '../../components/manageEvent/manageEvent';
export default function Organizer () {
    const [tab,setTab] = useState(1);
    
    return (
        <div className='main'>
            <div className={styles.container}>
                <div className={styles.left}>
                    <div className={styles.sidebar}>
                        <h3> Quản lý sự kiện</h3>
                        <div className={tab==1 ? styles.tabActive : styles.tab} onClick={() => setTab(1)}><LocalActivityIcon />Sự kiện của tôi</div>
                        <div className={tab==2 ? styles.tabActive : styles.tab} onClick={() => setTab(2)}><EditIcon /> Tạo sự kiện</div>
                    </div>
                   
                </div>
                <div className={styles.right}>
                    {tab==1 && <ManageEvent />}
                    {tab==2 && <FormCreate />}
                    
                </div>
            </div>
        </div>
    )
}