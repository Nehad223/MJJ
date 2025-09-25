import React from 'react';
import './Main.css';
import Text_Main from './Text_Main';
import Img_Main from './Img_Main';

const Main = ({ goToCallUs }) => {
  return (
    <div>
      <div className='container Main mt-5'>
        <div className='row'>
          <div className='col-lg-7 mt-lg-5'>
            <Text_Main goToForm={goToCallUs} />
          </div>
          <div className='col-lg-1'></div>
          <div className='col-lg-4'>
            <Img_Main />
          </div>
        </div>
        <div className='row mobile_container'>
          <button className='mt-5 btn-mobile' onClick={goToCallUs}>أبدأ الآن</button>
        </div>
      </div>
    </div>
  );
}

export default Main;


