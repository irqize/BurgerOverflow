import React, { useEffect } from "react";
import QRCode from "qrcode.react";
import "./SplashScreen.css";
import "./Advertisement.css";
import BurgerBunDown from "./images/burger_bun_down.png";
import BurgerBunUp from "./images/burger_bun_up.png";
import { STAGES } from "./GameContainer";

const URL = "https://" + document.location.hostname + ":3000";

const SplashScreen = ({ socket }) => {
    useEffect(() => {
        socket.emit("game stage", STAGES.START);
        socket.emit("drop");
    }, [socket]);

    return (
        <div className="splashContainer">
            <div className="advertisement-0">
                <p className="advertisement-text-head">
                    Win your lunch <br />
                    on the fly.
                </p>
                <p className="advertisement-text-bod">Just scan it.</p>
            </div>
            <div className="burgerFlex">
                <img id="BurgerBunUp" alt="top bun" src={BurgerBunUp} />
                <QRCode value={URL} renderAs="svg" />
                <img id="BurgerBunDown" alt="bottom bun" src={BurgerBunDown} />
            </div>
        </div>
    );
};

export default SplashScreen;
