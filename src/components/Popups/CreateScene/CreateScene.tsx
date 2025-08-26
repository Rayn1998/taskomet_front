// MUI
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

// STORE
import { useScenePopupStore } from "@/zustand/scenePopupStore";

const CreateScenePopup = () => {
	// SCENE POPUP STORE
	const isScenePopupOpen = useScenePopupStore((state) => state.isOpen);
	const setScenePopupClose = useScenePopupStore((state) => state.setClose);

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
				<TextField label="name" />
				<TextField label="description" />
			</DialogContent>
			<DialogActions>
				<Button>Add new scene</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CreateScenePopup;
