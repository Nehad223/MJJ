import React from 'react'
import './CallUs.css';
import Text_CallUs from './Text_CallUs';
import Img_callUs from './Img_callUs';
import Form_CallUs from './Form_CallUs';
import Whatsapp_Btn from './Whatsapp_Btn';
const CallUs = () => {
  return (
    <>
    <div className='mb-lg-5'> <Text_CallUs/></div>
        <div className='callus-container container mb-5'>
      <Img_callUs />
      <div className="form-wrapper mt-5">
        <Form_CallUs />
   <Whatsapp_Btn/>
      </div>
      
    </div> 
     
    
      </>

  )
    
    
 
}

export default CallUs

