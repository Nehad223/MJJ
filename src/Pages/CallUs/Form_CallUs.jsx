import React, { useState } from 'react'

// دالة قراءة الكوكي
function getCookie(name) {
  let cookieValue = null
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      if (cookie.startsWith(name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
        break
      }
    }
  }
  return cookieValue
}

const Form_CallUs = () => {
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    message: ''
  })

  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validate = () => {
    let tempErrors = {}

    if (!formData.user_name.trim()) tempErrors.user_name = 'الاسم مطلوب'
    if (!formData.user_email.trim()) {
      tempErrors.user_email = 'البريد الإلكتروني مطلوب'
    } else if (!/\S+@\S+\.\S+/.test(formData.user_email)) {
      tempErrors.user_email = 'بريد إلكتروني غير صالح'
    }
    if (!formData.message.trim()) tempErrors.message = 'الرسالة مطلوبة'

    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess('')

    if (!validate()) return

    try {
      const csrftoken = getCookie('csrftoken') // جلب CSRF token من الكوكي

      const res = await fetch('https://mohammed229.pythonanywhere.com/main/api/send-message/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken
        },
        body: JSON.stringify(formData)
      })

      const data = await res.text() // قراءة نص الرد من السيرفر
      console.log('Server response:', data) // عرض الرد في الكونسول

      if (!res.ok) {
        setSuccess('حدث خطأ أثناء الإرسال ❌')
        return
      }

      setSuccess('تم إرسال الرسالة بنجاح ✅')
      setFormData({ user_name: '', user_email: '', message: '' })
      setErrors({})
    } catch (error) {
      console.error('Fetch error:', error)
      setSuccess('حدث خطأ أثناء الإرسال ❌')
    }
  }

  return (
    <div className='Form_CallUs'>
      <form onSubmit={handleSubmit}>
        <p>الاسم الكامل</p>
        <input
          type="text"
          name="user_name"
          value={formData.user_name}
          onChange={handleChange}
        />
        {errors.user_name && <small className="error">{errors.user_name}</small>}

        <p>البريد الالكتروني</p>
        <input
          type="email"
          name="user_email"
          value={formData.user_email}
          onChange={handleChange}
        />
        {errors.user_email && <small className="error">{errors.user_email}</small>}

        <p>الرسالة</p>
        <textarea
          rows="4"
          name="message"
          value={formData.message}
          onChange={handleChange}
        ></textarea>
        {errors.message && <small className="error">{errors.message}</small>}

        <button type="submit">ارسل الرسالة</button>
      </form>
      {success && <p>{success}</p>}
    </div>
  )
}

export default Form_CallUs
