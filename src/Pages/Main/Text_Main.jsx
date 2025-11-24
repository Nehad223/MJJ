import React from 'react'

const Text_Main = ({ goToForm }) => {
  return (
    <div className='Text_Main mt-5'>
      <h1 className='mt-5 fade-up fade-delay-1 m-fade-up m-delay-1'>نقود حضورك الرقمي إلى القمة</h1>
      <p className='mt-5 fade-up fade-delay-2 m-fade-up m-delay-2'>
        حلول إبداعية واستراتيجيات مدروسة لوسائل التواصل 
        الاجتماعي، تضع علامتك التجارية في صدارة العالم الرقمي
      </p>

      <button className='mt-5 btn-desktop fade-up fade-delay-3 m-fade-up m-delay-3' onClick={goToForm}>أبدأ الآن</button>
    </div>
  )
}

export default Text_Main

