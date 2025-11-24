import React, { useEffect } from 'react'
import './CallUs.css';
import Text_CallUs from './Text_CallUs';
import Img_callUs from './Img_callUs';
import Form_CallUs from './Form_CallUs';
import Whatsapp_Btn from './Whatsapp_Btn';

const CallUs = () => {

  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach(el => observer.observe(el));
  }, []);

  return (
    <>
      {/* النص */}
      <div className='mb-lg-5 reveal reveal-delay-1'>
        <Text_CallUs/>
      </div>

      {/* الصورة + الفورم */}
      <div className='callus-container container mb-5'>

        <div className='reveal reveal-delay-2'>
          <Img_callUs />
        </div>

        <div className="form-wrapper mt-5 reveal reveal-delay-3">
          <Form_CallUs />
          <Whatsapp_Btn/>
        </div>

      </div> 
    </>
  )
}

export default CallUs;
