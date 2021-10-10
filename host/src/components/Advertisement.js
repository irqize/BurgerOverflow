import React, {useState, useEffect} from 'react';
import './Advertisement.css';


const Advertisement = ({socket, doneOnboarding, setTryOut}) => {
  const [screenNumber, setScreenNumber] = useState(0);
  const [skipAhead, setSkipAhead] = useState(false);

  useEffect(() => {
    var newScreenNumber = screenNumber + 1 
    socket.on("skipAhead", (skip) => {
      if(screenNumber==1) {
        setTryOut();
        setScreenNumber(newScreenNumber)
      }

      else {
          setScreenNumber(newScreenNumber)
      }

  })}, [screenNumber])



return (
    <div className="advertisement">
        {(screenNumber == 0) &&
            <div className="advertisement-0">
                Your mission is to build 2 burgers. You steer with your phone's gyroscope.<br/><br/>
                If you succeed, you win a 20% discount on a burger of your choice!<br/><br/>
                Click the button "Next".
            </div>
        }
        {screenNumber == 1 &&
            <div className="advertisement-0">
               Ready to try it out for 10 seconds? Click "Next"!
            </div>
        }
    </div>
)
}

export default Advertisement