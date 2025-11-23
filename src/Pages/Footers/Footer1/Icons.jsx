import React from 'react'
import facebook from '../../../assets/facebook_icon.avif';
import youtube from '../../../assets/youtube_icon.avif';
import threads from '../../../assets/threads_icon.avif';
import instgram from '../../../assets/instagram_icon.avif';
import Icon from './Icon';
import tiktok from '../../../assets/tiktok_icon.avif';
import whatsapp from '../../../assets/whatsapp_icon.avif'



const Icons = () => {
  return (
    <div className='Icons'>
        <Icon img={facebook} link={"https://www.facebook.com/share/1AqVx4GXz7/"}/>
        <Icon img={instgram} link={"https://www.instagram.com/dr.jaddoa?igsh=ZHZqdHd4aDkxNmUx"}/>
        <Icon img={threads} link={"https://www.threads.com/@dr.jaddoa"}/>
        <Icon img={youtube} link={"https://youtube.com/@mojadoa?si=L5a3cnkqP485BZRz"}/>
        <Icon img={tiktok} link={"https://www.tiktok.com/@mo_jadoa"}/>
    </div>
  )
}

export default Icons
