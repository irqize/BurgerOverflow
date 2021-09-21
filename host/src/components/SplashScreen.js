import React, {useState, useEffect} from 'react'
import QRCode from 'qrcode.react';
import './SplashScreen.css'


const SplashScreen = () => {
  const [link, setLink] = useState(null);

  return (
    <div className='splashContainer'>
      <QRCode value={process.env.NODE_ENV === 'production' ? process.env.DOMAIN : 'https://' + window.location.hostname + ':3000'} renderAs='svg' />
    </div>
  )
}

export default SplashScreen
