// Slider.jsx
import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Navigation } from 'swiper/modules'
import 'swiper/css/navigation'
import Card_Slider from './Card_Slider'
import { Link } from 'react-router-dom'

const Slider = () => {
  const [slides, setSlides] = useState([])
  const [thumbnails, setThumbnails] = useState({}) // لتخزين اللقطات من الفيديوهات

  useEffect(() => {
    fetch('https://mohammed229.pythonanywhere.com/main/services/')
      .then(res => res.json())
      .then(data => setSlides(data))
      .catch(err => console.error(err))
  }, [])

  // دالة للحصول على لقطة من الفيديو
  const getVideoThumbnail = (videoUrl, time = 1) => {
    return new Promise((resolve) => {
      const video = document.createElement('video')
      video.src = videoUrl
      video.crossOrigin = 'anonymous' // لو الفيديو من سيرفر ثاني
      video.currentTime = time

      video.addEventListener('loadeddata', () => {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imgData = canvas.toDataURL('image/jpeg')
        resolve(imgData)
      })
    })
  }

  // نجمع لقطات الفيديوهات عند تحميل البيانات
  useEffect(() => {
    slides.forEach(item => {
      if (!item.image_url && item.video_url) {
        getVideoThumbnail(item.video_url).then(img => {
          setThumbnails(prev => ({ ...prev, [item.id]: img }))
        })
      }
    })
  }, [slides])

  return (
    <Swiper
      className="Slider mt-5 mb-5"
      spaceBetween={40}
      slidesPerView={2.4}
      modules={[Navigation]}
      navigation
      lazy={{ loadPrevNext: true, loadPrevNextAmount: 2 }}
    >
      {slides.map(item => {
        const displayImg = item.image_url || thumbnails[item.id]
        if (!displayImg) return null // إذا لا يوجد صورة ولا لقطة → نتجاهل الكارد

        return (
          <SwiperSlide key={item.id} >
            <Link to={`/work/${item.id}`} state={{ work: item }} style={{ textDecoration: 'none' }}>
              <Card_Slider Img={displayImg} Text={item.name} />
            </Link>
            
          </SwiperSlide>
        )
      })}
    </Swiper>
    
  )
}

export default Slider

