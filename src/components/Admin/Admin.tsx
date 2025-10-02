import { useEffect, useState, useCallback } from "react";

import Layout from "@/components/Layout/Layout";
import IArtist from "@shared/types/Artist";
import DropDown from "../DropDown/DropDown";

import { snackBar } from "@/utils/snackBar";
import { api } from "@/utils/Api";

// MUI
import LinearProgress from "@mui/material/LinearProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

// STORES
import { useArtistStore } from "@/zustand/artistStore";
import { useTaskInfoStore } from "@/zustand/taskInfoStore";
import { useCreateArtistPopupStore } from "@/components/Popups/CreateArtist/CreateArtistPopupStore";

// TYPEs
import { EArtistRole, ArtistRoleLabels } from "@/types/ArtistRole";

const Admin = () => {
	// CREATE ARTIST POPUP STORE
	const { setOpenClose: setArtistCreateOpenClose } =
		useCreateArtistPopupStore();

	// ARTISTS STORE
	const { artists, updateArtist } = useArtistStore();

	// TASK INFO STORE
	const { setOpenClose: setOpenCloseTaskInfo } = useTaskInfoStore();

	// STATES
	const [hoverId, setHoverId] = useState<number | null>(null);
	const [selectedArtistData, setSelectedArtistData] =
		useState<IArtist | null>(null);

	const handleSelectArtist = useCallback(
		(id: number) => {
			if (id === selectedArtistData?.id) return;
			if (!artists) return;

			const artist = artists.find((artist) => artist.id === id)!;
			setSelectedArtistData(artist);
		},
		[selectedArtistData],
	);

	const handleCreateArtistClick = () => {
		setArtistCreateOpenClose();
	};

	const handleChangeRole = (role: number) => {
		if (!Number.isInteger(role) || selectedArtistData === null) return;
		if (role === selectedArtistData.role) return;
		api.updateArtistRole(selectedArtistData.id, role)
			.then((updatedArtist) => {
				setSelectedArtistData(updatedArtist);
				updateArtist(updatedArtist);
				snackBar("Role was changed successfully", "success");
			})
			.catch((err) => {
				console.log(err);
				snackBar("Something went wrong", "error");
			});
	};

	useEffect(() => setOpenCloseTaskInfo(false), []);
	return (
		<Layout isHeader canvas>
			<div className="admin">
				<div className="admin-artists-list">
					<AddCircleOutlineOutlinedIcon
						className="admin-artists-addbutton"
						onClick={handleCreateArtistClick}
					/>
					<List
						dense
						sx={{
							width: "100%",
							height: "100%",
							bgcolor: "rgb(42, 44, 51)",
							display: "flex",
							flexDirection: "column",
							gap: "1rem",
							padding: "1rem",
						}}
					>
						{!artists && <LinearProgress />}
						{artists?.map((artist) => {
							const isSelected =
								selectedArtistData?.id === artist.id;
							const isHovered = hoverId === artist.id;
							const labelId = `checkbox-list-secondary-label-${artist.id}`;
							return (
								<ListItem
									onMouseEnter={() => setHoverId(artist.id)}
									onMouseLeave={() => setHoverId(null)}
									onClick={() =>
										handleSelectArtist(artist.id)
									}
									key={artist.id}
									style={{
										backgroundColor: isSelected
											? "rgb(10, 80, 80)"
											: isHovered
											? "rgb(5, 55, 80)"
											: "rgb(50, 60, 70)",
										outline:
											"0.1rem solid rgb(100, 70, 100)",
									}}
								>
									<ListItemButton>
										<ListItemAvatar>
											<Avatar
												alt={`Avatar ${artist.name}`}
												src={artist.photo_url}
											/>
										</ListItemAvatar>
										<ListItemText
											id={labelId}
											primary={artist.name}
											sx={{
												"& .MuiTypography-root": {
													fontSize: "1rem",
												},
											}}
										/>
									</ListItemButton>
								</ListItem>
							);
						})}
					</List>
				</div>
				<div className="admin-artists-info">
					{!selectedArtistData && (
						<p className="empty-declaration">
							Select an artist to get account info
						</p>
					)}
					{selectedArtistData && (
						<div className="admin-artists-info-content">
							<div className="admin-artists-info-item">
								<p className="admin-artists-info-item-name">
									Name:{" "}
								</p>
								<p className="admin-artists-info-item-value">
									{selectedArtistData.name}
								</p>
							</div>
							<div className="admin-artists-info-item">
								<p className="admin-artists-info-item-name">
									UserName:{" "}
								</p>
								<p className="admin-artists-info-item-value">
									{selectedArtistData.user_name}
								</p>
							</div>
							<div className="admin-artists-info-item">
								<p className="admin-artists-info-item-name">
									Role:{" "}
								</p>
								<DropDown
									// label="role"
									items={ArtistRoleLabels}
									selected={
										selectedArtistData.role as EArtistRole
									}
									onChange={handleChangeRole}
								/>
							</div>
							<div className="admin-artists-info-item">
								<p className="admin-artists-info-item-name">
									Photo:{" "}
								</p>
							</div>
							<Button
								className="admin-artists-info-delete-button"
								variant="contained"
								color="error"
							>
								DELETE ARTIST
							</Button>
						</div>
					)}
				</div>
			</div>
		</Layout>
	);
};

export default Admin;
