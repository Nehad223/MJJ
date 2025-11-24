import React from 'react'
import Cart_Service from './Cart_Service'

const Carts_Service = () => {
  return (
    <div className='Carts_Service mt-3'>
      <Cart_Service className="reveal reveal-delay-1" Title="ابتكار المحتوى" Pargraph="نضع خطة مخصّصة تدعم هوية علامتك وأهدافك"/>
      <Cart_Service className="reveal reveal-delay-2"  Title="تخطيط إستراتيجي لوسائل التواصل"  Pargraph="إدارة الإعلانات على المنصات"/>
      <Cart_Service className="reveal reveal-delay-3"  Title="إدارة الإعلانات على المنصات" Pargraph="ندير حملات فعالة لزيادة الوصول والمبيعات" />
      <Cart_Service className="reveal reveal-delay-4"  Title="إنتاج مقاطع الفيديو" Pargraph="نقدّم فيديوهات إبداعية تناسب مختلف المنصات"/>      
    </div>
  )
}

export default Carts_Service


