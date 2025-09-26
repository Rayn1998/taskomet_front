import { ReactNode } from "react";

// MUI
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

// TYPES
import type { IChildrenComponent } from "@/types/IChildrenComponent";

interface IWarning extends IChildrenComponent {
	isOpen: boolean;
	setClose: Function;
	cb: Function;
}

const Warning = (data: IWarning) => {
	const { isOpen, setClose, cb, children } = data;
	return (
		<>
			<Modal open={isOpen} onClose={() => setClose()}>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: 500,
						bgcolor: "rgb(50,60,70)",
						border: "none",
						boxShadow: 24,
						p: 4,
						display: "flex",
						justifyContent: "space-between",
						gap: "2rem",
						color: "#fff",
					}}
				>
					<Typography
						id="modal-modal-title"
						variant="h6"
						component="h2"
					>
						Are you sure you want to delete??
					</Typography>
					<Button
						size="large"
						color="success"
						variant="contained"
						onClick={() => setClose()}
					>
						No
					</Button>
					<Button color="error" variant="text" onClick={() => cb()}>
						Yes
					</Button>
				</Box>
			</Modal>
			{children}
		</>
	);
};
export default Warning;
