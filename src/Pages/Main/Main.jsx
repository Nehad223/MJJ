import React from 'react'
import NavBar from './NavBar'
import './Main.css';
import Text_Main from './Text_Main';
import Img_Main from './Img_Main';

const Main = () => {
  return (
    <div>
      <NavBar/>
      <div className='container Main'>
        <div className='row'>
        <div className='col-lg-7'>
             <Text_Main/>
        </div>
     <div className='col-lg-1'></div>
     <div className='col-lg-4'>
      <Img_Main/>
     </div>

        </div>
        <div className='row'>
                <button className='mt-5 btn-mobile'>أبدأ الآن</button>
                
        </div>
        


      </div>
    </div>
  )
}

export default Main

