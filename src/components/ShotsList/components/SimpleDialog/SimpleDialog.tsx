import { FC } from "react";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import { blue } from "@mui/material/colors";

import { useArtistPopupStore } from "@/zustand/artistPopupStore";
import { useArtistStore } from "@/zustand/artistStore";

interface ISimpleDialog {
	open: boolean;
	selectedExecutor: string | null;
	onClose: (value: string | null) => void;
}

const SimpleDialog: FC<ISimpleDialog> = (props) => {
	// ARTIST STORE
	const artistList = useArtistStore((state) => state.artists);

	const setOpenClose = useArtistPopupStore((state) => state.setOpenClose);

	const { onClose, selectedExecutor, open } = props;

	const handleClose = () => {
		onClose(selectedExecutor);
	};

	const handleListItemClick = (value: string) => {
		onClose(value);
		// setOpenClose();
	};

	const handleAddArtistClick = () => {
		setOpenClose();
	};

	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>Set backup account</DialogTitle>
			<List sx={{ pt: 0 }}>
				{artistList &&
					artistList.map((artist) => (
						<ListItem disablePadding key={artist.id}>
							<ListItemButton
								onClick={() => handleListItemClick(artist.name)}
							>
								<ListItemAvatar>
									<Avatar
										sx={{
											bgcolor: blue[100],
											color: blue[600],
										}}
									>
										<PersonIcon />
									</Avatar>
								</ListItemAvatar>
								<ListItemText primary={artist.name} />
							</ListItemButton>
						</ListItem>
					))}
				<ListItem disablePadding>
					<ListItemButton autoFocus onClick={handleAddArtistClick}>
						<ListItemAvatar>
							<Avatar>
								<AddIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary="Add new artist" />
					</ListItemButton>
				</ListItem>
			</List>
		</Dialog>
	);
};

export default SimpleDialog;
