import { CSSProperties } from "react";

import Task from "@/components/Task/Task";

// MUI
import LinearProgress from "@mui/material/LinearProgress";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";

interface IListItemsBlock<T> {
	selectedEntityId: number | null;
	noEntitySelectedText: string;
	noItemsForSelectedEntityText?: string;
	selectedItemId: number | null;
	handleItemClick: (...any: any) => any;
	itemsArray: [string, T[]][] | null;
	handleDoubleClickNavigateToTask: boolean;
	blockStyle?: CSSProperties;
}

const AccordionItemsBlock = <T,>({
	selectedEntityId,
	noEntitySelectedText,
	noItemsForSelectedEntityText,
	selectedItemId,
	handleItemClick,
	itemsArray,
	handleDoubleClickNavigateToTask,
	blockStyle = {},
}: IListItemsBlock<T>) => {
	return (
		<div className="accordion-items-block" style={blockStyle}>
			<div className="accordion-items-block-list">
				{!selectedEntityId && (
					<p className="empty-declaration">{noEntitySelectedText}</p>
				)}
				{selectedEntityId && !itemsArray && (
					<>
						<LinearProgress style={{ width: "100%" }} />
					</>
				)}
				{selectedEntityId &&
					itemsArray?.map((filteredArray, i) => {
						return (
							<Accordion
								key={i}
								defaultExpanded
								className="accordion-items-block__project-accordion"
							>
								<AccordionSummary
									expandIcon={
										<ExpandMoreIcon className="accordion-items-block__project-accortion-icon" />
									}
								>
									<Typography
										className="accordion-items-block__project-name"
										style={{ fontSize: "1.5rem" }}
									>
										{filteredArray[0] as any}
									</Typography>
								</AccordionSummary>
								<AccordionDetails className="accordion-items-block__project-accortion-details">
									{filteredArray[1].map((item, i) => {
										return (
											<Task
												key={(item as any).id}
												task={item as any}
												orderNum={i}
												selected={Boolean(
													(item as any).id ===
														selectedItemId,
												)}
												handleClick={handleItemClick}
												handleDoubleClickNavigateToTask={
													handleDoubleClickNavigateToTask
												}
											/>
										);
									})}
								</AccordionDetails>
							</Accordion>
						);
					})}
				{selectedEntityId && itemsArray?.length === 0 && (
					<p className="empty-declaration">
						{noItemsForSelectedEntityText}
					</p>
				)}
			</div>
		</div>
	);
};

export default AccordionItemsBlock;
