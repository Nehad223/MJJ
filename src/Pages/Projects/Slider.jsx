import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'   
import Card_Slider from './Card_Slider'
import photo1 from '../../assets/project1.png'
import photo2 from '../../assets/project2.png'
import photo3 from '../../assets/project3.png'
import photo4 from '../../assets/project4.png'
import { Navigation } from 'swiper/modules'; // ← إضافة الموديول
import 'swiper/css/navigation'; // CSS للسهام

const Slider = () => {
  return (
    <Swiper className='Slider mt-5 mb-5' spaceBetween={40} slidesPerView={'2.4'}
      modules={[Navigation]}
  navigation
    >
      <SwiperSlide>
        <Card_Slider Img={photo1} Text="حلول تسويق إبداعية" />
      </SwiperSlide>
        <SwiperSlide>
        <Card_Slider Img={photo4} Text="استراتيجية تسويق متكاملة" />
      </SwiperSlide>
      <SwiperSlide>
        <Card_Slider Img={photo2} Text="تسويق رقمي إبداعي" />
      </SwiperSlide>
            <SwiperSlide>
        <Card_Slider Img={photo3} Text="حملة تسويقية مبتكرة" />
      </SwiperSlide>
  
    </Swiper>
  )
}

export default Slider
