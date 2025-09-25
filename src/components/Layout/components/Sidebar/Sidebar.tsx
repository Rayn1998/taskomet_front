import { FC } from "react";
import { useNavigate } from "react-router-dom";

// MUI
import HomeOutLinedIcon from "@mui/icons-material/HomeOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import RecentActorsOutlinedIcon from "@mui/icons-material/RecentActorsOutlined";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";

const Sidebar: FC = () => {
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
		</div>
	);
};

export default Sidebar;
