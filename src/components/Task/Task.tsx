import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { snackBar } from "@/utils/snackBar";
import { api } from "@/utils/Api";
import { formatSQLTimestamp } from "@/utils/formatSQLTimestamp";

// STORES
import { useScenesStore } from "@/zustand/scenesStore";
import { useTaskInfoStore } from "@/zustand/taskInfoStore";
import { useArtistStore } from "@/zustand/artistStore";
import { useTaskDataStore } from "@/zustand/taskDataStore";
import { useTasksStore } from "@/zustand/tasksStore";
import { useAuthStore } from "@/zustand/authStore";
import { useTaskRedirectStore } from "@/zustand/taskRedirectStore";

// MUI
import DropDown from "@/components/DropDown/DropDown";
import ArtistSimpleDialog from "@/components/ArtistSimpleDialog/ArtistSimpleDialog";

// TYPES | CONSTANTS
import type ITask from "@shared/types/Task";
import type { TaskProps } from "@/components/ShotsList/TaskProps.type";
import { EStatus, StatusLabels, StatusColors } from "@/types/Status";
import { EPriority, PriorityLabels, PriorityColors } from "@/types/Priority";
import { TypeOfData } from "@/types/TypeOfData";
import type { TaskDataMin } from "@shared/types/EntityData";

const Task = ({
	task,
	orderNum,
	selected,
	handleClick,
	handleDoubleClickNavigateToTask,
}: TaskProps) => {
	const {
		name,
		id,
		status,
		executor,
		priority,
		project_name,
		scene_name,
		description,
		spent_hours,
	} = task;

	const location = useLocation();
	const navigate = useNavigate();

	// AUTH STORE
	const { auth } = useAuthStore();

	// ARTIST STORE
	const { getArtist, artists } = useArtistStore();

	// TASKS STORE
	const { updateTask } = useTasksStore();

	// SCENES STORE
	const { resetLastProject } = useScenesStore();

	// TASK REDIRECT STORE
	const { redirectedTaskId, setRedirectedTaskId } = useTaskRedirectStore();

	// TASK DATA STORE
	const { taskData, relatedTask, setTaskData, addTaskData } =
		useTaskDataStore();
	const { isOpen: taskInfoOpen, setOpenClose: setTaskViewOpenClose } =
		useTaskInfoStore();

	const [hover, setHover] = useState<boolean>(false);
	const [artistDialogOpen, setartistDialogOpen] = useState<boolean>(false);
	const [spentHours, setSpentHours] = useState<number>(0);

	useEffect(() => {
		if (spent_hours === 0 || spent_hours === null) {
			setSpentHours(0);
		} else {
			setSpentHours(+spent_hours);
		}
	}, [spent_hours]);

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
			created_by: auth!.id,
			status,
			spent_hours: null,
		};
		api.updateTaskStatus(taskData)
			.then((res) => {
				const { status } = res;
				const updatedTask: ITask = { ...task, status };
				updateTask(updatedTask);
				addTaskData(res);
				resetLastProject(); // для того чтобы прогрессбар на странице сцен обновился
				snackBar("Status was changed", "success");
			})
			.catch((err) => console.log(err));
	};

	const handleChangePriority = (priority: number) => {
		api.updateTaskPriority(id, priority)
			.then((newPriority) => {
				const updatedTask: ITask = { ...task, priority: newPriority };
				updateTask(updatedTask);
				resetLastProject(); // для того чтобы прогрессбар на странице сцен обновился
				snackBar("Priority was changed", "success");
			})
			.catch((err) => console.log(err));
	};

	const handleDoubleClick = () => {
		if (handleDoubleClickNavigateToTask) {
			setRedirectedTaskId(id);
			return navigate(
				`/projects/${project_name.toLowerCase()}/${scene_name.toLowerCase()}`,
			);
		}
		if (
			location.pathname.split("/").slice(1)[0] !== "artists-loading" &&
			!taskInfoOpen
		) {
			setTaskViewOpenClose(true);
			handleClick(id);
		}
	};

	const artistName = useMemo(() => {
		if (executor && artists) {
			const artist = getArtist(executor);
			return artist ? artist.name : "NONE";
		}
		return "NONE";
	}, [executor, artists]);

	const lighten = useCallback((color: string) => {
		if (!color) return;
		let match = color.match(/\d+/g);
		if (!match) return color;

		const [r, g, b] = match.map((color) => Number(color) * 1.2);

		return `rgb(${r}, ${g}, ${b})`;
	}, []);

	useEffect(() => {
		if (!selected || !taskInfoOpen) return;
		if (relatedTask?.id === id && taskData) return;

		api.getTaskData(id)
			.then((newTaskData) => {
				setTaskData(newTaskData, task);
			})
			.catch(console.log);
	}, [selected, taskInfoOpen, id]);

	useEffect(() => {
		if (!redirectedTaskId) return;
		if (redirectedTaskId !== id) return; // !!!!!!!!!!!

		api.getTaskData(redirectedTaskId)
			.then((newTaskData) => {
				setRedirectedTaskId(null);
				setTaskViewOpenClose(true);
				setTaskData(newTaskData, task);
			})
			.catch(console.log);
	}, [redirectedTaskId]);

	return (
		<div
			data-type="task"
			className="task"
			onContextMenu={() => {
				handleClick(id);
				setTaskData(taskData, task);
			}}
			onClick={() => taskInfoOpen && handleClick(id)}
			onDoubleClick={handleDoubleClick}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			style={{
				background:
					hover || selected
						? `linear-gradient(90deg, ${lighten(
								StatusColors[status as EStatus],
						  )} 0%, rgba(0, 0, 0, 0) 70%, ${lighten(
								PriorityColors[priority as EPriority],
						  )}`
						: `linear-gradient(90deg, ${
								StatusColors[status as EStatus]
						  } 0%, rgba(0, 0, 0, 0) 70%, ${
								PriorityColors[priority as EPriority]
						  }`,
			}}
		>
			<div className="task-number">{orderNum + 1}</div>
			<div className="task-name">
				{scene_name}_{name}
			</div>
			<DropDown<EStatus>
				items={StatusLabels}
				selected={status}
				onChange={handleChangeStatus}
			/>
			<div className="task-artist">
				<button className="task-artist-button" onClick={handleOpen}>
					<span className="task-artist-button-transition"></span>
					<span className="task-artist-button-label">
						{artistName}
					</span>
				</button>
				<ArtistSimpleDialog
					selectedExecutor={executor}
					open={artistDialogOpen}
					onClose={handleClose}
				/>
			</div>
			<p className="task-spent-hours">{spentHours}</p>
			<DropDown<EPriority>
				// label="priority"
				items={PriorityLabels}
				selected={priority}
				onChange={handleChangePriority}
			/>
		</div>
	);
};

export default Task;
