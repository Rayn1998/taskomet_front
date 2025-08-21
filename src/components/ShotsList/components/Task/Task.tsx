import { FC, useState, useEffect } from "react";

// STATES
import { useTaskPopupStore } from "@/zustand/taskPopupStore";
import { useArtistStore } from "@/zustand/artistStore";

// MUI
import DropDown from "@/components/ShotsList/components/DropDown/DropDown";
import Button from "@mui/material/Button";
import SimpleDialog from "@/components/ShotsList/components/SimpleDialog/SimpleDialog";

// TYPES | CONSTANTS
import { TaskProps } from "@/components/ShotsList/TaskProps.type";
import { statuses, priorityStatuses } from "@/utils/constants";
import { ArtistRole, ArtistRoleLabel } from "@/types/ArtistRole";

const Task: FC<TaskProps> = ({ props }) => {
	const { name, id, status, executor, priority } = props;

	// ARTIST STORE
	const getArtist = useArtistStore((state) => state.getArtist);

	const setTaskView = useTaskPopupStore((state) => state.setOpenClose);
	const [open, setOpen] = useState<boolean>(false);
	const [selectedExecutor, setSelectedExecutor] = useState<string>("ARTIST");

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = (value: string | null) => {
		setOpen(false);
		if (value === null) {
			setSelectedExecutor("ARTIST");
			return;
		}
		setSelectedExecutor(value);
	};

	// const handleDoubleClick = () => {
	//     try {
	//         const taskData = await api.getTaskData(id);
	//     } catch (err) {}
	//     setTaskView();
	// }

	useEffect(() => {
		if (executor) {
			const artist = getArtist(executor);
			if (artist) setSelectedExecutor(artist.name);
		}
	}, []);

	return (
		<div className="task" onDoubleClick={setTaskView}>
			<div className="task-number">{id}</div>
			<div className="task-name">{name}</div>
			<DropDown label="task-status" items={statuses} selected={status} />
			<div className="task-artist">
				<Button
					className="task-artist-button"
					variant="contained"
					onClick={handleOpen}
				>
					{selectedExecutor}
				</Button>
				<SimpleDialog
					selectedExecutor={selectedExecutor}
					open={open}
					onClose={handleClose}
				/>
			</div>
			<DropDown
				label="priority"
				items={priorityStatuses}
				selected={priority}
			/>
		</div>
	);
};

export default Task;
