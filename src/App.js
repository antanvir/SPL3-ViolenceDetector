import logo from './logo.svg';
import './App.css';

import Input from '@material-ui/core/Input';
import FolderIcon from '@material-ui/icons/Folder';
import YouTubeIcon from '@material-ui/icons/YouTube';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import ReactPlayer from 'react-player';
import React, { useState } from 'react';
import captureVideoFrame from "capture-video-frame";


const styles = {
  videoPlayer: { backgroundColor: 'rgb(20, 10, 20)', borderRadius: '5px', display: 'block', 
                margin: '16px auto', padding: '10px 10px', height: '40vh', width: '80vw' },
}

function App() {
  const [filepath, setVideoFileUrl] = useState("");
  const [videoType, setVideoType] = useState("folder");
  const [player, setPlayer] = useState(null);


  const onInputChangeHandler = event => {
    if(videoType == "folder"){
      const { files } = event.target;
      console.log(files[0]);
      
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (event) => {
        // console.log(event.target.result);
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

  const onVideoBeingReadyToPlay = (event) => {
    // When you want to record the image 
    console.log(player.getInternalPlayer());
    const frame = captureVideoFrame(player.getInternalPlayer(), "png");
    console.log(frame);
    // Show the image
    const frameImage = document.getElementById("frame-image");
    frameImage.setAttribute("src", frame.dataUri);
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
        <ReactPlayer 
          id="videoPlayer" 
          style={ styles.videoPlayer } 
          url={ filepath } 
          controls={ true } 
          ref={ player => { setPlayer(player); } }
          config={{ 
            file: { 
              attributes: {
                crossOrigin: 'anonymous'
              }
            }
          }}
          onPlay={ onVideoBeingReadyToPlay }
        />
      </div>
      

      <div>
        <img id="frame-image" value="check" />
      </div>

    </div>
  );
}

export default App;
