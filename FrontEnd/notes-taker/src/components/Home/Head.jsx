import React from 'react'
import Lottie from 'lottie-react';
import HeadAnim from '../../assets/Animations/NoteTaker.json'
function Head() {
  return (
    <div>
        
        <div className='bg-slate-200 w-full text-center flex shadow-xl'>
        <Lottie
        animationData={HeadAnim} // Replace with your animation data
        loop={true} // Set to true to make the animation loop continuously
        autoplay={true} 
        className=" mt-0 w-20 ml-4"
      />
                <h1 className='font-bold text-3xl mt-1 p-4 text-sky-950'>NOTE TAKER</h1>
            </div>
    </div>
  )
}

export default Head