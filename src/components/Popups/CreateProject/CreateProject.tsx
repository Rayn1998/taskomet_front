import { useState, FormEvent } from "react";
import { api } from "@/utils/Api";
import { snackBar } from "@/utils/snackBar";

// MUI
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

// STORES
import { useProjectsStore } from "@/zustand/projectsStore";
import { useCreateProjectPopupStore } from "./CreateProjectPopupStore";

const CreateProjectPopup = () => {
	const [name, setName] = useState<string>("");
	const [description, setDescription] = useState<string>("");

	// PROJECTS STORE
	const { projects, addProject } = useProjectsStore();

	// TASK POPUP STORE
	const { isOpen: isProjectPopupOpen, setClose: setProjectPopupClose } =
		useCreateProjectPopupStore();

	const handleCreateProject = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!projects) return;

		for (const project of projects) {
			if (project.name.toLowerCase() === name.toLowerCase()) {
				snackBar("Project with same name already exists", "error");
				return;
			}
		}

		api.createProject(name, description)
			.then((createdProject) => {
				addProject(createdProject);
				setProjectPopupClose();
				setName("");
				setDescription("");
				snackBar("Project was successfully created", "success");
			})
			.catch((err) => console.log(err));
	};

	const handleClose = () => {
		setProjectPopupClose();
	};
	return (
		<Dialog
			open={isProjectPopupOpen}
			onClose={handleClose}
			sx={{
				"& .MuiPaper-root": {
					color: "rgb(230, 230, 230)",
					backgroundColor: "rgb(50, 60, 70)",
				},
			}}
		>
			<DialogTitle>Create new project</DialogTitle>
			<DialogContent>
				<form
					id="create-project-form"
					onSubmit={handleCreateProject}
					style={{
						display: "flex",
						flexDirection: "column",
						width: "30vw",
						gap: "1rem",
					}}
				>
					<TextField
						required
						label="name"
						value={name}
						onChange={(e) => setName(e.currentTarget.value)}
						sx={{
							"& .MuiInputBase-input": {
								color: "rgb(230, 230, 230)",
							},
							"& .MuiFormLabel-root": {
								color: "rgb(230, 230, 230)",
							},
						}}
					/>
					<TextField
						label="description"
						value={description}
						onChange={(e) => setDescription(e.currentTarget.value)}
						sx={{
							"& .MuiInputBase-input": {
								color: "rgb(230, 230, 230)",
							},
							"& .MuiFormLabel-root": {
								color: "rgb(230, 230, 230)",
							},
						}}
					/>
				</form>
			</DialogContent>
			<DialogActions>
				<Button
					type="submit"
					variant="contained"
					color="success"
					form="create-project-form"
				>
					Add new project
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CreateProjectPopup;
