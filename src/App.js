import logo from './logo.svg';
import './App.css';

import Input from '@material-ui/core/Input';
import FolderIcon from '@material-ui/icons/Folder';
import Accordion from '@material-ui/core/Accordion';
import YouTubeIcon from '@material-ui/icons/YouTube';
import Typography from '@material-ui/core/Typography';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import axios from 'axios';
import ReactPlayer from 'react-player';
import React, { useState } from 'react';

let minutes = [ 0, 1 ];
let borderColor = "lightslategrey";
const styles = {
  	videoPlayer: { backgroundColor: 'rgb(20, 10, 20)', borderRadius: '5px', display: 'block', 
                margin: '15px auto', padding: '10px 10px', height: '20vh', width: '80vw' },
	result: { backgroundColor: 'white', borderRadius: '5px', border: `1px solid ${borderColor}`, display: 'inline-block', 
                margin: '15px auto', padding: '05px 0px', width: '35vw'},
	timeStamps: { backgroundColor: 'dimgray', color: 'white', borderRadius: '5px', border: '1px solid lightslategrey',  
                margin: '15px auto', padding: '05px 0px', width: '35vw'},
}

function App() {
	const [filepath, setVideoFileUrl] = useState("");
	const [videoType, setVideoType] = useState("folderFile");
	// const [player, setPlayer] = useState(null);
	const [inputStyles, setInputStyles] = useState(
		{
			youtubeIconColor: "",
			folderIconColor: "primary",
			inputType: "file",
			inputPlaceHolder: "",
		}
	);
	const [result, setResult] = useState("processing");

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
		<div>
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" /> 
				<b> ViolenceDetector </b>   
			</header>
			<hr/>
		</div>

		<div style={ {flexDirection: 'row', paddingTop: '10px'} }>
			<b style={ {color: 'rgb(60, 70, 80)', paddingRight: '0.5em'} }>Paste Video URL From </b>

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

		<div>
			<ReactPlayer 
			id="videoPlayer" 
			style={ styles.videoPlayer } 
			url={ filepath } 
			controls={ true } 
			/>
		</div>
		{ (result === "processing") && (
				<div style={ styles.result }>
					<h3 style={ {color: "lightslategrey"} }> Processing Video... </h3>
				</div>
			)
		}
		{ (result === "non-violent") && (
				<div style={ styles.result }>
					<h3 style={ {color: borderColor} }> NOT VIOLENT </h3>
				</div>
			)
		}
		{ (result === "violent") && (
				<div style={ styles.result }>
					<h3 style={ {color: borderColor} }> VIOLENT </h3>
				</div>
			)
		}

		<div>
			<Accordion style={ styles.timeStamps }>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon style={ {color: "white"} } />}
				>
					<Typography> Timestamps of Detected Violence(s) </Typography>
				</AccordionSummary>
				<AccordionDetails style={ {backgroundColor: '', display: 'block'} }>
					<hr/>
					<Typography>
						<p style={ {display: 'flex'} }> <b> Between Minutes: </b></p>
						{ minutes.map( time => {
							return (
								<p style={ {display: 'flex'} }> { time } and { time + 1 } </p>
							);
							})
						}
						{/* Minute: 0-1
						Minute: 2-3 */}
					</Typography>
				</AccordionDetails>
			</Accordion>
		</div>

		</div>
	);
}

export default App;
