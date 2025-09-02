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

// STORES
import { useArtistPopupStore } from "@/zustand/artistPopupStore";
import { useArtistStore } from "@/zustand/artistStore";

interface ISimpleDialog {
	open: boolean;
	selectedExecutor: number | null;
	onClose: (value: number | null) => void;
}

const ArtistSimpleDialog: FC<ISimpleDialog> = (props) => {
	// ARTIST STORE
	const artistList = useArtistStore((state) => state.artists);

	const setOpenClose = useArtistPopupStore((state) => state.setOpenClose);

	const { onClose, selectedExecutor, open } = props;

	const handleClose = () => {
		onClose(selectedExecutor);
	};

	const handleListItemClick = (artistId: number) => {
		onClose(artistId);
		// setOpenClose();
	};

	const handleAddArtistClick = () => {
		setOpenClose();
	};
	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>Select artist</DialogTitle>
			<List sx={{ pt: 0 }}>
				{artistList &&
					artistList.map((artist) => (
						<ListItem disablePadding key={artist.id}>
							<ListItemButton
								onClick={() => handleListItemClick(artist.id)}
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

export default ArtistSimpleDialog;
