import React from 'react'
import facebook from '../../../assets/facebook_icon.png';
import x from '../../../assets/x_icon.png';
import youtube from '../../../assets/youtube_icon.png';
import threads from '../../../assets/threads_icon.png';
import instgram from '../../../assets/instagram_icon.png';
import Icon from './Icon';





const Icons = () => {
  return (
    <div className='Icons'>
        <Icon img={facebook}/>
        <Icon img={instgram}/>
        <Icon img={threads}/>
        <Icon img={youtube}/>
        <Icon img={x}/>
    </div>
  )
}

export default Icons
