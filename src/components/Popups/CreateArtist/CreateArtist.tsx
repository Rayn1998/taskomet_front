import { useState } from "react";

// STATES
import { useArtistPopupStore } from "@/zustand/artistPopupStore";
import { useArtistStore } from "@/zustand/artistStore";

// MUI
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { api } from "@/utils/Api";

const CreateArtistPopup = () => {
	// ARTIST STORE
	const addArtist = useArtistStore((state) => state.addArtist);

	// Create Artist Popup states
	const isOpen = useArtistPopupStore((state) => state.isOpen);
	const handleClose = useArtistPopupStore((state) => state.setClose);

	// states for form of popup
	const [name, setName] = useState<string>("");
	const [tgId, setTgId] = useState<string>("");

	const handleClick = () => {
		api.createArtist(name, 0, tgId)
			.then((newArtist) => {
				setName("");
				setTgId("");
				handleClose();
				addArtist(newArtist);
			})
			.catch((err) => console.log(err));
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
