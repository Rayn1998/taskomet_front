import { useState } from "react";
import { useLocation } from "react-router-dom";

// MUI
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

// STORES
import { useTaskPopupStore } from "@/zustand/taskPopupStore";
import { useTasksStore } from "@/zustand/tasksStore";
import { useProjectDataStore } from "@/zustand/projectDataStore";

import { api } from "@/utils/Api";

const CreateTaskPopup = () => {
	const location = useLocation();

	// TASK POPUP STORE
	const isTaskPopupOpen = useTaskPopupStore((state) => state.isOpen);
	const setTaskPopupClose = useTaskPopupStore((state) => state.setClose);

	// TASKS STORE
	const addTask = useTasksStore((state) => state.addTask);

	// STATES FOR FORM
	const [name, setName] = useState<string>("");
	const [description, setDescription] = useState<string>("");

	// const projects = useProjectDataStore((state) => state.data);
	const handleCreateTask = () => {
		const [projectName, sceneName] = location.pathname.split("/").slice(-2);
		if (projectName && projectName.length > 0) {
			api.createTask(name, description, projectName, sceneName)
				.then((newTask) => {
					addTask(newTask);
					setName("");
					setDescription("");
					setTaskPopupClose();
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
			<DialogContent
				sx={{
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
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCreateTask}>Add new task</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CreateTaskPopup;
