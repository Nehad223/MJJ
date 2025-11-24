import React, { useEffect } from 'react';
import Text_Service from './Text_Service';
import './Service.css';
import Carts_Service from './Carts_Service';

const Service = () => {

  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
      (entries) => {
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
    <div className='container Text_Service reveal'>
      <Text_Service />
      <Carts_Service />
    </div>
  );
}

export default Service;
