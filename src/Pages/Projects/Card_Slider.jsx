import React, { useState } from 'react'

const Card_Slider = ({ Img, Text }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className='Card_Slider'>
      <div className={`img-wrapper ${loaded ? "loaded" : "loading"}`}>
        <img 
          src={Img} 
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
      </div>
      <h1>{Text}</h1>
    </div>
  )
}

export default Card_Slider;
