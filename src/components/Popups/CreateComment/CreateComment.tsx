import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

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

// STORES
import { useCreateCommentPopupStore } from "./CreateCommentPopupStore";
import { useTasksStore } from "@/zustand/tasksStore";
import { useTaskDataStore } from "@/zustand/taskDataStore";

// TYPES
import { TaskDataMin } from "@shared/types/TaskData";
import { TypeOfData, TypeOfDataLabels } from "@/types/TypeOfData";
import { EStatus, StatusLabels } from "@/types/Status";

const hours: [label: string, value: number][] = [
	["0h", 0],
	["0.5h", 0.5],
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
	const [text, setText] = useState<string>("");
	const [spentHours, setSpentHours] = useState<number>(0);
	const [status, setStatus] = useState<EStatus>(EStatus.NoStatus);
	const [typeOfComment, setTypeOfComment] = useState<TypeOfData>(
		TypeOfData.Dailies,
	);
	// TASKS STORE
	const { updateTask } = useTasksStore();

	// TASK DATA STORE
	const { task, addData: addTaskData } = useTaskDataStore();

	// CREATE COMMENT POPUP STORE
	const { isOpen, setClose: setPopupClose } = useCreateCommentPopupStore();

	const onDrop = useCallback((acceptedFiles: File[]) => {
		const file = new FileReader();

		file.onload = () => {
			if (acceptedFiles[0].type.startsWith("image"))
				setImagePreview(file.result);
			if (acceptedFiles[0].type.startsWith("video"))
				setVideoPreview(file.result);
		};

		file.readAsDataURL(acceptedFiles[0]);
	}, []);
	const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
		useDropzone({
			onDrop,
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
		setPopupClose();
	};

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();

		if (!task) return;
		const task_id = task.id;

		const taskData: TaskDataMin = {
			type: typeOfComment,
			task_id,
			created_at: formatSQLTimestamp(new Date()),
			created_by: 1,
			status,
			spent_hours: spentHours,
			text,
		};

		const formData = new FormData();

		if (typeof acceptedFiles[0] !== "undefined") {
			formData.append("file", acceptedFiles[0]);
		}

		formData.append("data", JSON.stringify(taskData));

		await api
			.sendComment(formData)
			.then((res) => {
				const { status } = res;
				addTaskData(res);
				const newTask = { ...task, status };
				updateTask(newTask);
				handleClose();
			})
			.catch((err) => console.log(err));
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
		<Dialog open={isOpen} className="create-comment-popup">
			<div className="create-comment-header">
				<DialogTitle>Add new comment</DialogTitle>
				<NativeSelect
					className="create-comment-type"
					value={typeOfComment}
					onChange={(e) => setTypeOfComment(+e.target.value)}
				>
					{typesOfComment.map(([obj, label], i) => {
						return (
							<option key={i} value={obj}>
								{label}
							</option>
						);
					})}
				</NativeSelect>
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
					}}
				/>

				{typeOfComment !== TypeOfData.Status &&
					!imagePreview &&
					!videoPreview && (
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
			</DialogContent>
			<DialogActions>
				{typeOfComment === TypeOfData.Dailies && (
					<NativeSelect
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
