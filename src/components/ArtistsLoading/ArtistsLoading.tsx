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
import Avatar from "@mui/material/Avatar";
import LinearProgress from "@mui/material/LinearProgress";
import KeyboardDoubleArrowDownOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowDownOutlined";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";

// NIVO
import { ResponsivePie } from "@nivo/pie";

//STORES
import { useArtistStore } from "@/zustand/artistStore";
import { useProjectsStore } from "@/zustand/projectsStore";
import { useTaskInfoStore } from "@/zustand/taskInfoStore";
import { useTasksStore } from "@/zustand/tasksStore";

// TYPES
import { EStatus, StatusLabels, StatusColors } from "@/types/Status";
import ITask from "@shared/types/Task";

const ArtistsLoading = () => {
	const location = useLocation();

	// TASK INFO STORE
	const { setOpenClose: setTaskInfoOpenClose } = useTaskInfoStore();

	// PROJECTS STORE
	const { projects } = useProjectsStore();

	// ARTISTS STORE
	const { artists } = useArtistStore();

	// TASKSK STORE
	const { tasks, setTasks, resetTasks, removeTask } = useTasksStore();

	// STATES
	const [hoverId, setHoverId] = useState<number | null>(null);
	const [selectedArtistId, setSelectedArtistId] = useState<number | null>(
		null,
	);
	const [selectedTask, setSelectedTask] = useState<number | null>(null);
	const [isStatisticsOpen, setIsStatisticsOpen] = useState<boolean>(false);
	const [isShowStatisticsIcon, setIsShowStatisticsIcon] =
		useState<boolean>(true);
	const [pieData, setPieData] = useState<{ id: string; value: number }[]>([]);

	const handleSelectArtist = useCallback(
		(id: number) => {
			if (id === selectedArtistId) return;
			setSelectedArtistId(id);
			resetTasks();
			api.getMyTasks(id)
				.then((tasks) => {
					setTasks(tasks, location.pathname);
				})
				.catch((err) => console.log(err));
		},
		[selectedArtistId],
	);

	const handleTaskClick = (taskId: number) => {
		setSelectedTask(taskId);
	};

	// Закрывает Infoblock как только заходим на эту страницу
	useEffect(() => {
		setTaskInfoOpenClose(false);
	}, []);

	// Фильтр тасков по выбранному артисту, если исполнитель был изменён на этой странице
	useEffect(() => {
		if (tasks) {
			for (const task of tasks) {
				selectedArtistId !== task.executor && removeTask(task.id);
			}
		}
	}, [tasks, selectedArtistId]);

	// Логика отображения стрелки для открытия блока статистики
	useEffect(() => {
		if (!isStatisticsOpen) {
			setTimeout(() => {
				setIsShowStatisticsIcon(true);
			}, 250);
		} else {
			setIsShowStatisticsIcon(false);
		}
	}, [isStatisticsOpen]);

	// STATISTICS -----------------------------
	const [numberOfTasks, setNumberOfTasks] = useState<number>(0);
	const [spentHours, setSpentHours] = useState<number>(0);
	const [filteredByProjectTasks, setFilteredByProjectTasks] = useState<
		[[string, ITask[]][]] | null
	>(null);

	useEffect(() => {
		if (tasks && isStatisticsOpen) {
			let hours = 0;
			const data = new Map();
			const resData = [] as any;

			for (const task of tasks) {
				const taskStatus = task.status as EStatus;
				if (data.has(taskStatus)) {
					const value = data.get(taskStatus);
					value[0]++;
					data.set(taskStatus, value);
				} else {
					data.set(taskStatus, [1, StatusColors[taskStatus]]);
				}
				hours += Number(task.spent_hours);
			}

			for (const [status, values] of data.entries()) {
				const statusData = {
					id: StatusLabels[status as EStatus],
					value: values[0],
					color: values[1],
				};
				resData.push(statusData);
			}

			setPieData(resData);
			setNumberOfTasks(tasks.length);
			setSpentHours(hours);
		}
	}, [tasks, isStatisticsOpen]);

	useEffect(() => {
		if (!tasks) return;
		const tasksByProject = new Map();
		const filteredTasks = [];

		for (const task of tasks) {
			if (tasksByProject.has(task.project_name)) {
				const value: ITask[] = tasksByProject.get(task.project_name);
				value.push(task);
				tasksByProject.set(task.project_name, value);
			} else {
				tasksByProject.set(task.project_name, [task]);
			}
		}

		for (const [projectName, projectTasks] of tasksByProject.entries()) {
			const res = [projectName, projectTasks];
			filteredTasks.push(res);
		}

		setFilteredByProjectTasks(filteredTasks as any);
	}, [tasks]);

	return (
		<Layout isHeader canvas>
			<div className="artists-loading">
				<List
					dense
					sx={{
						width: "30%",
						height: "fit-content",
						bgcolor: "rgb(42, 44, 51)",
						display: "flex",
						flexDirection: "column",
						gap: "1rem",
						padding: "1rem",
					}}
				>
					{!artists && <LinearProgress />}
					{artists?.map((artist) => {
						const isSelected = selectedArtistId === artist.id;
						const isHovered = hoverId === artist.id;
						const labelId = `checkbox-list-secondary-label-${artist.id}`;
						return (
							<ListItem
								onMouseEnter={() => setHoverId(artist.id)}
								onMouseLeave={() => setHoverId(null)}
								onClick={() => handleSelectArtist(artist.id)}
								key={artist.id}
								style={{
									backgroundColor: isSelected
										? "rgb(10, 80, 80)"
										: isHovered
										? "rgb(5, 55, 80)"
										: "rgb(50, 60, 70)",
									outline: "0.1rem solid rgb(100, 70, 100)",
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
				<div className="artists-loading-tasks-block">
					<div
						className="artists-loading-tasks"
						style={{
							height: isStatisticsOpen ? "50%" : "100%",
						}}
					>
						{!selectedArtistId && (
							<p className="empty-declaration">
								Select an artist to get his tasks assigned
							</p>
						)}
						{selectedArtistId && !tasks && <LinearProgress />}
						{selectedArtistId &&
							filteredByProjectTasks?.map((filteredArray, i) => {
								return (
									<Accordion
										key={i}
										defaultExpanded
										className="artists-loading__project-accortion"
									>
										<AccordionSummary
											expandIcon={
												<ExpandMoreIcon className="artists-loading__project-accortion-icon" />
											}
										>
											<Typography
												className="artists-loading__project-name"
												style={{ fontSize: "1.5rem" }}
											>
												{filteredArray[0] as any}
											</Typography>
										</AccordionSummary>
										<AccordionDetails className="artists-loading__project-accortion-details">
											{(
												filteredArray[1] as unknown as ITask[]
											).map((task, i) => {
												return (
													<Task
														key={task.id}
														task={task}
														orderNum={i}
														selected={Boolean(
															selectedTask ===
																task.id,
														)}
														handleClick={
															handleTaskClick
														}
														handleDoubleClickNavigateToTask
													/>
												);
											})}
										</AccordionDetails>
									</Accordion>
								);
							})}
						{selectedArtistId && tasks?.length === 0 && (
							<p className="empty-declaration">
								This artist has no tasks assigned yet...
							</p>
						)}
					</div>
					<div
						className="artists-loading-statistics"
						style={{
							height: isStatisticsOpen ? "50%" : "5%",
							cursor: !isStatisticsOpen ? "pointer" : "auto",
						}}
						onClick={() => {
							!isStatisticsOpen && setIsStatisticsOpen(true);
						}}
					>
						<div
							className="artists-loading-statistics-content"
							style={{
								opacity: isStatisticsOpen ? 1 : 0,
								transform: isStatisticsOpen
									? "translateY(0)"
									: "translateY(10rem)",
							}}
						>
							<KeyboardDoubleArrowDownOutlinedIcon
								className="artists-loading-statistics__close-icon"
								fontSize="large"
								onClick={() => setIsStatisticsOpen(false)}
							/>
							<div className="artists-loading-statistics__left-block">
								<div className="artists-loading-statistics__left-block-item">
									<p className="artists-loading-statistics__left-block-hours">
										Number of tasks:
									</p>
									<p className="artists-loading-statistics__left-block-hours_value">
										{numberOfTasks}
									</p>
								</div>
								<div className="artists-loading-statistics__left-block-item">
									<p className="artists-loading-statistics__left-block-hours">
										Spent Hours:
									</p>
									<p className="artists-loading-statistics__left-block-hours_value">
										{spentHours}
									</p>
								</div>
							</div>
							<div className="artists-loading-statistics__pie-block">
								<ResponsivePie
									data={pieData}
									margin={{
										top: 20,
										right: 40,
										bottom: 20,
										left: 100,
									}}
									theme={{
										tooltip: {
											container: {
												backgroundColor: "black",
											},
										},
									}}
									colors={{ datum: "data.color" }}
									innerRadius={0.1}
									padAngle={0.5}
									cornerRadius={5}
									activeOuterRadiusOffset={10}
									arcLinkLabelsSkipAngle={0}
									arcLinkLabelsTextColor={"#fff"}
									arcLinkLabelsTextOffset={-20}
									arcLabelsTextColor={"#fff"}
								/>
							</div>
						</div>
					</div>
					{!isStatisticsOpen && (
						<KeyboardDoubleArrowUpIcon
							className="artists-loading-statistics__show-icon"
							fontSize="large"
							style={{
								opacity: isShowStatisticsIcon ? 1 : 0,
							}}
							onClick={() => setIsStatisticsOpen(true)}
						/>
					)}
				</div>
			</div>
		</Layout>
	);
};

export default ArtistsLoading;
