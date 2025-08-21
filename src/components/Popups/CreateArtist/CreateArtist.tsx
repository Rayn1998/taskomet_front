import { FC, useState } from "react";

// STATES
import { useArtistPopupStore } from "@/zustand/artistPopupStore";

// MUI
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import DropDown from "@/components/ShotsList/components/DropDown/DropDown";
import TextField from "@mui/material/TextField";

const CreateArtistPopup: FC = () => {
	// Create Artist Popup states
	const isOpen = useArtistPopupStore((state) => state.isOpen);
	const handleClose = useArtistPopupStore((state) => state.setClose);

	// states for form of popup
	const [name, setName] = useState<string>("");
	const [tgId, setTgId] = useState<string>("");

	const handleClick = () => {
		// TEST
		console.log(name, tgId);
	};
	return (
		<Dialog onClose={handleClose} open={isOpen}>
			<DialogTitle>Add new artist</DialogTitle>
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
					onChange={(e) => {
						setName(e.currentTarget.value);
					}}
				/>
				<TextField
					label="telegram id"
					value={tgId}
					onChange={(e) => {
						setTgId(e.currentTarget.value);
					}}
				/>
				{/* <DropDown label="role" /> */}
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClick}>Add new artist</Button>
			</DialogActions>
		</Dialog>
	);
};
export default CreateArtistPopup;
