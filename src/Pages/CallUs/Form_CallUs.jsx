import React from 'react'

const Form_CallUs = () => {
  return (
    <div className='Form_CallUs'>
      <form>
        <p>الاسم الكامل</p>
        <input type="text" />

        <p>البريد الالكتروني</p>
        <input type="email" />

        <p>الرسالة</p>
        <textarea rows="4"></textarea>

        <button type="submit">ارسل الرسالة</button>
      </form>
    </div>
  )
}

export default Form_CallUs
