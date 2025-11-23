import React from 'react'
import Whatsapp from '../../assets/whatsapp_icon.png'
const Whatsapp_Btn = () => {
  const openWhatsapp = () => {
    window.open("https://wa.me/963940389427", "_blank")
  }

  return (
  
  <button className='Whatsapp_Btn mt-2' onClick={openWhatsapp}>
          <span>
        <img src={Whatsapp}/>
      </span>

      <span>     تواصل واتساب</span>

    </button>

  
  )
}

export default Whatsapp_Btn
