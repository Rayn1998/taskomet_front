import { FC, useState, useEffect } from "react";
import { api } from "@/utils/Api";

// STATES
import { useTaskPopupStore } from "@/zustand/taskPopupStore";
import { useArtistStore } from "@/zustand/artistStore";

// MUI
import DropDown from "@/components/ShotsList/components/DropDown/DropDown";
import Button from "@mui/material/Button";
import ArtistSimpleDialog from "@/components/ShotsList/components/ArtistSimpleDialog/ArtistSimpleDialog";

// TYPES | CONSTANTS
import { TaskProps } from "@/components/ShotsList/TaskProps.type";
import { statuses, priorityStatuses } from "@/utils/constants";
import { EStatus, StatusLabels } from "@/types/Status";
import { EPriority, PriorityLabels } from "@/types/Priority";
import { EArtistRole, ArtistRoleLabels } from "@/types/ArtistRole";

const Task: FC<TaskProps> = ({ props }) => {
	const { name, id, status, executor, priority } = props;

	// ARTIST STORE
	const getArtist = useArtistStore((state) => state.getArtist);
	const artists = useArtistStore((state) => state.artists);

	const setTaskView = useTaskPopupStore((state) => state.setOpenClose);
	const [open, setOpen] = useState<boolean>(false);
	const [selectedExecutorId, setSelectedExecutorId] = useState<number | null>(
		null,
	);
	const [selectedStatus, setSelectedStatus] = useState<number>(0);
	const [selectedPriority, setSelectedPriority] = useState<number>(0);
	const [selectedExecutorName, setSelectedExecutorName] =
		useState<string>("NONE");

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = (artistId: number | null) => {
		setOpen(false);
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

	// !!!!!!!!!!!!!!!!!!!!надо будет запрашивать данные таска при открытии его
	// const handleDoubleClick = () => {
	//     try {
	//         const taskData = await api.getTaskData(id);
	//     } catch (err) {}
	//     setTaskView();
	// }

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

	return (
		<div className="task" onDoubleClick={setTaskView}>
			<div className="task-number">{id}</div>
			<div className="task-name">{name}</div>
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
					open={open}
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
