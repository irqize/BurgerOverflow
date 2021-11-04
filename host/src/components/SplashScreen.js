import React, { useEffect } from "react";
import QRCode from "qrcode.react";
import "./SplashScreen.css";
import "./Advertisement.css";
import BurgerBunDown from "./images/burger_bun_down.png";
import BurgerBunUp from "./images/burger_bun_up.png";
import { STAGES } from "./GameContainer";
import BurgerLogo from "./images/burgerLogo.JPG";
import Burger from "./images/Burger.png";

const URL = "https://" + document.location.hostname + ":3000";

const SplashScreen = ({ socket }) => {
    useEffect(() => {
        socket.emit("game stage", STAGES.START);
        socket.emit("drop");
    }, [socket]);

    return (
        <div className="App">
            <div id="section-1" className="section-1">
                <p>
                    <span>
                        <img className="logoImg2" src={BurgerLogo} />
                        <h1 className="section__title"> &nbsp;&nbsp; Burger Overflow</h1>
                    </span>
                </p>
            </div>
            <div className="custom-shape-divider-top-1635227694">
                <svg
                    data-name="Layer 1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                        className="shape-fill"
                    ></path>
                </svg>
            </div>
            <div className="section-p">
                <span>
                    <img className="burgerImage" src={Burger} />
                </span>
                <h1 className="section__title">Win your lunch with just a scan! &nbsp;&nbsp; </h1>
                <span>
                    <QRCode value={URL} renderAs="svg" />
                </span>
            </div>
        </div>
    );
};

export default SplashScreen;
