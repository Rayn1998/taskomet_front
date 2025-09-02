import { useState } from "react";
import { useLocation } from "react-router-dom";

// MUI
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { api } from "@/utils/Api";

// STORE
import { useScenePopupStore } from "@/zustand/scenePopupStore";
import { useScenesStore } from "@/zustand/scenesStore";

const CreateScenePopup = () => {
	const location = useLocation();

	// SCENE POPUP STORE
	const { isOpen: isScenePopupOpen, setClose: setScenePopupClose } =
		useScenePopupStore();

	// SCENES STORE
	const { addScene } = useScenesStore();

	const [name, setName] = useState<string>("");
	const [description, setDescription] = useState<string>("");

	const handleAddScene = () => {
		const [projectName] = location.pathname.split("/").slice(-1);
		if (projectName && projectName.length > 0) {
			api.createScene(name, description, projectName)
				.then((newScene) => {
					addScene(newScene);
					setName("");
					setDescription("");
					setScenePopupClose();
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
		<Dialog open={isScenePopupOpen} onClose={handleClose}>
			<DialogTitle>Create new scene</DialogTitle>
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
				<Button onClick={handleAddScene}>Add new scene</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CreateScenePopup;
