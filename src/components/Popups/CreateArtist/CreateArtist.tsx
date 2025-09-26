import { useState } from "react";

// STATES
import { useCreateArtistPopupStore } from "./CreateArtistPopupStore";
import { useArtistStore } from "@/zustand/artistStore";

// MUI
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { api } from "@/utils/Api";

// TYPES
import type IArtist from "@shared/types/Artist";

const CreateArtistPopup = () => {
	// ARTIST STORE
	const addArtist = useArtistStore((state) => state.addArtist);

	// Create Artist Popup states
	const { isOpen, setClose: handleClose } = useCreateArtistPopupStore();

	// states for form of popup
	const [name, setName] = useState<string>("");
	const [userName, setUserName] = useState<string>("");

	const handleClick = () => {
		if (!(name && userName)) return;
		const reqData: Omit<IArtist, "id"> = {
			name,
			user_name: userName,
			role: 0,
			photo_url: "",
		};
		api.createArtist(reqData)
			.then((newArtist) => {
				setName("");
				setUserName("");
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
					label="telegram username"
					value={userName}
					onChange={(e) => {
						setUserName(e.currentTarget.value);
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
