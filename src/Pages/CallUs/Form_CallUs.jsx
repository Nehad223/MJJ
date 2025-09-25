// Form_CallUs.jsx
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Form_CallUs = () => {
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    let tempErrors = {};

    if (!formData.user_name.trim()) tempErrors.user_name = 'الاسم مطلوب';
    if (!formData.user_email.trim()) {
      tempErrors.user_email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.user_email)) {
      tempErrors.user_email = 'بريد إلكتروني غير صالح';
    }
    if (!formData.message.trim()) tempErrors.message = 'الرسالة مطلوبة';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // مسح أخطاء سابقة
    setErrors({});

    if (!validate()) {
      // إظهار أول خطأ كـ toast لتحسين تجربة المستخدم
      const firstKey = Object.keys(errors)[0];
      const firstMsg = (errors[firstKey] || Object.values(errors)[0]) ?? 'تحقق من الحقول';
      // إذا validate عدل الأخطاء بعد setErrors، فخد نسخة من الerrors المحسوبة
      const temp = {};
      if (!formData.user_name.trim()) temp.user_name = 'الاسم مطلوب';
      if (!formData.user_email.trim()) temp.user_email = 'البريد الإلكتروني مطلوب';
      else if (!/\S+@\S+\.\S+/.test(formData.user_email)) temp.user_email = 'بريد إلكتروني غير صالح';
      if (!formData.message.trim()) temp.message = 'الرسالة مطلوبة';
      const first = Object.values(temp)[0];
      toast.warn(first || firstMsg, { autoClose: 3000 });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('https://mohammed229.pythonanywhere.com/main/send-message/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const text = await res.text().catch(() => '');
      // حاول تحويله لجيسون لو يمكن
      let json;
      try { json = JSON.parse(text || '{}'); } catch { json = null; }

      if (!res.ok) {
        // إذا السيرفر رجّع رسالة واضحة
        const serverMsg = (json && (json.message || json.error)) || text || `خطأ من السيرفر (${res.status})`;
        toast.error(serverMsg, { autoClose: 4000 });
        return;
      }

      toast.success('تم إرسال الرسالة بنجاح ✅', { autoClose: 3000 });
      setFormData({ user_name: '', user_email: '', message: '' });
      setErrors({});
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('حدث خطأ أثناء الإرسال. تأكد من الشبكة أو السيرفر.', { autoClose: 4000 });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='Form_CallUs'>
      {/* إن كان عندك ToastContainer مركزي بالـ App احذفه من هنا، بس لازم يكون واحد بمشروعك */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        rtl={true}
      />

      <form onSubmit={handleSubmit} noValidate>
        <p>الاسم الكامل</p>
        <input
          type="text"
          name="user_name"
          value={formData.user_name}
          onChange={handleChange}
          aria-invalid={!!errors.user_name}
          aria-describedby="err-name"
        />
        {errors.user_name && <small id="err-name" className="error">{errors.user_name}</small>}

        <p>البريد الالكتروني</p>
        <input
          type="email"
          name="user_email"
          value={formData.user_email}
          onChange={handleChange}
          aria-invalid={!!errors.user_email}
          aria-describedby="err-email"
        />
        {errors.user_email && <small id="err-email" className="error">{errors.user_email}</small>}

        <p>الرسالة</p>
        <textarea
          rows="4"
          name="message"
          value={formData.message}
          onChange={handleChange}
          aria-invalid={!!errors.message}
          aria-describedby="err-message"
        ></textarea>
        {errors.message && <small id="err-message" className="error">{errors.message}</small>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'جاري الإرسال...' : 'ارسل الرسالة'}
        </button>
      </form>
    </div>
  );
};

export default Form_CallUs;
