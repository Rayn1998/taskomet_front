import { useState, FormEvent } from "react";
import { useSnackbar, closeSnackbar } from "notistack";
import { api } from "@/utils/Api";

// MUI
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

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

	// SNACKBAR
	const { enqueueSnackbar } = useSnackbar();

	const handleCreateProject = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		api.createProject(name, description)
			.then((createdProject) => {
				addProject(createdProject);
				setProjectPopupClose();
				setName("");
				setDescription("");
				const snackBarId = enqueueSnackbar(
					"Project was successfully created",
					{
						variant: "success",
						action: (
							<IconButton
								onClick={() => closeSnackbar(snackBarId)}
							>
								<CloseIcon />
							</IconButton>
						),
					},
				);
			})
			.catch((err) => console.log(err));
	};

	const handleClose = () => {
		setProjectPopupClose();
	};
	return (
		<Dialog open={isProjectPopupOpen} onClose={handleClose}>
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
				<Button type="submit" form="create-project-form">
					Add new project
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CreateProjectPopup;
