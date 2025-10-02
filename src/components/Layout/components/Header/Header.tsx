import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { api } from "@/utils/Api";
import { checkLocation } from "@/utils/checkLocation";
import { snackBar } from "@/utils/snackBar";

// MUI
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";

// MUI ICONS
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";

// STORES
import { useAuthStore } from "@/zustand/authStore";
import { useProjectsStore } from "@/zustand/projectsStore";
import { useScenesStore } from "@/zustand/scenesStore";
import { useTasksStore } from "@/zustand/tasksStore";

// TYPES
import { EArtistRole } from "@/types/ArtistRole";

const Header = ({ isHeader }: { isHeader: boolean }) => {
	// AUTH STORE
	const { auth, resetAuth } = useAuthStore();

	// PROJECTS STORE
	const { setProjects } = useProjectsStore();

	// SCENES STORE
	const { setScenes } = useScenesStore();

	// TASKS STORE
	const { setTasks } = useTasksStore();

	const location = useLocation();
	const navigate = useNavigate();

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [refreshed, setRefreshed] = useState<boolean>(false);
	const [rotateAngle, setRotateAngel] = useState<number>(0);
	const open = Boolean(anchorEl);

	const isAuth = Boolean(auth);
	const [isSearchActive, setSearchActive] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleSetSearchActive = () => {
		setSearchActive(true);
		inputRef.current?.focus();
	};
	const handleSetSearchInactive = () => {
		setSearchActive(false);
	};

	const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleRefreshClick = () => {
		setRotateAngel((prev) => prev + 360);
		setRefreshed(true);
		setTimeout(() => setRefreshed(false), 1000);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		localStorage.removeItem("user");
		resetAuth();
		navigate("/signup");
	};

	const handleRefresh = () => {
		const currentLocation = checkLocation(location);

		if (currentLocation.project || currentLocation.artistsLoading) {
			api.getProjects()
				.then(setProjects)
				.catch(() => snackBar("Can't receive projects", "error"));
		}

		if (currentLocation.scene || currentLocation.artistsLoading) {
			const projectName = location.pathname.split("/").pop();
			projectName &&
				api
					.getScenes(projectName)
					.then((scenes) => setScenes(scenes, projectName))
					.catch(() => snackBar("Can't receive scenes", "error"));
		}

		if (
			currentLocation.task ||
			currentLocation.myTasks ||
			currentLocation.artistsLoading
		) {
			const [projectName, sceneName] = location.pathname
				.split("/")
				.slice(-2);
			if (!(projectName && sceneName)) return;

			api.getTasks(projectName, sceneName)
				.then((tasks) => setTasks(tasks, location.pathname))
				.catch(() => snackBar("Can't receive tasks", "error"));
		}

		snackBar("Refreshed!", "success");
	};

	if (!isHeader) return <></>;
	return (
		<div className="header">
			<div className="header-container">
				<div
					className="header-search-container"
					onFocus={handleSetSearchActive}
					onBlur={handleSetSearchInactive}
					style={{
						outline: isSearchActive
							? "0.1rem solid rgb(100,70,100)"
							: "none",
					}}
				>
					<SearchOutlinedIcon
						className="header-icon"
						onClick={handleSetSearchActive}
					/>
					<input
						ref={inputRef}
						className="header-search"
						placeholder="Search"
					></input>
				</div>
				<div className="header-right-block">
					<AutorenewOutlinedIcon
						className="header-icon-refresh"
						onClick={() => {
							handleRefreshClick();
							handleRefresh();
						}}
						style={{
							transform: `rotate(${rotateAngle}deg)`,
						}}
					/>
					{/* <SettingsOutlinedIcon className="header-icon" /> */}
					{/* <NotificationsNoneOutlinedIcon className="header-icon" /> */}
					{auth && auth.role !== EArtistRole.Artist && (
						<AdminPanelSettingsOutlinedIcon
							className="header-icon"
							onClick={() => navigate("/admin")}
						/>
					)}
					<Avatar
						alt="profile-avatar"
						src={isAuth ? auth?.photo_url : ""}
						onClick={handleAvatarClick}
						aria-controls={open ? "account-menu" : undefined}
						aria-haspopup="true"
						aria-expanded={open ? "true" : undefined}
						sx={{ cursor: "pointer" }}
					/>
					<Menu
						anchorEl={anchorEl}
						id="account-menu"
						open={open}
						onClose={handleClose}
						onClick={handleClose}
						slotProps={{
							paper: {
								elevation: 0,
								sx: {
									overflow: "visible",
									filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
									mt: 1.5,
									"& .MuiAvatar-root": {
										width: 32,
										height: 32,
										ml: -0.5,
										mr: 1,
									},
									"&::before": {
										content: '""',
										display: "block",
										position: "absolute",
										top: 0,
										right: 14,
										width: 10,
										height: 10,
										bgcolor: "background.paper",
										transform:
											"translateY(-50%) rotate(45deg)",
										zIndex: 0,
									},
								},
							},
						}}
						transformOrigin={{
							horizontal: "right",
							vertical: "top",
						}}
						anchorOrigin={{
							horizontal: "right",
							vertical: "bottom",
						}}
					>
						<MenuItem onClick={handleLogout}>
							<ListItemIcon>
								<Logout fontSize="small" />
							</ListItemIcon>
							Logout
						</MenuItem>
					</Menu>
				</div>
			</div>
		</div>
	);
};

export default Header;
