import React from 'react'

const Card_Slider = (props) => {
  return (
    <div className='Card_Slider'>
      <img src={props.Img}/>
      <h1>{props.Text}</h1>
    </div>
  )
}

export default Card_Slider ;

