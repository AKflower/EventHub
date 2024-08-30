import styles from './eventDetail.module.scss'
import coverImg1 from '../../assets/img/coverImg1.png'

export default function EventDetail() {
    return (
        <div className='main'>
            <div className={styles.infor}>
                <div className={styles.coverContainer}>
                    <div className={styles.cover} style={{ backgroundImage: `url(${coverImg1})` }}>

                    </div>
                </div>

                <div className={styles.content}>
                    <h3>Yên Concert</h3>
                </div>

            </div>
            <div className={styles.subInfor}>
                <div className={styles.description}>
                    <h3>Giới thiệu</h3>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                </div>
                <div className={styles.price}>
                    <h3>Hạng vé</h3>
                </div>
            </div>
        </div>
    )
}