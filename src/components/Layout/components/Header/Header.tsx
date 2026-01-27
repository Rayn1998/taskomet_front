import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { snackBar } from "@/utils/snackBar";

import { authApi } from "@/routes/auth.api";

// MUI
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import Popover from "@mui/material/Popover";
import Slider from "@mui/material/Slider";

// MUI ICONS
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";

// STORES
import { useAuthStore } from "@/zustand/authStore";
import { useRefreshStore } from "@/zustand/refreshStore";

// TYPES
import { EArtistRole } from "@/types/ArtistRole";

const Header = ({ isHeader }: { isHeader: boolean }) => {
	const { triggerNow, setDelay, delay } = useRefreshStore();

	// AUTH STORE
	const { auth, resetAuth } = useAuthStore();

	const navigate = useNavigate();

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement | SVGElement>(
		null,
	);
	const [rotateAngle, setRotateAngel] = useState<number>(0);
	const [rememberedValue, setRememberedValue] = useState<number>(1);
	const [delayMins, setDelayMins] = useState<number>(1);
	const [avatarMenuOpen, setAvatarMenuOpen] = useState<boolean>(false);
	const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

	const isAuth = Boolean(auth);
	const [isSearchActive, setSearchActive] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleRefreshButtonClick = () => {
		if (!auth) return;
		setRotateAngel((prev) => prev + 360);
		triggerNow();
	};

	useEffect(() => {
		if (delay) setDelayMins(delay);
	}, [delay]);

	const handleChangeDelay = (e: any) => {
		const value = +e.target.value;
		setDelayMins(value);

		if (debounceTimeout.current) {
			clearTimeout(debounceTimeout.current);
		}

		debounceTimeout.current = setTimeout(() => {
			setDelay(value);
			snackBar(`Auto refresh set to ${value} mins`, "success");
		}, 2000);
	};

	const handleSetSearchActive = () => {
		setSearchActive(true);
		inputRef.current?.focus();
	};
	const handleSetSearchInactive = () => {
		setSearchActive(false);
	};

	const handleSettingsClick = (event: React.MouseEvent<SVGElement>) => {
		setAnchorEl(event.currentTarget);
		setSettingsOpen(true);
	};

	const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
		setAvatarMenuOpen(true);
	};

	const handleClose = () => {
		setAnchorEl(null);
		setAvatarMenuOpen(false);
	};

	const handleLogout = () => {
		resetAuth();
		authApi.logout();
		navigate("/signin");
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
					{/* <SearchOutlinedIcon
						className="header-icon"
						onClick={handleSetSearchActive}
					/>
					<input
						ref={inputRef}
						className="header-search"
						placeholder="Search"
						disabled
					></input> */}
				</div>
				<div className="header-right-block">
					<AutorenewOutlinedIcon
						className="header-icon-refresh"
						onClick={handleRefreshButtonClick}
						style={{
							transform: `rotate(${rotateAngle}deg)`,
						}}
					/>
					<SettingsOutlinedIcon
						className="header-icon"
						onClick={(e) => handleSettingsClick(e)}
					/>
					<Popover
						open={settingsOpen}
						onClose={() => setSettingsOpen(false)}
						anchorEl={anchorEl}
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "left",
						}}
						sx={{
							"& .MuiPaper-root": {
								width: "15rem",
								height: "5rem",
								padding: "0 1rem",
								backgroundColor: "rgba(30,30,30,0.5)",
								display: "flex",
								flexDirection: "column",
								justifyContent: "flex-end",
							},
						}}
					>
						<p style={{ color: "rgb(230,230,230)" }}>
							Refresh delay in mins
						</p>
						<Slider
							aria-label="Refresh delay"
							defaultValue={30}
							getAriaValueText={(value) => `${value}`}
							valueLabelDisplay="auto"
							shiftStep={30}
							value={delayMins}
							onChange={(e) => handleChangeDelay(e)}
							step={1}
							marks
							min={1}
							max={10}
						/>
					</Popover>
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
						aria-controls={
							avatarMenuOpen ? "account-menu" : undefined
						}
						aria-haspopup="true"
						aria-expanded={avatarMenuOpen ? "true" : undefined}
						sx={{ cursor: "pointer" }}
					/>
					<Menu
						anchorEl={anchorEl}
						id="account-menu"
						open={avatarMenuOpen}
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
