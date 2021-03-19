import logo from './logo.svg';
import './App.css';

import Input from '@material-ui/core/Input';
import FolderIcon from '@material-ui/icons/Folder';
import YouTubeIcon from '@material-ui/icons/YouTube';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import axios from 'axios';
import ReactPlayer from 'react-player';
import React, { useState } from 'react';


const styles = {
  videoPlayer: { backgroundColor: 'rgb(20, 10, 20)', borderRadius: '5px', display: 'block', 
                margin: '16px auto', padding: '10px 10px', height: '40vh', width: '80vw' },
}

function App() {
	const [filepath, setVideoFileUrl] = useState("");
	const [videoType, setVideoType] = useState("folderFile");
	const [player, setPlayer] = useState(null);


	const onInputChangeHandler = event => {
		if(videoType == "folderFile"){
			const { files } = event.target;
			console.log(files[0]);

			let reader = new FileReader();
			reader.readAsDataURL(files[0]);
			reader.onload = (event) => {
				// console.log(event.target.result);
				setVideoFileUrl(event.target.result);

				let form_data = new FormData();
				form_data.append("videoType", videoType);
				form_data.append("videoPath", "");
				form_data.append("hasVideo", true);
				form_data.append("file", files[0]);

				axios.post('http://localhost:5000/video', form_data, {
					headers: {
						'Content-Type': 'multipart/form-data',
					}
				})
				.then((response) => {
					console.log(response);
				})
				.catch((error) => {
					console.log(error);
				});
			}
		}
		else{
			// console.log(ReactPlayer.canPlay(event.target.value));
			let videoPlayable = ReactPlayer.canPlay(event.target.value);
			if (videoPlayable) {   
				setVideoFileUrl(event.target.value);

				let form_data = new FormData();
				form_data.append("videoType", videoType);
				form_data.append("videoPath", event.target.value);
				form_data.append("hasVideo", false);				

				axios.post('http://localhost:5000/video', form_data, {
					headers: {
						'Content-Type': 'multipart/form-data',
					}
				})
				.then((response) => {
					console.log(response);
				})
				.catch((error) => {
					console.log(error);
				});
			}
		}
		
	}

	const handleVideoTypeChange = (event, currentVideoType) => {
		if(currentVideoType == "youtubeFile"){
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
			<ToggleButton value="folderFile">
				<FolderIcon id="folder" fontSize="small" color="primary"/>
			</ToggleButton>
			<ToggleButton value="youtubeFile">
				<YouTubeIcon id="youtube" fontSize="small" color="action" hover="Youtube"/>
			</ToggleButton>
			</ToggleButtonGroup>

			<Input id="standard-basic" type="file" name="videoFile" color="primary" onChange={onInputChangeHandler} />
		</div>

		<div>
			<ReactPlayer 
			id="videoPlayer" 
			style={ styles.videoPlayer } 
			url={ filepath } 
			controls={ true } 
			/>
		</div>
		

		<div>
			<img id="frame-image" value="check" />
		</div>

		</div>
	);
}

export default App;
