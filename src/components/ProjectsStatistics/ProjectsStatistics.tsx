import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Layout from "@/components/Layout/Layout";
import ListItemsBlock from "@/components/ListItemsBlock/ListItemsBlock";

import { api } from "@/routes/Api";
import { snackBar } from "@/utils/snackBar";

// NIVO
import { ResponsivePie } from "@nivo/pie";

// MUI
import LinearProgress from "@mui/material/LinearProgress";

// STORES
import { useProjectsStore } from "@/zustand/projectsStore";
import { useTasksStore } from "@/zustand/tasksStore";
import { useTaskInfoStore } from "@/zustand/taskInfoStore";

// TYPES
import { EStatus, StatusLabels, StatusColors } from "@/types/Status";

const ProjectsStatistics = () => {
	const location = useLocation();

	// PROJECTS STORE
	const { projects, setProjects } = useProjectsStore();

	// TASKS STORE
	const { tasks, setTasks, resetTasks } = useTasksStore();

	// TASK INFO STORE
	const { setOpenClose: setInfoBlockOpenClose } = useTaskInfoStore();

	const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
		null,
	);
	const [numberOfTasks, setNumberOfTasks] = useState<number | null>(null);
	const [spentHours, setSpentHours] = useState<number | null>(null);
	const [pieData, setPieData] = useState<{ id: string; value: number }[]>([]);

	const handleClick = (id: number) => {
		setSelectedProjectId(id);
	};

	useEffect(() => setInfoBlockOpenClose(false), []);

	useEffect(() => {
		if (projects === null) {
			api.getProjects()
				.then(setProjects)
				.catch(() => snackBar("Can't get projects...", "error"));
		}
	}, [projects]);

	useEffect(() => {
		if (!selectedProjectId) return;

		resetTasks();
		api.getAllTasks(selectedProjectId)
			.then((tasks) => {
				setTasks(tasks, location.pathname);
			})
			.catch((err) => {
				snackBar("Can't get data...", "error");
			});
	}, [selectedProjectId]);

	useEffect(() => {
		if (tasks && selectedProjectId) {
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
	}, [tasks, selectedProjectId]);

	return (
		<Layout isHeader canvas>
			<div className="projects-statistics">
				<div className="projects-statistics-projects-list">
					<ListItemsBlock
						items={projects}
						selectedItemId={selectedProjectId}
						handleSelectItem={handleClick}
					/>
				</div>
				{!selectedProjectId && !tasks && (
					<div className="projects-statistics-empty">
						<p className="empty-declaration">
							There are no tasks in this project
						</p>
					</div>
				)}
				{selectedProjectId && !tasks && (
					<LinearProgress style={{ width: "70%" }} />
				)}
				{tasks && tasks.length > 0 && (
					<div className="projects-statistics-pie">
						<div className="projects-statistics-pie-text-wrapper">
							{selectedProjectId && (
								<div className="projects-statistics-pie-text">
									<div className="projects-statistics-pie-text-block-item">
										<p className="projects-statistics-pie-text-data">
											Amount of tasks:
										</p>
										<p className="projects-statistics-pie-text-data_value">
											{numberOfTasks}
										</p>
									</div>
									<div className="projects-statistics-pie-text-block-item">
										<p className="projects-statistics-pie-text-data">
											Spent Hours:
										</p>
										<p className="projects-statistics-pie-text-data_value">
											{spentHours}
										</p>
									</div>
								</div>
							)}
						</div>
						<div className="projects-statistics-pie-wrapper">
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
				)}
			</div>
		</Layout>
	);
};

export default ProjectsStatistics;
