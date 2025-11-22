import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Navigation } from 'swiper/modules'
import 'swiper/css/navigation'
import Card_Slider from './Card_Slider'
import { Link } from 'react-router-dom'

const Slider = () => {
  const [slides, setSlides] = useState([])
  const [thumbnails, setThumbnails] = useState({})
  const [loading, setLoading] = useState(true)

  // جلب البيانات
  useEffect(() => {
    fetch('https://mohammed229.pythonanywhere.com/main/services/')
      .then(res => res.json())
      .then(data => setSlides(data))
      .catch(err => console.error(err))
  }, [])

  // إنشاء صورة من الفيديو
  const getVideoThumbnail = (videoUrl, time = 1) => {
    return new Promise(resolve => {
      const video = document.createElement('video')
      video.src = videoUrl
      video.crossOrigin = 'anonymous'
      video.currentTime = time

      video.addEventListener('loadeddata', () => {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg'))
      })
    })
  }

  // توليد thumbnails للفيديوهات
  useEffect(() => {
    slides.forEach(item => {
      if (!item.image_url && item.video_url) {
        getVideoThumbnail(item.video_url).then(img => {
          setThumbnails(prev => ({ ...prev, [item.id]: img }))
        })
      }
    })
  }, [slides])

  // التأكد من جاهزية كل الصور
  useEffect(() => {
    if (slides.length === 0) return

    let ready = true

    slides.forEach(item => {
      if (!item.image_url && item.video_url && !thumbnails[item.id]) {
        ready = false
      }
    })

    if (ready) {
      setLoading(false)
    }
  }, [slides, thumbnails])

  // إزالة splash screen فقط بعد الجاهزية
  useEffect(() => {
    if (!loading && window.removeSplash) {
      window.removeSplash()
    }
  }, [loading])

if (loading) {
  return (
    <div style={{
      width: "100%",
      height: "300px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div className="spinner"></div>
    </div>
  );
}


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
        if (!displayImg) return null

        return (
          <SwiperSlide key={item.id}>
            <Link 
              to={`/work/${item.id}`} 
              state={{ work: item }} 
              style={{ textDecoration: 'none' }}
            >
              <Card_Slider Img={displayImg} Text={item.name} />
            </Link>
          </SwiperSlide>
        )
      })}
    </Swiper>
  )
}

export default Slider
