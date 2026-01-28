import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Layout from "@/components/Layout/Layout";
import Shot from "@/components/Shot/Shot";
import Task from "@/components/Task/Task";
import { tasksApi } from "@/routes/tasks.api";

// MUI
import LinearProgress from "@mui/material/LinearProgress";

// STORES
import { useErrorDataStore } from "@/zustand/errorDataStore";
import { useTaskViewStore } from "@/zustand/taskViewStore";
import { useTasksStore } from "@/zustand/tasksStore";
import { useTaskRedirectStore } from "@/zustand/taskRedirectStore";

const Shots = () => {
	const navigate = useNavigate();
	const location = useLocation();

	// TASK VIEW STORE
	const view = useTaskViewStore((state) => state.change);

	// ERROR DATA STORE
	const { setErrorMessage } = useErrorDataStore();

	// TASKS STORE
	const { tasks, setTasks, lastPath, resetTasks } = useTasksStore();

	// TASK REDIRECTED STORE
	const { redirectedTaskId } = useTaskRedirectStore();

	const [selected, setSelected] = useState<number | null>(null);

	const handleClick = (taskId: number) => {
		setSelected(taskId);
	};

	useEffect(() => {
		const path = location.pathname;

		const tasksRequest = async () => {
			const [projectName, sceneName] = path.split("/").slice(-2);
			if (!(projectName && sceneName)) return;
			tasksApi
				.getAllForScene(projectName, sceneName)
				.then((res) => {
					setTasks(res.data, location.pathname);
				})
				.catch((err) => {
					if (err instanceof Error) {
						setErrorMessage(err.message);
						return navigate("/error-page");
					}
					navigate("/not-found");
				});
		};

		if (path !== lastPath) {
			resetTasks();
			tasksRequest();
		}
	}, [lastPath, redirectedTaskId]);

	return (
		<Layout isHeader isStatusline order menu>
			{tasks === null && <LinearProgress />}
			{view
				? tasks &&
				  tasks.map((task, i) => {
						return (
							<Shot
								task={task}
								key={task.id}
								orderNum={i}
								selected={Boolean(selected === task.id)}
								handleClick={handleClick}
							/>
						);
				  })
				: tasks &&
				  tasks.map((task, i) => {
						return (
							<Task
								key={task.id}
								task={task}
								orderNum={i}
								selected={Boolean(selected === task.id)}
								handleClick={handleClick}
							/>
						);
				  })}
			{tasks && tasks.length === 0 && (
				<p className="empty-declaration">No tasks here yet...</p>
			)}
		</Layout>
	);
};

export default Shots;
