import React, {Component, useState, useEffect} from 'react';
import {set} from "mobx";

const useAudio = url => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () =>{
    setPlaying(!playing);
  };

  useEffect(() =>{
      audio.addEventListener('ended', () => setPlaying(false));
      return() => {
          audio.removeEventListener('ended', () => setPlaying(true));
      }
  }, []);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing]);

  return [playing, setPlaying];
};

const Player = ({ url }) => {
  const [playing, toggle] = useAudio(url);
  return(
    <div>
        <button onClick={toggle}>{playing ? "Pause" : "Play"}</button>
    </div>
  )
};
export default Player;