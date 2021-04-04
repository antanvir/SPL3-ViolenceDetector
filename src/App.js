import './App.css';
import ResultProvider from './Result';
import styles from './customStyling';

import Input from '@material-ui/core/Input';
import FolderIcon from '@material-ui/icons/Folder';
import YouTubeIcon from '@material-ui/icons/YouTube';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';


import axios from 'axios';
import ThreeDots from 'three-dots';
import ReactPlayer from 'react-player';
import React, { useState, useRef  } from 'react';



function App() {
	const [filepath, setVideoFileUrl] = useState("");
	const [videoType, setVideoType] = useState("folderFile");
	const [inputStyles, setInputStyles] = useState(
		{
			youtubeIconColor: "",
			folderIconColor: "primary",
			inputType: "file",
			inputPlaceHolder: "",
		}
		);
	const [resultStatus, setResultStatus] = useState("");
	const [timeOfViolence, setTimeOfViolence] = useState([]);
	const [videoPlaying, setvideoPlaying] = useState(true);

	// const restrictVideoPlaying = () => {
	// 	setvideoPlaying(false);
	// }
	const startVideoPlaying = () => {
		setvideoPlaying(true);
	}

	const onInputChangeHandler = event => {
		setvideoPlaying(true);
		if(videoType == "folderFile"){
			const { files } = event.target;
			// console.log(files[0]);

			let reader = new FileReader();
			reader.readAsDataURL(files[0]);
			reader.onload = (event) => {
				// console.log(event.target.result);
				setVideoFileUrl(event.target.result);
				setResultStatus("processing");
				setTimeOfViolence([]);

				let form_data = new FormData();
				form_data.append("videoType", videoType);
				form_data.append("videoPath", "");
				form_data.append("hasVideo", true);
				form_data.append("file", files[0]);

				axios.post('http://127.0.0.1:5000/video', form_data, {
					headers: {
						'Content-Type': 'multipart/form-data',
					}
				})
				.then((response) => {
					console.log(response.data);
					let result = response.data;
					setResultStatus(result.type);
					setTimeOfViolence(result.timestamps);
					if(result.type === "violent")	setvideoPlaying(false);
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
				setResultStatus("processing");
				setTimeOfViolence([]);

				let form_data = new FormData();
				form_data.append("videoType", videoType);
				form_data.append("videoPath", event.target.value);
				form_data.append("hasVideo", false);				

				axios.post('http://127.0.0.1:5000/video', form_data, {
					headers: {
						'Content-Type': 'multipart/form-data',
					}
				})
				.then((response) => {
					console.log(response.data);
					let result = response.data;
					setResultStatus(result.type);
					setTimeOfViolence(result.timestamps);
					if(result.type === "violent")	setvideoPlaying(false);
				})
				.catch((error) => {
					console.log(error);
				});
			}
		}
		
	}

	const handleVideoTypeChange = (event, currentVideoType) => {
		let inputStyles = {};
		inputStyles["youtubeIconColor"] = (currentVideoType == "youtubeFile") ?"primary" :"";
		inputStyles["folderIconColor"] = (currentVideoType == "folderFile") ?"primary" :"";
		inputStyles["inputType"] = (currentVideoType == "youtubeFile") ?"text" :"file";
		inputStyles["inputPlaceHolder"] = (currentVideoType == "youtubeFile") ?"Paste youtube video url" :"";

		setInputStyles(inputStyles);
		setVideoType(currentVideoType);
	}



	return (
		<div className="App">
		<div id="navbar" style={ {backgroundColor: 'rgb(239, 241, 241)'} }>
			<header className="App-header">
				{/* <img src={logo} className="App-logo" alt="logo" />  */}
				<b> ViolenceDetector </b> 
			</header>
			<hr/>
		</div>

		<div style={ {flexDirection: 'row', paddingTop: '10px'} }>
			<b style={ {color: 'rgb(10, 20, 30)', paddingRight: '0.5em'} }> Paste Video URL From </b>

			<ToggleButtonGroup size="small" value={videoType} exclusive onChange={handleVideoTypeChange} style={ {paddingRight: '0.6em'} }>
			<ToggleButton value="folderFile">
				<FolderIcon id="folder" fontSize="small" color={ inputStyles.folderIconColor }/>
			</ToggleButton>
			<ToggleButton value="youtubeFile">
				<YouTubeIcon id="youtube" fontSize="small" color={ inputStyles.youtubeIconColor } hover="Youtube"/>
			</ToggleButton>
			</ToggleButtonGroup>

			<Input id="standard-basic" type={ inputStyles.inputType } name="videoFile" 
			color="primary" placeholder={ inputStyles.inputPlaceHolder }
			onChange={onInputChangeHandler} />
		</div>
		{(videoPlaying == true ) && (
			<div>
				<ReactPlayer 
				id="videoPlayer" 
				height= '45vh'
				width= '92vh'
				style={ styles.videoPlayer } 
				url={ filepath } 
				controls={ true } 
				playing={ videoPlaying }
				/>
			</div>
		)}
		{(videoPlaying == false ) && (
			<div style={ { backgroundColor: 'rgb(20, 10, 20)', borderRadius: '5px', display: 'block', 
				margin: '15px auto', padding: '10px 10px', height: '40vh', width: '80vh' } }>
				<p style={ {color: "white", paddingTop: "1vh"} }>
					 {/* This video has been detected as violent. <br/> 
					 Hence, automatic playing is stopped. */}
					 Automatic playing is STOPPED as <br/>
					 the video has been detected as VIOLENT.
				</p>
				<button onClick={ startVideoPlaying }> I Understand & Wish to Proceed </button>
			</div>
		)}
		{(resultStatus === "processing") && (
				<div style={ styles.statusProcessing }>
					<h3 style={ {color: "lightslategrey", display: ""} }> Processing Video... </h3>
					<p centre className="dot-pulse" style={ { textAlign: "center", margin: "05px auto"} } ></p>
					
				</div>
		)}
		{(resultStatus === "non-violent") && (
				<div style={ styles.resultNonViolent }>
					<h3 style={ {color: "green"} }> NO VIOLENCE DETECTED </h3>
				</div>
		)}
		{(resultStatus === "violent") && (
				<div style={ styles.resultViolent }>
					<h3 style={ {color: "red"} }> VIOLENCE DETECTED </h3>
				</div>
		)}

		{ (timeOfViolence.length !== 0) && < ResultProvider timeOfViolence= {timeOfViolence} /> }
		
		{/*  EXTRA BUTTON FOR TESTING PURPOSE ONLY */}
		{/* <div> 
			<button onClick={ restrictVideoPlaying }> hide video </button>
		</div> */}

		<div>
			<br/> <br/>
		</div>
		<footer style={ {backgroundColor: 'rgb(235, 241, 241)', bottom: '10px', position: "relative"} }>
			<center><small> <span> &copy; </span> <i><b> A. N. Tanvir | SPL - 03 | 2020 - 21 </b></i> </small></center>
		</footer>

		</div>
	);
}

export default App;
