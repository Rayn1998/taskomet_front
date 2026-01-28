import { useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useDropzone } from "react-dropzone";

// COMPONENTS
import DropDown from "@/components/DropDown/DropDown";

// UTILS
import { snackBar } from "@/utils/snackBar";
import { formatSQLTimestamp } from "@/utils/formatSQLTimestamp";
import { hours } from "@/utils/constants";
import { checkLocation } from "@/utils/checkLocation";

// API
import { projectsApi } from "@/routes/projects.api";
import { scenesApi } from "@/routes/scenes.api";
import { tasksApi } from "@/routes/tasks.api";

// MUI
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Button from "@mui/material/Button";
import NativeSelect from "@mui/material/NativeSelect";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircle from "@mui/icons-material/CheckCircle";

// STORES
import { useCreateCommentPopupStore } from "./CreateCommentPopupStore";
import { useProjectDataStore } from "@/zustand/projectDataStore";
import { useSceneDataStore } from "@/zustand/sceneDataStore";
import { useTasksStore } from "@/zustand/tasksStore";
import { useTaskDataStore } from "@/zustand/taskDataStore";
import { useAuthStore } from "@/zustand/authStore";

// TYPES
import type {
	ProjectDataMin,
	SceneDataMin,
	TaskDataMin,
} from "@shared/types/EntityData";
import { TypeOfData, TypeOfDataLabels } from "@/types/TypeOfData";
import { EStatus, StatusLabels } from "@/types/Status";

