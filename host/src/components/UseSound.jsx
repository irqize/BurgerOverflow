import React, { useState, useEffect } from "react";
import useSound from "use-sound";
import toneD from "../sounds/toned.mp3";
import sweep from "../sounds/sweep.mp3";
import melody from "../sounds/melody_looped.mp3";
import kitchen from "../sounds/kitchen.mp3";

const translatePath = (song) => {
    var path = "";
    switch (song) {
        case "d-Tone":
            path = toneD;
            break;
        case "sweep":
            path = sweep;
            break;
        case "melody":
            path = melody;
            break;
        case "kitchen":
            path = kitchen;
            break;
        default:
            path = toneD;
    }
    console.log("translatedPath:", path);
    return path;
};
const UseSound = ({
    isPlaying,
    stopNow,
    volume,
    playbackRate,
    sound,
    loop,
}) => {
    //isPlaying starts the soundtrack, volume (0-1), playbackRate changes pitch (0.5-4), sound refers to the sound source and its path, loop is whether to loop the soundtrack or not
    // console.log("playNow_>",isPlaying)
    // console.log("sound>",sound)
    // const [isPlaying, setIsPlaying] = useState(false);

    // const [playbackRate, setPlaybackRate] = useState(0.75);

    //    console.log("songPath:",songPath)

    useEffect(() => {
        if (translatePath(sound) !== undefined) {
            setSongPath(translatePath(sound));
        }
    }, [sound]);
    const [songPath, setSongPath] = useState(translatePath(sound));

    // const [play] = useSound("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", {
    const [play, { stop }] = useSound(songPath, {
        // const [play] = useSound(impact, {
        // playbackRate,
        loop: loop ? loop : false,
        playbackRate: playbackRate ? playbackRate : 0.75,
        volume: volume ? volume : 0.7,
        soundEnabled: true,
    });

    // useEffect(()=>{
    //     //starts when rendered
    //     // console.log("useeffect playNow:",playNow)

    //         setTimeout(() => {
    //             // handleClick()
    //             play();
    //             // console.log("timeout")

    //         }, 50)
    //         // return(play())

    // },[play])

    // useEffect(()=>{
    //     // console.log("useeffect stopNow:",stopNow)
    //     // console.log("useeffect isPlaying:",isPlaying)

    //            stop()

    // },[isPlaying])

    useEffect(() => {
        isPlaying ? play() : stop();
    }, [isPlaying, play, stop]);

    return <></>;
};
export default UseSound;
