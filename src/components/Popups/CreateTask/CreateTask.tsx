import { useState, FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { snackBar } from "@/utils/snackBar";

// MUI
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

// STORES
import { useCreateTaskPopupStore } from "./CreateTaskPopupStore";
import { useTasksStore } from "@/zustand/tasksStore";

import { api } from "@/utils/Api";

const CreateTaskPopup = () => {
	const location = useLocation();

	// TASK POPUP STORE
	const { isOpen: isTaskPopupOpen, setClose: setTaskPopupClose } =
		useCreateTaskPopupStore();

	// TASKS STORE
	const addTask = useTasksStore((state) => state.addTask);

	// STATES FOR FORM
	const [name, setName] = useState<string>("");
	const [description, setDescription] = useState<string>("");

	const handleCreateTask = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const [projectName, sceneName] = location.pathname.split("/").slice(-2);
		if (projectName && projectName.length > 0) {
			api.createTask(name, description, projectName, sceneName)
				.then((newTask) => {
					newTask.project_name = projectName;
					newTask.scene_name = sceneName.toUpperCase();
					newTask.spent_hours = 0;
					addTask(newTask);
					setName("");
					setDescription("");
					setTaskPopupClose();
					snackBar("Task was successfully created", "success");
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	const handleClose = () => {
		setTaskPopupClose();
	};
	return (
		<Dialog open={isTaskPopupOpen} onClose={handleClose}>
			<DialogTitle>Create new task</DialogTitle>
			<DialogContent>
				<form
					id="create-task-from"
					onSubmit={handleCreateTask}
					style={{
						display: "flex",
						flexDirection: "column",
						width: "30vw",
						gap: "1rem",
					}}
				>
					<TextField
						label="name"
						value={name}
						onChange={(e) => setName(e.currentTarget.value)}
					/>
					<TextField
						label="description"
						value={description}
						onChange={(e) => setDescription(e.currentTarget.value)}
					/>
				</form>
			</DialogContent>
			<DialogActions>
				<Button type="submit" form="create-task-from">
					Add new task
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CreateTaskPopup;
