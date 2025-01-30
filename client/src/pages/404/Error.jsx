import React from 'react'
import image from '../../assets/404.svg';

const Error = () => {
  return (
    <div className='error404'>
        <img className='w-full h-screen' src={image}/>
    </div>
  )
}

export default Error