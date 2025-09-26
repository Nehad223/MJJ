// Img_Main.jsx
import React, { useEffect } from 'react';
import photo from '../../assets/Main.png'; 

const Img_Main = () => {

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = photo; 
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link); 
    };
  }, []);

  return (
    <div className="Img_Main px-5">
      <img src={photo} alt="خدمات رقمية" />
    </div>
  );
};

export default Img_Main;
