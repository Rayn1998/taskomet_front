// MUI
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import AddIcon from "@mui/icons-material/Add";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { red, green } from "@mui/material/colors";

// STORES
import { useCreateArtistPopupStore } from "@/components/Popups/CreateArtist/CreateArtistPopupStore";
import { useArtistStore } from "@/zustand/artistStore";

interface ISimpleDialog {
	open: boolean;
	selectedExecutor: number | null;
	onClose: (value: number | null) => void;
}

const ArtistSimpleDialog = (props: ISimpleDialog) => {
	// ARTIST STORE
	const { artists: artistList } = useArtistStore();

	const { setOpenClose } = useCreateArtistPopupStore();

	const { onClose, selectedExecutor, open } = props;

	const handleClose = () => {
		onClose(selectedExecutor);
	};

	const handleListItemClick = (artistId: number | null) => {
		onClose(artistId);
	};

	const handleAddArtistClick = () => {
		setOpenClose();
	};
	return (
		<Dialog
			open={open}
			onClose={handleClose}
			sx={{
				"& .MuiPaper-root": {
					color: "rgb(230, 230, 230)",
					backgroundColor: "rgb(50, 60, 70)",
				},
			}}
		>
			<DialogTitle>Select artist</DialogTitle>
			<List sx={{ pt: 0 }}>
				<ListItem disablePadding key="01">
					<ListItemButton onClick={() => handleListItemClick(null)}>
						<ListItemAvatar>
							<Avatar
								sx={{
									bgcolor: red[500],
									// color: blue[600],
								}}
							>
								<DoNotDisturbIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary="NONE" />
					</ListItemButton>
				</ListItem>
				{artistList &&
					artistList.map((artist) => (
						<ListItem disablePadding key={artist.id}>
							<ListItemButton
								onClick={() => handleListItemClick(artist.id)}
							>
								<ListItemAvatar>
									<Avatar
										sx={{
											bgcolor: "rgba(50,140,150,0.5)",
											color: red[600],
										}}
									>
										<AccountCircleOutlinedIcon
											sx={{ color: "rgb(230,230,230)" }}
										/>
									</Avatar>
								</ListItemAvatar>
								<ListItemText primary={artist.name} />
							</ListItemButton>
						</ListItem>
					))}
				<ListItem disablePadding>
					<ListItemButton autoFocus onClick={handleAddArtistClick}>
						<ListItemAvatar>
							<Avatar
								sx={{
									bgcolor: green[500],
								}}
							>
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
