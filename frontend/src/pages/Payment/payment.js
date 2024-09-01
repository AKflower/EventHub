import styles from './payment.module.scss'
import ProgressBar from '../../components/progressBar/progressBar'
import icon from '../../assets/icon/icon'
import Button from '../../components/button/button'

export default function Payment() {
    const data = [
        {
            id: 1,
            name: 'Thanh toán bằng Momo',
            icon: 'momo'
        },
        {
            id: 2,
            name: 'Thanh toán bằng VNPay',
            icon: 'vnpay'
        },
        {
            id: 3,
            name: 'Thanh toán ATM/Internet Banking',
            icon: 'atm'
        }
    ]
    return (
        <div className='main'>
            <ProgressBar statusCurr={2} />
            <div className={styles.container}>
                <div className={styles.payment}>
                    <h3>Chọn phương thức thanh toán</h3>
                    {data.map((item) => (
                        <div className={styles.paymentMethod}>
                            <input type='radio' name='method' />
                            <div className={styles.content}>
                                <div className={styles.icon} style={{ backgroundImage: `url(${icon[item.icon]})` }}></div>
                                <h4>{item.name}</h4>
                                <div></div>
                            </div>
                        </div>
                    ))}
                    <div className='d-flex x-center' style={{ padding: '1em 0' }}><Button name={'Thanh toán'} width={'10em'} color='#379777' /></div>
                </div>
                <div className={styles.infor}>
                    <div className={styles.userInfo}>
                        <h3>Thông tin nhận vé</h3>
                        <div className={styles.info}>
                            <p>Nguyen Van A</p>
                            <p>012758432</p>
                        </div>
                        <div className={styles.info}>
                            <p>nguyenvana@gmail.com</p>
                        </div>
                    </div>
                    <div className={styles.ticketInfo}>
                        <h3>Thông tin đặt vé</h3>
                        <div className={styles.table}>
                            <div className={styles.left}><span style={{ fontWeight: '600' }}>Hạng vé</span></div>
                            <div className={styles.right}><span style={{ fontWeight: '600' }}>Số lượng</span></div>

                        </div>
                        <div className={styles.ticket}>
                            <div className={styles.left}>
                                <div>VIP1</div>
                                <div>100.000</div>
                            </div>
                            <div className={styles.right}>
                                <div>2</div>
                                <div>200.000</div>
                            </div>
                        </div>
                        <div className={styles.table} style={{padding:'1em 0'}}>
                            <div className={styles.left}><span>Tổng tiền</span></div>
                            <div className={styles.right}><span style={{ fontWeight: '600' }}>200.000</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}