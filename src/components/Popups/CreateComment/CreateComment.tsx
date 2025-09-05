import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";

// STORES
import { useCreateCommentPopupStore } from "./CreateCommentPopupStore";

const CreateComment = () => {
	const { isOpen, setClose: handleClose } = useCreateCommentPopupStore();

	return (
		<Dialog open={isOpen} onClose={handleClose}>
			<DialogTitle>Add new comment</DialogTitle>
			<DialogContent
				sx={{
					display: "flex",
					flexDirection: "column",
					width: "30vw",
					gap: "1rem",
				}}
			>
				<TextField label="name" />
			</DialogContent>
			<DialogActions></DialogActions>
		</Dialog>
	);
};

export default CreateComment;
