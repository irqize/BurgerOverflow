import React, {useState, useEffect} from 'react'
import QRCode from 'qrcode.react';
import './SplashScreen.css'
import './Advertisement.css'
import BurgerBunDown from './images/burger_bun_down.png'
import BurgerBunUp from './images/burger_bun_up.png'


const SplashScreen = () => {
  const [link, setLink] = useState(null);

  return (
    <>
    <div className='splashContainer'>
    <div className="advertisement-0">
      <p className="advertisement-text-head">Win your lunch <br/>on the fly.</p>
      <p className="advertisement-text-bod">Just scan it.</p>
    </div>
      <div className="burgerFlex">
      <img id="BurgerBunUp" src={BurgerBunUp}/>
      <QRCode value={process.env.NODE_ENV === 'production' ? process.env.DOMAIN : 'https://' + window.location.hostname + ':3000'} renderAs='svg' />
      <img id="BurgerBunDown" src={BurgerBunDown}/>
      </div>
    </div>
    </>
  )
}

export default SplashScreen
