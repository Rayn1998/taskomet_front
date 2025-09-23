import { useEffect, useState } from "react";

import Layout from "@/components/Layout/Layout";
import Task from "@/components/Task/Task";

import { api } from "@/utils/Api";

// STORES
import { useTasksStore } from "@/zustand/tasksStore";
import { useAuthStore } from "@/zustand/authStore";

const MyTasks = () => {
	// TASKS STORE
	const { tasks, setTasks } = useTasksStore();

	// AUTH STORE
	const { auth } = useAuthStore();

	const [selected, setSelected] = useState<string>("");

	const handleClick = (name: string) => {
		setSelected(name);
	};

	useEffect(() => {
		if (auth !== null) {
			api.getMyTasks(auth.id)
				.then((tasks) => {
					setTasks(tasks);
				})
				.catch((err) => console.error(err));
		}
	}, [auth]);
	return (
		<Layout isHeader order menu>
			<div className="itemsblock-list">
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
			</div>
		</Layout>
	);
};

export default MyTasks;
