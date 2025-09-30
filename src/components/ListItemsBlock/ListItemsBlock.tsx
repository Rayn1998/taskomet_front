import { useState } from "react";

// MUI
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import LinearProgress from "@mui/material/LinearProgress";
import Avatar from "@mui/material/Avatar";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { red, blue, green } from "@mui/material/colors";

interface IListItemsBlock<T> {
	items: T[] | null;
	selectedItemId: number | null;
	handleSelectItem: (id: number) => void;
}

const ListItemsBlock = <T,>({
	items,
	selectedItemId,
	handleSelectItem,
}: IListItemsBlock<T>) => {
	const [hoverId, setHoverId] = useState<number | null>(null);
	return (
		<List
			dense
			sx={{
				width: "100%",
				height: "100%",
				overflowY: "scroll",
				bgcolor: "rgb(42, 44, 51)",
				display: "flex",
				flexDirection: "column",
				gap: "1rem",
				padding: "1rem",
			}}
		>
			{!items && <LinearProgress />}
			{items?.map((item) => {
				const isSelected = selectedItemId === (item as any).id;
				const isHovered = hoverId === (item as any).id;
				const labelId = `checkbox-list-secondary-label-${
					(item as any).id
				}`;
				return (
					<ListItem
						onMouseEnter={() => setHoverId((item as any).id)}
						onMouseLeave={() => setHoverId(null)}
						onClick={() => handleSelectItem((item as any).id)}
						key={(item as any).id}
						style={{
							minHeight: "6rem",
							backgroundColor: isSelected
								? "rgb(10, 80, 80)"
								: isHovered
								? "rgb(5, 55, 80)"
								: "rgb(50, 60, 70)",
							outline: "0.1rem solid rgb(100, 70, 100)",
						}}
					>
						<ListItemButton>
							{(item as any).photo_url && (
								<ListItemAvatar>
									<Avatar
										alt={`Avatar ${(item as any).name}`}
										src={(item as any).photo_url}
									/>
								</ListItemAvatar>
							)}
							{!(item as any).photo_url && (
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
							)}
							<ListItemText
								id={labelId}
								primary={(item as any).name}
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
	);
};

export default ListItemsBlock;
