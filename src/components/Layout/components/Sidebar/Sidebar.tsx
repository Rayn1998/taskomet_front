import { FC } from "react";
import { useNavigate } from "react-router-dom";

import IconWrapper from "@/components/IconWrapper/IconWrapper";

// MUI
import HomeOutLinedIcon from "@mui/icons-material/HomeOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import RecentActorsOutlinedIcon from "@mui/icons-material/RecentActorsOutlined";

const Sidebar: FC = () => {
	const navigate = useNavigate();
	return (
		<div className="sidebar">
			<IconWrapper
				onClick={() => navigate("/projects")}
				icon={<HomeOutLinedIcon className="sidebar-icon" />}
			/>
			<IconWrapper
				onClick={() => navigate("/my-tasks")}
				icon={<ListAltOutlinedIcon className="sidebar-icon" />}
			/>
			<IconWrapper
				onClick={() => navigate("/artists-loading")}
				icon={<RecentActorsOutlinedIcon className="sidebar-icon" />}
			/>
		</div>
	);
};

export default Sidebar;
