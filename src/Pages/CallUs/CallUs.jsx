import React from 'react'
import './CallUs.css';
import Text_CallUs from './Text_CallUs';
import Img_callUs from './Img_callUs';
import Form_CallUs from './Form_CallUs';

const CallUs = () => {
  return (
    <>
    <div className='mb-lg-5'> <Text_CallUs/></div>
        <div className='callus-container container mb-5'>
      <Img_callUs />
      <div className="form-wrapper mt-5">
        <Form_CallUs />

      </div>
    </div>   </>

  )
    
    
 
}

export default CallUs

