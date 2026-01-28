import { useEffect, useState, useCallback } from "react";

// COMPONENTS
import Layout from "@/components/Layout/Layout";
import IArtist from "@shared/types/Artist";
import DropDown from "../../components/DropDown/DropDown";

// UTILS
import { snackBar } from "@/utils/snackBar";

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
import { useAuthStore } from "@/zustand/authStore";
import { useArtistStore } from "@/zustand/artistStore";
import { useTaskInfoStore } from "@/zustand/taskInfoStore";
import { useCreateArtistPopupStore } from "@/components/Popups/CreateArtist/CreateArtistPopupStore";

// TYPES
import { EArtistRole, ArtistRoleLabels } from "@/types/ArtistRole";

// API
import { artistsApi } from "@/routes/artists.api";

const Admin = () => {
	// CREATE ARTIST STORE
	const { setOpenClose: setArtistCreateOpenClose } =
		useCreateArtistPopupStore();

	// ARTISTS STORE
	const { artists, setArtists, updateArtist, deleteArtist } =
		useArtistStore();

	// INFO STORE
	const { setOpenClose: setOpenCloseTaskInfo } = useTaskInfoStore();

	// AUTH STORE
	const { auth } = useAuthStore();

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
		[selectedArtistData, artists],
	);

	const handleCreateArtistClick = () => {
		setArtistCreateOpenClose();
	};

	const handleChangeRole = (role: number) => {
		if (!Number.isInteger(role) || selectedArtistData === null) return;
		if (role === selectedArtistData.role) return;
		artistsApi
			.updateRole(selectedArtistData.id, role)
			.then((res) => {
				setSelectedArtistData(res.data);
				updateArtist(res.data);
				snackBar("Role was changed successfully", "success");
			})
			.catch((_) => {
				snackBar("Something went wrong", "error");
			});
	};

	const handleDeleteArtist = (artistId: number) => {
		if (!Number.isInteger(artistId)) return;
		if (auth!.id === artistId) {
			return snackBar("You can't delete yourself :)", "warning");
		}

		artistsApi
			.delete(artistId)
			.then((res) => {
				deleteArtist(res.data.id);
				setSelectedArtistData(null);
				snackBar(
					`Artist ${res.data.name} was successfully deleted`,
					"success",
				);
			})
			.catch((err) => {
				console.log(err);
				snackBar("Error deleting artist", "error");
			});
	};

	useEffect(() => setOpenCloseTaskInfo(false), []);
	// useEffect(() => {
	// 	artistsApi.getAll().then((res) => {
	// 		setArtists(res.data);
	// 	});
	// }, []);
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
							overflowY: "scroll",
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
									onClick={() => {
										handleSelectArtist(artist.id);
									}}
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
								onClick={() =>
									handleDeleteArtist(selectedArtistData.id)
								}
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
