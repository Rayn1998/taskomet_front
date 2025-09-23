import { useEffect, useState } from "react";
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

//STORES
import { useArtistStore } from "@/zustand/artistStore";
import { useTaskInfoStore } from "@/zustand/taskInfoStore";
import { useTasksStore } from "@/zustand/tasksStore";

// TODO
/* 
1. Сделать лоадер
2. Убирать полученные таски сразу после клика на другого артиста
3. По двойному клику на таск переводить на my-tasks и сделать фокус на кликнутом с открытым инфоблоком
*/

const ArtistsLoading = () => {
	const { setClose: setTaskInfoClose } = useTaskInfoStore();

	const { artists } = useArtistStore();
	useEffect(() => {
		setTaskInfoClose();
	}, []);

	const { tasks, setTasks } = useTasksStore();

	const [hoverId, setHoverId] = useState<number | null>(null);
	const [selected, setSelected] = useState<number | null>(null);
	const [selectedTask, setSelectedTask] = useState<string>("");

	const handleClick = (id: number) => {
		setSelected(id);
		api.getMyTasks(id)
			.then((tasks) => {
				setTasks(tasks);
			})
			.catch((err) => console.log(err));
	};

	const handleTaskClick = (name: string) => {
		setSelectedTask(name);
	};

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
					{artists &&
						artists.map((artist) => {
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
										backgroundColor: isHovered
											? "rgb(5, 55, 80)"
											: isSelected
											? "rgb(10, 80, 80)"
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
					{tasks &&
						tasks.map((task, i) => {
							return (
								<Task
									key={task.id}
									task={task}
									orderNum={i}
									selected={Boolean(
										selectedTask === task.name,
									)}
									handleClick={handleTaskClick}
								/>
							);
						})}
				</div>
			</div>
		</Layout>
	);
};

export default ArtistsLoading;
