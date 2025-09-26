import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

import DropDown from "@/components/DropDown/DropDown";

import { snackBar } from "@/utils/snackBar";
import { api } from "@/utils/Api";
import { formatSQLTimestamp } from "@/utils/formatSQLTimestamp";

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
import { useTasksStore } from "@/zustand/tasksStore";
import { useTaskDataStore } from "@/zustand/taskDataStore";
import { useAuthStore } from "@/zustand/authStore";

// TYPES
import type { TaskDataMin } from "@shared/types/TaskData";
import { TypeOfData, TypeOfDataLabels } from "@/types/TypeOfData";
import { EStatus, StatusLabels } from "@/types/Status";

const hours: [label: string, value: number][] = [
	["0h", 0],
	["0.5h", 0.5],
	["1h", 1],
	["1.5h", 1.5],
	["2h", 2],
	["2.5h", 2.5],
	["3h", 3],
	["3.5h", 3.5],
	["4h", 4],
	["4.5h", 4.5],
	["5h", 5],
	["5.5h", 5.5],
	["6h", 6],
	["6.5h", 6.5],
	["7h", 7],
	["7.5h", 7.5],
	["8h", 8],
];

const CreateComment = () => {
	// AUTH STORE
	const { auth } = useAuthStore();

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

	const handleSubmit = async (e: React.SyntheticEvent) => {
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

		await api
			.sendComment(formData)
			.then((res) => {
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
			.catch((err) => {
				console.log(err);
				snackBar("Something went wrong", "error");
			})
			.finally(() => {
				setLoading(false);
				setFiles([]);
			});
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
				<DropDown<TypeOfData>
					// label="task-status"
					items={TypeOfDataLabels}
					selected={typeOfComment}
					onChange={setTypeOfComment}
				/>
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
				)}
				{imagePreview && (
					<img
						className="create-comment-preview"
						src={imagePreview as string}
					/>
				)}
				{videoPreview && (
					<video src={videoPreview as string} controls />
				)}
				{hideInputArea &&
					!loading && [
						<p>File ready to be uploaded</p>,
						<CheckCircle color="success" fontSize="large" />,
					]}
				{loading && <CircularProgress />}
			</DialogContent>
			<DialogActions>
				{typeOfComment === TypeOfData.Dailies && (
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
