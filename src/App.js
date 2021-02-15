import logo from './logo.svg';
import './App.css';

import React, { useState, useEffect } from 'react';
import YouTubeIcon from '@material-ui/icons/YouTube';
import FolderIcon from '@material-ui/icons/Folder';
import Input from '@material-ui/core/Input';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ReactPlayer from 'react-player';


function App() {
  const [filepath, setVideoFileUrl] = useState("");
  const [videoType, setVideoType] = useState("folder");

  const onInputChangeHandler = event => {
    if(videoType == "folder"){
      const { files } = event.target;
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);
  
      reader.onload = (event) => {
        setVideoFileUrl(event.target.result);
      }
    }else{
      // console.log(ReactPlayer.canPlay(event.target.value));
      let videoPlayable = ReactPlayer.canPlay(event.target.value);
      if (videoPlayable) {   
        setVideoFileUrl(event.target.value);
      }
    }
  }

  const handleVideoTypeChange = (event, currentVideoType) => {
    if(currentVideoType == "youtube"){
      document.getElementById("youtube").style.color = "blue";
      document.getElementById("folder").style.color = "gray";
      document.getElementById("standard-basic").type = "text";
      document.getElementById("standard-basic").placeholder = "Paste youtube video url";
    }else{
      document.getElementById("folder").style.color = "blue";
      document.getElementById("youtube").style.color = "gray";
      document.getElementById("standard-basic").type = "file";
    }
    setVideoType(currentVideoType);
  }

  const styles = {
    videoPlayer: { backgroundColor: 'rgb(20, 10, 20)', borderRadius: '5px', display: 'block', 
            margin: '16px auto', padding: '10px 10px', height: '40vh', width: '80vw' },
}

  return (
    <div className="App">
      <div>
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" /> 
            <b> ViolenceDetector </b>   
        </header>
        <hr/>
      </div>

      <div style={ {flexDirection: 'row'} }>
        <b style={ {color: 'rgb(60, 70, 80)', paddingRight: '0.5em'} }>Paste Video URL From </b>

        <ToggleButtonGroup size="small" value={videoType} exclusive onChange={handleVideoTypeChange} style={ {paddingRight: '0.6em'} }>
          <ToggleButton value="folder">
            <FolderIcon id="folder" fontSize="small" color="primary"/>
          </ToggleButton>
          <ToggleButton value="youtube">
            <YouTubeIcon id="youtube" fontSize="small" color="action" hover="Youtube"/>
          </ToggleButton>
        </ToggleButtonGroup>

        <Input id="standard-basic" type="file" name="video" color="primary" onChange={onInputChangeHandler} />
      </div>

      <div>
        <ReactPlayer style={ styles.videoPlayer } url={ filepath } controls={true} />
      </div>

    </div>
  );
}

export default App;
