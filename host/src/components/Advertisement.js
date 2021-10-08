import React, {useState, useEffect} from 'react';
import './Advertisement.css';
import Hamburger from './images/hamburger.jpeg'



const Advertisement = ({socket, doneOnboarding}) => {
  const [screenNumber, setScreenNumber] = useState(0);
  const [skipAhead, setSkipAhead] = useState(false);
  const [authgyro, setauthgyro] = useState(false)

  useEffect(() => {
    var newScreenNumber = screenNumber + 1 
    socket.on("skipAhead", (skip) => {
      console.log(skip)
      if (screenNumber == 2) {
        doneOnboarding()
      }

      else {
          setScreenNumber(newScreenNumber)
      }

  })}, [screenNumber])

  useEffect(() => {
  socket.on("grantedGyro", (bool) => {
    setauthgyro(bool)
  })
  },[])


return (
    <div className="advertisement">
        {(screenNumber == 0 && !authgyro) &&
            <div className="advertisement-0">
                Firstly, you have to connect and enable your phone's gyroscope. <br/><br/>
                Check your phone and click on "Start gyro".
            </div>
        }
        {(authgyro && screenNumber==! 1) ? 
          <div className="advertisement-0">
            Nicely done! Your mission is to build burgers with the help of your phone. <br/><br/>
            You steer the burger spawn with your phone's gyroscope. <br/><br/>
            Click the button "Next" on your phone.
          </div>:<></>}
        {screenNumber == 1 &&
            <div className="advertisement-0">
              If you succeed, you win a 20% discount on a burger of your choice! <br/><br/>
              Good luck, click "Next" to start!
            </div>
        }
        {screenNumber == 2 &&
            <div className="advertisement-0">This is screen 2
        </div>
        }
    </div>
)
}

export default Advertisement