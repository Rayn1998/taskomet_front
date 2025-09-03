import { useState } from "react";

import { api } from "@/utils/Api";

// MUI
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

// STORES
import { useProjectsStore } from "@/zustand/projectsStore";
import { useProjectPopupStore } from "@/zustand/projectPopupStore";

const CreateProjectPopup = () => {
	const [name, setName] = useState<string>("");
	const [description, setDescription] = useState<string>("");

	// PROJECTS STORE
	const { addProject } = useProjectsStore();

	// TASK POPUP STORE
	const { isOpen: isProjectPopupOpen, setClose: setProjectPopupClose } =
		useProjectPopupStore();

	const handleCreateProject = () => {
		api.createProject(name, description)
			.then((createdProject) => {
				addProject(createdProject);
				setProjectPopupClose();
				setName("");
				setDescription("");
			})
			.catch((err) => console.log(err));
	};

	const handleClose = () => {
		setProjectPopupClose();
	};
	return (
		<Dialog open={isProjectPopupOpen} onClose={handleClose}>
			<DialogTitle>Create new project</DialogTitle>
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
				<Button onClick={handleCreateProject}>Add new project</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CreateProjectPopup;
