import Accordion from '@material-ui/core/Accordion';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';


export default function ResultProvider({timeOfViolence}){
    const styles = {
        timeStamps: { backgroundColor: 'dimgray', color: 'white', borderRadius: '5px', border: '1px solid lightslategrey',  
                  margin: '15px auto', padding: '05px 0px', width: '35vw'},
    }
    return(
        <div>
			<Accordion style={ styles.timeStamps }>
				<AccordionSummary expandIcon={<ExpandMoreIcon style={ {color: "white"} } />} >
					<Typography> Timestamps of Detected Violence(s) </Typography>
				</AccordionSummary>
				<AccordionDetails style={ {backgroundColor: '', display: 'block'} }>
					<hr/>
					<Typography>
						<p style={ {display: 'flex'} }> <b> Between Minutes: </b></p>
						{ timeOfViolence.map( time => {
                                return (
                                    <p style={ {display: 'flex'} }> - { time } and { time + 1 } </p>
                                );
						    })
						}
					</Typography>
				</AccordionDetails>
			</Accordion>
		</div>
    );
}