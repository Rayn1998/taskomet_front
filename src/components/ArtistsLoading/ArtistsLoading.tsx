import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Layout from "@/components/Layout/Layout";
import Task from "@/components/Task/Task";

import { api } from "@/utils/Api";

// MUI
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
// import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";
import LinearProgress from "@mui/material/LinearProgress";

//STORES
import { useArtistStore } from "@/zustand/artistStore";
import { useTaskInfoStore } from "@/zustand/taskInfoStore";
import { useTasksStore } from "@/zustand/tasksStore";

const ArtistsLoading = () => {
	const location = useLocation();

	const { setOpenClose: setTaskInfoOpenClose } = useTaskInfoStore();

	const { artists } = useArtistStore();

	const { tasks, setTasks, lastPath, resetTasks } = useTasksStore();

	const [hoverId, setHoverId] = useState<number | null>(null);
	const [selected, setSelected] = useState<number | null>(null);
	const [selectedTask, setSelectedTask] = useState<string>("");

	const handleClick = useCallback(
		(id: number) => {
			setSelected(id);
			resetTasks();
			api.getMyTasks(id)
				.then((tasks) => {
					setTasks(tasks, location.pathname);
				})
				.catch((err) => console.log(err));
		},
		[selected],
	);

	const handleTaskClick = (name: string) => {
		setSelectedTask(name);
	};

	useEffect(() => {
		setTaskInfoOpenClose(false);
	}, []);

	return (
		<Layout isHeader canvas>
			<div className="artists-loading">
				<List
					dense
					sx={{
						width: "30%",
						height: "fit-content",
						bgcolor: "rgb(42, 44, 51)",
					}}
				>
					{!artists && <LinearProgress />}
					{artists?.map((artist) => {
						const isSelected = selected === artist.id;
						const isHovered = hoverId === artist.id;
						const labelId = `checkbox-list-secondary-label-${artist.id}`;
						return (
							<ListItem
								onMouseEnter={() => setHoverId(artist.id)}
								onMouseLeave={() => setHoverId(null)}
								onClick={() => handleClick(artist.id)}
								key={artist.id}
								style={{
									backgroundColor: isSelected
										? "rgb(10, 80, 80)"
										: isHovered
										? "rgb(5, 55, 80)"
										: "rgb(45, 50, 60)",
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
				<div className="artists-loading-tasks">
					{!selected && (
						<p className="empty-declaration">
							Select an artist to get his tasks assigned
						</p>
					)}
					{selected && !tasks && <LinearProgress />}
					{selected &&
						tasks?.map((task, i) => {
							return (
								<Task
									key={task.id}
									task={task}
									orderNum={i}
									selected={Boolean(
										selectedTask === task.name,
									)}
									handleClick={handleTaskClick}
									handleDoubleClickNavigateToTask
								/>
							);
						})}
					{selected && tasks?.length === 0 && (
						<p className="empty-declaration">
							This artist has no tasks assigned yet...
						</p>
					)}
				</div>
			</div>
		</Layout>
	);
};

export default ArtistsLoading;
