import { FC } from "react";
import { useNavigate } from "react-router-dom";

// MUI
import HomeOutLinedIcon from "@mui/icons-material/HomeOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import RecentActorsOutlinedIcon from "@mui/icons-material/RecentActorsOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";

// STORES
import { useAuthStore } from "@/zustand/authStore";

// TYPES
import { EArtistRole } from "@/types/ArtistRole";

const Sidebar: FC = () => {
	const { auth } = useAuthStore();
	const navigate = useNavigate();
	return (
		<div className="sidebar">
			<Tooltip
				title="Home"
				placement="right"
				slots={{ transition: Zoom }}
				slotProps={{
					tooltip: {
						sx: {
							fontSize: "1rem",
						},
					},
				}}
			>
				<HomeOutLinedIcon
					className="sidebar-icon"
					onClick={() => navigate("/projects")}
				/>
			</Tooltip>
			<Tooltip
				title="My Tasks"
				placement="right"
				slots={{ transition: Zoom }}
				slotProps={{
					tooltip: {
						sx: {
							fontSize: "1rem",
						},
					},
				}}
			>
				<ListAltOutlinedIcon
					className="sidebar-icon"
					onClick={() => navigate("/my-tasks")}
				/>
			</Tooltip>
			{auth && auth.role !== EArtistRole.Artist && (
				<Tooltip
					title="Artists Loading"
					placement="right"
					slots={{ transition: Zoom }}
					slotProps={{
						tooltip: {
							sx: {
								fontSize: "1rem",
							},
						},
					}}
				>
					<RecentActorsOutlinedIcon
						className="sidebar-icon"
						onClick={() => navigate("/artists-loading")}
					/>
				</Tooltip>
			)}
			{auth && auth.role !== EArtistRole.Artist && (
				<Tooltip
					title="Project Statistics"
					placement="right"
					slots={{ transition: Zoom }}
					slotProps={{
						tooltip: {
							sx: {
								fontSize: "1rem",
							},
						},
					}}
				>
					<AssessmentOutlinedIcon
						className="sidebar-icon"
						onClick={() => navigate("/projects-statistics")}
					/>
				</Tooltip>
			)}
		</div>
	);
};

export default Sidebar;
