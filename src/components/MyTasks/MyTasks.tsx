import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Layout from "@/components/Layout/Layout";
import Task from "@/components/Task/Task";

import { api } from "@/utils/Api";

// MUI
import LinearProgress from "@mui/material/LinearProgress";

// STORES
import { useTasksStore } from "@/zustand/tasksStore";
import { useAuthStore } from "@/zustand/authStore";

const MyTasks = () => {
	const location = useLocation();

	// TASKS STORE
	const { tasks, setTasks, lastPath, resetTasks } = useTasksStore();

	// AUTH STORE
	const { auth } = useAuthStore();

	const [selected, setSelected] = useState<string>("");

	const handleClick = (name: string) => {
		setSelected(name);
	};

	useEffect(() => {
		if (
			(auth !== null && location.pathname !== lastPath) ||
			(auth !== null && !tasks)
		) {
			resetTasks();
			api.getMyTasks(auth.id)
				.then((tasks) => {
					setTasks(tasks, location.pathname);
				})
				.catch((err) => console.error(err));
		}
	}, [auth, lastPath, location.pathname]);
	return (
		<Layout isHeader order menu>
			<div className="itemsblock-list">
				{tasks === null && <LinearProgress />}
				{tasks &&
					tasks.map((task, i) => {
						return (
							<Task
								key={task.id}
								task={task}
								orderNum={i}
								selected={Boolean(selected === task.name)}
								handleClick={handleClick}
							/>
						);
					})}
				{tasks?.length === 0 && (
					<p className="empty-declaration">
						You don't have any tasks assigned yet...
					</p>
				)}
			</div>
		</Layout>
	);
};

export default MyTasks;
