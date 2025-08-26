// MUI
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

// STORE
import { useProjectPopupStore } from "@/zustand/projectPopupStore";

const CreateProjectPopup = () => {
	// TASK POPUP STORE
	const isProjectPopupOpen = useProjectPopupStore((state) => state.isOpen);
	const setProjectPopupClose = useProjectPopupStore(
		(state) => state.setClose,
	);

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
				<TextField label="name" />
				<TextField label="description" />
			</DialogContent>
			<DialogActions>
				<Button>Add new project</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CreateProjectPopup;
