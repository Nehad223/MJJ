import React from 'react'
import Cart_Service from './Cart_Service'

const Carts_Service = () => {
  return (
    <div className='Carts_Service mt-3'>
      <Cart_Service Title="ابتكار المحتوى" Pargraph="نضع خطة مخصّصة تدعم هوية علامتك وأهدافك"/>
      <Cart_Service Title="تخطيط إستراتيجي لوسائل التواصل" Pargraph="إدارة الإعلانات على المنصات"/>
      <Cart_Service Title="إدارة الإعلانات على المنصات" Pargraph="ندير حملات فعالة لزيادة الوصول والمبيعات" />
      <Cart_Service Title="إنتاج مقاطع الفيديو" Pargraph="نقدّم فيديوهات إبداعية تناسب مختلف المنصات"/>      
    </div>
  )
}

export default Carts_Service


