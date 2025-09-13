import { useState, useEffect, useMemo } from "react";

import { snackBar } from "@/utils/snackBar";
import { api } from "@/utils/Api";
import { formatSQLTimestamp } from "@/utils/formatSQLTimestamp";

// STORES
import { useTaskInfoStore } from "@/zustand/taskInfoStore";
import { useArtistStore } from "@/zustand/artistStore";
import { useTaskDataStore } from "@/zustand/taskDataStore";
import { useTasksStore } from "@/zustand/tasksStore";

// MUI
import DropDown from "@/components/ShotsList/components/DropDown/DropDown";
import Button from "@mui/material/Button";
import ArtistSimpleDialog from "@/components/ShotsList/components/ArtistSimpleDialog/ArtistSimpleDialog";

// TYPES | CONSTANTS
import ITask from "@shared/types/Task";
import { TaskProps } from "@/components/ShotsList/TaskProps.type";
import { EStatus, StatusLabels } from "@/types/Status";
import { EPriority, PriorityLabels } from "@/types/Priority";
import { TypeOfData } from "@/types/TypeOfData";
import { TaskDataMin } from "@shared/types/TaskData";

const Task = ({ task, orderNum, selected, handleClick }: TaskProps) => {
	const { name, id, status, executor, priority, scene_name, description } =
		task;

	// ARTIST STORE
	const { getArtist, artists } = useArtistStore();

	// TASKS STORE
	const { updateTask } = useTasksStore();

	// TASK DATA STORE
	const {
		setData: setTaskData,
		setTask,
		addData: addTaskData,
	} = useTaskDataStore();
	const { isOpen: taskViewOpen, setOpenClose: setTaskViewOpenClose } =
		useTaskInfoStore();

	const [hover, setHover] = useState<boolean>(false);
	const [artistDialogOpen, setartistDialogOpen] = useState<boolean>(false);

	const handleOpen = () => {
		setartistDialogOpen(true);
	};

	const handleClose = (artistId: number | null) => {
		setartistDialogOpen(false);
		if (artistId !== executor) {
			api.updateTaskExecutor(id, artistId)
				.then((id) => {
					const updatedTask: ITask = { ...task, executor: id };
					updateTask(updatedTask);
					snackBar("Executor was changed", "success");
				})
				.catch((err) => console.log(err));
		}
	};

	const handleChangeStatus = (status: number) => {
		const taskData: TaskDataMin = {
			type: TypeOfData.Status,
			task_id: id,
			created_at: formatSQLTimestamp(new Date()),
			created_by: 1,
			status,
			spent_hours: 0,
		};
		api.updateTaskStatus(taskData)
			.then((res) => {
				const { status } = res;
				const updatedTask: ITask = { ...task, status };
				updateTask(updatedTask);
				addTaskData(res);
				snackBar("Status was changed", "success");
			})
			.catch((err) => console.log(err));
	};

	const handleChangePriority = (priority: number) => {
		api.updateTaskPriority(id, priority)
			.then((newPriority) => {
				const updatedTask: ITask = { ...task, priority: newPriority };
				updateTask(updatedTask);
				snackBar("Priority was changed", "success");
			})
			.catch((err) => console.log(err));
	};

	const handleDoubleClick = () => {
		if (!taskViewOpen) setTaskViewOpenClose();
	};

	const artistName = useMemo(() => {
		if (executor && artists) {
			const artist = getArtist(executor);
			return artist ? artist.name : "NONE";
		}
		return "NONE";
	}, [executor, artists]);

	useEffect(() => {
		if (taskViewOpen && selected) {
			api.getTaskData(id)
				.then((taskData) => {
					setTaskData(taskData, task);
				})
				.catch((err) => console.log(err));
		}
	}, [taskViewOpen, selected]);

	return (
		<div
			data-type="task"
			className="task"
			onContextMenu={() => {
				handleClick(name);
				setTask(task);
			}}
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
				selected={status}
				onChange={handleChangeStatus}
			/>
			<div className="task-artist">
				<Button
					className="task-artist-button"
					variant="contained"
					onClick={handleOpen}
				>
					{artistName}
				</Button>
				<ArtistSimpleDialog
					selectedExecutor={executor}
					open={artistDialogOpen}
					onClose={handleClose}
				/>
			</div>
			<DropDown<EPriority>
				label="priority"
				items={PriorityLabels}
				selected={priority}
				onChange={handleChangePriority}
			/>
		</div>
	);
};

export default Task;
