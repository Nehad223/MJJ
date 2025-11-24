import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Navigation } from 'swiper/modules'
import 'swiper/css/navigation'
import Card_Slider from './Card_Slider'
import { Link } from 'react-router-dom'

const STORAGE_KEY_SLIDES = 'slider_slides_v1'
const STORAGE_KEY_THUMBS = 'slider_thumbnails_v1'

const Slider = () => {
  const [slides, setSlides] = useState([])
  const [thumbnails, setThumbnails] = useState({})
  const [loading, setLoading] = useState(true)

  // مساعدة لحفظ/قراءة من sessionStorage بأمان
  const readStorage = (key) => {
    try {
      const raw = sessionStorage.getItem(key)
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      console.warn('Failed to parse sessionStorage', key, e)
      return null
    }
  }
  const writeStorage = (key, value) => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.warn('Failed to write sessionStorage', key, e)
    }
  }

  // جلب البيانات أو استرجاعها من الجلسة
  useEffect(() => {
    const cachedSlides = readStorage(STORAGE_KEY_SLIDES)
    const cachedThumbs = readStorage(STORAGE_KEY_THUMBS)

    if (cachedSlides) {
      setSlides(cachedSlides)
    }

    if (cachedThumbs) {
      setThumbnails(cachedThumbs)
    }

    // إذا ما في كاش، نجيب من الباك-إند
    if (!cachedSlides) {
      fetch('https://mohammed229.pythonanywhere.com/main/services/')
        .then(res => res.json())
        .then(data => {
          setSlides(data)
          writeStorage(STORAGE_KEY_SLIDES, data)
        })
        .catch(err => console.error(err))
    }
  }, [])

  // إنشاء صورة من الفيديو (مع تنظيف و handling للأخطاء)
  const getVideoThumbnail = (videoUrl, time = 1) => {
    return new Promise(resolve => {
      try {
        const video = document.createElement('video')
        let handled = false

        const cleanup = () => {
          try {
            video.pause()
            video.removeAttribute('src')
            video.load && video.load()
          } catch (e) {}
        }

        const onLoadedData = () => {
          try {
            const canvas = document.createElement('canvas')
            canvas.width = video.videoWidth || 320
            canvas.height = video.videoHeight || 180
            const ctx = canvas.getContext('2d')
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            const dataUrl = canvas.toDataURL('image/jpeg')
            handled = true
            cleanup()
            resolve(dataUrl)
          } catch (err) {
            handled = true
            cleanup()
            resolve(null)
          } finally {
            video.removeEventListener('loadeddata', onLoadedData)
            video.removeEventListener('error', onError)
          }
        }

        const onError = () => {
          if (!handled) {
            handled = true
            cleanup()
            resolve(null)
          }
          video.removeEventListener('loadeddata', onLoadedData)
          video.removeEventListener('error', onError)
        }

        video.crossOrigin = 'anonymous'
        video.preload = 'auto'
        video.addEventListener('loadeddata', onLoadedData)
        video.addEventListener('error', onError)
        // بعض السيرفرات تمنع seek قبل metadata — هنا نحاول ببساطة
        video.src = videoUrl
        // حاول نغيّر currentTime بعد قليل إن لم يتم تلقائياً
        setTimeout(() => {
          if (!handled) {
            try {
              video.currentTime = time
            } catch (e) { /* ignore */ }
          }
        }, 200)
        // كحد أقصى بعد 6 ثواني نعيد بست null
        setTimeout(() => {
          if (!handled) {
            handled = true
            cleanup()
            video.removeEventListener('loadeddata', onLoadedData)
            video.removeEventListener('error', onError)
            resolve(null)
          }
        }, 6000)
      } catch (e) {
        resolve(null)
      }
    })
  }

  // توليد thumbnails للفيديوهات — ونخزنهم فور توليد كل واحد في sessionStorage
  useEffect(() => {
    if (!slides || slides.length === 0) return

    slides.forEach(item => {
      if (!item.image_url && item.video_url && !thumbnails[item.id]) {
        // توليد وصبّ النتيجة في الstate ثم حفظ بالsessionStorage
        getVideoThumbnail(item.video_url).then(img => {
          if (img) {
            setThumbnails(prev => {
              const next = { ...prev, [item.id]: img }
              writeStorage(STORAGE_KEY_THUMBS, next)
              return next
            })
          } else {
            // لو ما قدرنا نطلع thumbnail نقدر نخزن قيمة فارغة لتفادي إعادة المحاولة غير المنتهية
            setThumbnails(prev => {
              if (prev[item.id] !== undefined) return prev
              const next = { ...prev, [item.id]: null }
              writeStorage(STORAGE_KEY_THUMBS, next)
              return next
            })
          }
        })
      }
    })
  }, [slides]) // لا نحتاج تدخل thumbnails كـ dep لأن نحفظ بعد كل توليد مباشرة

  // التأكد من جاهزية كل الصور
  useEffect(() => {
    if (slides.length === 0) return

    let ready = true

    for (const item of slides) {
      if (!item.image_url && item.video_url) {
        // شرط الجاهزية: يا إما عندنا thumbnail غير null، وإلا مش جاهز
        if (!thumbnails.hasOwnProperty(item.id) || thumbnails[item.id] === null) {
          ready = false
          break
        }
      }
    }

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