const CreateComment = () => {
	const location = useLocation();
	const currentLocation = checkLocation(location);

	// AUTH STORE
	const { auth } = useAuthStore();

	// PROJECT DATA STORE
	const { relatedProject, addProjectData } = useProjectDataStore();

	// SCENE DATA STORE
	const { relatedScene, addSceneData } = useSceneDataStore();

	// TASKS STORE
	const { tasks, updateTask } = useTasksStore();

	// TASK DATA STORE
	const { taskData, addTaskData, relatedTask } = useTaskDataStore();

	// CREATE COMMENT POPUP STORE
	const { isOpen, setClose: setPopupClose } = useCreateCommentPopupStore();

	const [text, setText] = useState<string>("");
	const [spentHours, setSpentHours] = useState<number>(0);
	const [status, setStatus] = useState<EStatus>(EStatus.NoStatus);
	const [typeOfComment, setTypeOfComment] = useState<TypeOfData>(
		TypeOfData.Dailies,
	);
	const [loading, setLoading] = useState<boolean>(false);
	const [hideInputArea, setHideInputArea] = useState<boolean>(false);
	const [files, setFiles] = useState<File[]>([]);

	const onDrop = useCallback((acceptedFiles: File[]) => {
		if (!acceptedFiles || acceptedFiles.length === 0) return;

		const file = acceptedFiles[0];
		setFiles(acceptedFiles);

		const fileReader = new FileReader();
		fileReader.onload = () => {
			setHideInputArea(true);
			if (file.type.startsWith("image"))
				setImagePreview(fileReader.result);
			if (
				file.type.startsWith("video") &&
				file.name.split(".").pop()?.toLowerCase() !== "mov"
			)
				setVideoPreview(fileReader.result);
		};

		fileReader.readAsDataURL(file);
	}, []);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		multiple: false,
	});
	const [videoPreview, setVideoPreview] = useState<
		string | ArrayBuffer | null
	>(null);
	const [imagePreview, setImagePreview] = useState<
		string | ArrayBuffer | null
	>(null);

	const handleClose = () => {
		setImagePreview(null);
		setVideoPreview(null);
		setText("");
		setSpentHours(0);
		setHideInputArea(false);
		setPopupClose();
		setFiles([]);
	};

	const handleProjectDataSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();

		if (!auth || !relatedProject) return;

		const taskDataToBeSent: ProjectDataMin = {
			project_id: relatedProject.id,
			created_at: formatSQLTimestamp(new Date()),
			created_by: auth.id,
			text,
		};

		const formData = new FormData();
		setLoading(true);

		if (typeof files[0] !== "undefined") {
			formData.append("file", files[0]);
		}

		formData.append("data", JSON.stringify(taskDataToBeSent));

		await projectsApi
			.sendMedia(formData)
			.then((res) => {
				addProjectData(res);
				snackBar("Success", "success");
				handleClose();
			})
			.catch((_) => {
				snackBar("Something went wrong", "error");
			})
			.finally(() => {
				setLoading(false);
				setFiles([]);
			});
	};

	const handleSceneDataSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();

		if (!auth || !relatedScene) return;

		const taskDataToBeSent: SceneDataMin = {
			scene_id: relatedScene.id,
			created_at: formatSQLTimestamp(new Date()),
			created_by: auth.id,
			text,
		};

		const formData = new FormData();
		setLoading(true);

		if (typeof files[0] !== "undefined") {
			formData.append("file", files[0]);
		}

		formData.append("data", JSON.stringify(taskDataToBeSent));

		await scenesApi
			.sendMedia(formData)
			.then((res) => {
				addSceneData(res);
				snackBar("Success", "success");
				handleClose();
			})
			.catch((_) => {
				snackBar("Something went wrong", "error");
			})
			.finally(() => {
				setLoading(false);
				setFiles([]);
			});
	};

	const handleTaskDataSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();

		if (!taskData || !relatedTask || !auth) return;
		typeOfComment ===
			(TypeOfData.SettingTheTask ||
				TypeOfData.Comment ||
				TypeOfData.Status) && setSpentHours(0);

		const taskDataToBeSent: TaskDataMin = {
			type: typeOfComment,
			task_id: relatedTask.id,
			created_at: formatSQLTimestamp(new Date()),
			created_by: auth.id,
			status,
			spent_hours: spentHours,
			text,
		};

		const formData = new FormData();
		setLoading(true);

		if (typeof files[0] !== "undefined") {
			formData.append("file", files[0]);
		}

		formData.append("data", JSON.stringify(taskDataToBeSent));

		await tasksApi
			.sendComment(formData)
			.then((res) => {
				console.log(res);
				const { status, spent_hours } = res;
				addTaskData(res);
				const relatedToDataTask = tasks?.find(
					(task) => task.id === relatedTask.id,
				)!;
				const newTask = {
					...relatedToDataTask,
					status,
					spent_hours:
						+relatedToDataTask.spent_hours + Number(spent_hours),
				};
				updateTask(newTask);
				snackBar("Success", "success");
				handleClose();
			})
			.catch((_) => {
				snackBar("Something went wrong", "error");
			})
			.finally(() => {
				setLoading(false);
				setFiles([]);
			});
	};

	const handleSubmit = (e: React.SyntheticEvent) => {
		if (currentLocation.project) handleProjectDataSubmit(e);
		if (currentLocation.scene) handleSceneDataSubmit(e);
		if (currentLocation.task || currentLocation.myTasks)
			handleTaskDataSubmit(e);
	};

	const statuses = [];
	const typesOfComment = [];
	for (const [obj, label] of Object.entries(StatusLabels)) {
		statuses.push([obj, label]);
	}
	for (const [obj, label] of Object.entries(TypeOfDataLabels)) {
		typesOfComment.push([obj, label]);
	}

	return (
		<Dialog
			open={isOpen}
			className="create-comment-popup"
			onKeyUp={(e) => {
				if (e.key === "Escape") setPopupClose();
			}}
			sx={{
				"& .MuiPaper-root": {
					color: "rgb(230, 230, 230)",
					backgroundColor: "rgb(50, 60, 70)",
				},
			}}
		>
			<div className="create-comment-header">
				<DialogTitle>Add new comment</DialogTitle>
				{(currentLocation.task || currentLocation.myTasks) && (
					<DropDown<TypeOfData>
						items={TypeOfDataLabels}
						selected={typeOfComment}
						onChange={setTypeOfComment}
					/>
				)}
			</div>
			<DialogContent
				className="create-comment-content"
				sx={{
					display: "flex",
					flexDirection: "column",
					width: "60rem",
					gap: "1rem",
				}}
			>
				<TextareaAutosize
					value={text}
					onChange={(e) => setText(e.target.value)}
					minRows={10}
					style={{
						minWidth: "100%",
						maxWidth: "100%",
						padding: "0.5rem",
						position: "relative",
						color: "rgb(230,230,230)",
						backgroundColor: "rgb(60,70,90)",
					}}
				/>

				{typeOfComment !== TypeOfData.Status &&
					!imagePreview &&
					!videoPreview &&
					!hideInputArea && (
						<div
							className="create-comment-input-section"
							{...getRootProps()}
							style={{
								backgroundColor: isDragActive
									? "rgba(0,0,0,0.3)"
									: "transparent",
							}}
						>
							<input {...getInputProps()} />
							{isDragActive ? (
								<p>Drop files here ...</p>
							) : (
								<p>
									Drag 'n' drop files here, or click to select
									files
								</p>
							)}
						</div>
					)}
				{(imagePreview || videoPreview) && (
					<div className="preview-wrapper">
						<DeleteIcon
							className="delete-icon"
							sx={{
								width: "3rem",
								height: "3rem",
								color: "rgb(200,0,0)",
								cursor: "pointer",
							}}
							onClick={() => {
								setImagePreview(null);
								setVideoPreview(null);
								setFiles([]);
								setHideInputArea(false);
							}}
						/>
						{imagePreview && (
							<img
								className="create-comment-preview"
								src={imagePreview as string}
							/>
						)}
						{videoPreview && (
							<video
								className="create-comment-preview"
								src={videoPreview as string}
								controls
							/>
						)}
					</div>
				)}
				{hideInputArea &&
					!loading &&
					!imagePreview &&
					videoPreview === null && (
						<p style={{ fontSize: "1.2rem" }}>
							File of this format can't be previewed, but it's
							okay, just send it
						</p>
					)}
				{hideInputArea &&
					!loading && [
						<p
							style={{
								width: "fit-content",
								borderRadius: 0,
								borderBottom: "0.1rem solid green",
							}}
						>
							File ready to be uploaded
						</p>,
						<CheckCircle color="success" fontSize="large" />,
					]}
				{loading && <CircularProgress />}
			</DialogContent>
			<DialogActions>
				{typeOfComment === TypeOfData.Dailies &&
					(currentLocation.task || currentLocation.myTasks) && (
						<NativeSelect
							style={{ color: "rgb(230,230,230)" }}
							value={spentHours}
							onChange={(e) => setSpentHours(+e.target.value)}
						>
							{hours.map(([label, value], i) => {
								return (
									<option key={i} value={value}>
										{label}
									</option>
								);
							})}
						</NativeSelect>
					)}
				{(currentLocation.task || currentLocation.myTasks) && (
					<NativeSelect
						style={{ color: "rgb(230,230,230)" }}
						value={status}
						onChange={(e) => setStatus(+e.target.value)}
					>
						{statuses.map(([statusNum, label], i) => {
							return (
								<option key={i} value={statusNum}>
									{label}
								</option>
							);
						})}
					</NativeSelect>
				)}
				<Button
					onClick={handleSubmit}
					variant="contained"
					color="success"
				>
					send
				</Button>
				<Button variant="contained" color="error" onClick={handleClose}>
					cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CreateComment;
