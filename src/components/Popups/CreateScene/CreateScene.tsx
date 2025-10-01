import { useState, FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { useSnackbar, closeSnackbar } from "notistack";

// MUI
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import { api } from "@/utils/Api";
import { snackBar } from "@/utils/snackBar";

// STORE
import { useCreateScenePopupStore } from "./CreateScenePopupStore";
import { useScenesStore } from "@/zustand/scenesStore";

const CreateScenePopup = () => {
	const location = useLocation();

	// SCENE POPUP STORE
	const { isOpen: isScenePopupOpen, setClose: setScenePopupClose } =
		useCreateScenePopupStore();

	// SCENES STORE
	const { scenes, addScene } = useScenesStore();

	// SNACKBAR
	const { enqueueSnackbar } = useSnackbar();

	const [name, setName] = useState<string>("");
	const [description, setDescription] = useState<string>("");

	const handleAddScene = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!scenes) return;

		for (const scene of scenes) {
			if (scene.name.toLowerCase() === name.toLowerCase()) {
				snackBar("Scene with same name already exists", "error");
				return;
			}
		}

		const [projectName] = location.pathname.split("/").slice(-1);
		if (projectName && projectName.length > 0) {
			api.createScene(name, description, projectName)
				.then((newScene) => {
					addScene(newScene);
					setName("");
					setDescription("");
					setScenePopupClose();
					const snackBarId = enqueueSnackbar(
						"Scene was successfully created",
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
				.catch((err) => {
					console.log(err);
				});
		}
	};

	const handleClose = () => {
		setScenePopupClose();
	};
	return (
		<Dialog
			open={isScenePopupOpen}
			onClose={handleClose}
			sx={{
				"& .MuiPaper-root": {
					color: "rgb(230, 230, 230)",
					backgroundColor: "rgb(50, 60, 70)",
				},
			}}
		>
			<DialogTitle>Create new scene</DialogTitle>
			<DialogContent>
				<form
					id="create-scene-form"
					onSubmit={handleAddScene}
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
					form="create-scene-form"
				>
					Add new scene
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CreateScenePopup;
