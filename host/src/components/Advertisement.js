import React, {useState, useEffect} from 'react';
import './Advertisement.css';
import Hamburger from './images/hamburger.jpeg'



const Advertisement = () => {
  const [screenNumber, setScreenNumber] = useState(0);



return (
    <div>
        {screenNumber == 0 &&
            <div className="advertisement-0">
            <p>Hungry for a new <text  className="advertisement-text-red">experience</text>?</p>
            <img className="advertisement-0-img" src={Hamburger}></img>
            {/* <h1 onClick={() => setScreenNumber(1)}>{`>`}</h1> */}
            </div>
        }
        {/* {screenNumber == 1 &&
            <div className="advertisement-1">This is screen 1
            <h1 onClick={() => setScreenNumber(0)}>{`<`}</h1>
            <h1 onClick={() => setScreenNumber(2)}>{`>`}</h1>
        </div>
        }
        {screenNumber == 2 &&
            <div className="advertisement-0">This is screen 2
            <h1 onClick={() => setScreenNumber(1)}>{`<`}</h1>
            <h1 onClick={() => setScreenNumber(3)}>{`>`}</h1>
        </div>
        } */}
    </div>
)
}

export default Advertisement