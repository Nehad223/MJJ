import React from 'react'
import Text_Fotter2 from './Text_Fotter2'
import Our_Mark from './Our_Mark'
import Line_Fotter from './Line_Fotter'
import Rights_Fotter2 from './Rights_Fotter2'

const Fotter2 = () => {
  return (
    <div className='Fotter2 mt-lg-5 '>
        <div className='container mt-lg-5'>
            <div className='row'>     <div className='col-lg-6'>   <Text_Fotter2/></div>
            <div className='col-lg-6'><Our_Mark/></div></div>
              
        </div>

    <Line_Fotter/>
    <Rights_Fotter2/>
    </div>
  )
}

export default Fotter2

