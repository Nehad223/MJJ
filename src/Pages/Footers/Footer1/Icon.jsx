import React from 'react'
import { Link } from 'react-router-dom'
const Icon = (props) => {
  return (
    <div className='Icon'>
          <Link to={props.link}  target='_blank'>
          <img className='img' src={props.img}  />
        </Link>
    </div>
  )
}

export default Icon
