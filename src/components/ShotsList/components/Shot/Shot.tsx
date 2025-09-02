import { FC } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionActions from "@mui/material/AccordionActions";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";

import Task from "@/components/ShotsList/components/Task/Task";

import { TaskProps } from "@/components/ShotsList/TaskProps.type";

const Shot: FC<TaskProps> = ({ props, orderNum, selected, handleClick }) => {
	const { name, id, ...rest } = props;
	return (
		<Accordion className="shot-accordion">
			<AccordionSummary
				expandIcon={
					<ExpandMoreIcon className="shot-accordion-expand-icon" />
				}
				aria-controls="panel1-content"
			>
				<Typography component="span">{name}</Typography>
			</AccordionSummary>
			<AccordionDetails className="shot-accordion-details">
				<div className="shot-tasks-block">
					<Task
						props={props}
						orderNum={orderNum}
						selected={selected}
						handleClick={handleClick}
					/>
				</div>
			</AccordionDetails>
			<AccordionActions>
				<Button>add new task</Button>
			</AccordionActions>
		</Accordion>
	);
};

export default Shot;
