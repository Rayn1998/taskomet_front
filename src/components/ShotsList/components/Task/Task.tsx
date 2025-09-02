import { useState, useEffect } from "react";
import { api } from "@/utils/Api";

// STATES
import { useTaskInfoStore } from "@/zustand/taskInfoStore";
import { useArtistStore } from "@/zustand/artistStore";
import { useTaskDataStore } from "@/zustand/taskDataStore";

// MUI
import DropDown from "@/components/ShotsList/components/DropDown/DropDown";
import Button from "@mui/material/Button";
import ArtistSimpleDialog from "@/components/ShotsList/components/ArtistSimpleDialog/ArtistSimpleDialog";

// TYPES | CONSTANTS
import { TaskProps } from "@/components/ShotsList/TaskProps.type";
import { EStatus, StatusLabels } from "@/types/Status";
import { EPriority, PriorityLabels } from "@/types/Priority";

const Task = ({ props, orderNum, selected, handleClick }: TaskProps) => {
	const { name, id, status, executor, priority, scene_name, description } =
		props;

	// ARTIST STORE
	const getArtist = useArtistStore((state) => state.getArtist);
	const artists = useArtistStore((state) => state.artists);
	// TASK DATA STORE
	const setTaskData = useTaskDataStore((state) => state.setData);
	const taskViewOpen = useTaskInfoStore((state) => state.isOpen);
	const setTaskViewOpenClose = useTaskInfoStore(
		(state) => state.setOpenClose,
	);

	const [hover, setHover] = useState<boolean>(false);
	const [artistDialogOpen, setartistDialogOpen] = useState<boolean>(false);
	const [selectedExecutorId, setSelectedExecutorId] = useState<number | null>(
		null,
	);
	const [selectedStatus, setSelectedStatus] = useState<number>(0);
	const [selectedPriority, setSelectedPriority] = useState<number>(0);
	const [selectedExecutorName, setSelectedExecutorName] =
		useState<string>("NONE");

	const handleOpen = () => {
		setartistDialogOpen(true);
	};

	const handleClose = (artistId: number | null) => {
		setartistDialogOpen(false);
		if (artistId === null) return;
		if (typeof artistId === "number" && artistId !== selectedExecutorId) {
			api.updateTaskExecutor(id, artistId)
				.then((id) => {
					setSelectedExecutorId(id);
				})
				.catch((err) => console.log(err));
		}
	};

	const handleChangeStatus = (status: number) => {
		api.updateTaskStatus(id, status)
			.then((newStatus) => {
				setSelectedStatus(newStatus);
			})
			.catch((err) => console.log(err));
	};

	const handleChangePriority = (priority: number) => {
		api.updateTaskPriority(id, priority)
			.then((newPriority) => {
				setSelectedPriority(newPriority);
			})
			.catch((err) => console.log(err));
	};

	const handleDoubleClick = () => {
		if (!taskViewOpen) setTaskViewOpenClose();
	};

	useEffect(() => {
		if (executor) setSelectedExecutorId(executor);
		if (status) setSelectedStatus(status);
		if (priority) setSelectedPriority(priority);
	}, []);

	useEffect(() => {
		if (selectedExecutorId) {
			const artist = getArtist(selectedExecutorId);
			if (artist) setSelectedExecutorName(artist.name);
		}
	}, [selectedExecutorId, artists]);

	useEffect(() => {
		if (taskViewOpen && selected) {
			api.getTaskData(id)
				.then((taskData) => {
					setTaskData(taskData, props);
				})
				.catch((err) => console.log(err));
		}
	}, [taskViewOpen, selected]);

	return (
		<div
			className="task"
			onClick={() => handleClick(name)}
			onDoubleClick={handleDoubleClick}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			style={{
				backgroundColor:
					hover || selected ? "rgb(45, 50, 60)" : "rgb(35, 37, 44)",
			}}
		>
			<div className="task-number">{orderNum + 1}</div>
			<div className="task-name">
				{scene_name}_{name}
			</div>
			<DropDown<EStatus>
				label="task-status"
				items={StatusLabels}
				selected={selectedStatus}
				onChange={handleChangeStatus}
			/>
			<div className="task-artist">
				<Button
					className="task-artist-button"
					variant="contained"
					onClick={handleOpen}
				>
					{selectedExecutorName}
				</Button>
				<ArtistSimpleDialog
					selectedExecutor={selectedExecutorId}
					open={artistDialogOpen}
					onClose={handleClose}
				/>
			</div>
			<DropDown<EPriority>
				label="priority"
				items={PriorityLabels}
				selected={selectedPriority}
				onChange={handleChangePriority}
			/>
		</div>
	);
};

export default Task;
