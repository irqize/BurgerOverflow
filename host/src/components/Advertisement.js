import React, {useState, useEffect} from 'react';
import './Advertisement.css';
import Hamburger from './images/hamburger.jpeg'



const Advertisement = ({socket, doneOnboarding}) => {
  const [screenNumber, setScreenNumber] = useState(0);
  const [skipAhead, setSkipAhead] = useState(false);

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

return (
    <div>
        {screenNumber == 0 &&
            <div className="advertisement-0">
              Hi!
            </div>
        }
        {screenNumber == 1 &&
            <div className="advertisement-1">This is screen 1
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