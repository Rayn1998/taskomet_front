import { useEffect, useState } from "react";

import Layout from "@/components/Layout/Layout";
import Task from "@/components/Task/Task";

import { api } from "@/utils/Api";

// STORES
import { useTasksStore } from "@/zustand/tasksStore";

const MyTasks = () => {
	// TASKS STORE
	const { tasks, setTasks } = useTasksStore();

	const [selected, setSelected] = useState<string>("");

	const handleClick = (name: string) => {
		setSelected(name);
	};

	useEffect(() => {
		api.getMyTasks(1)
			.then((tasks) => {
				setTasks(tasks);
			})
			.catch((err) => console.error(err));
	}, []);
	return (
		<Layout>
			<div className="itemsblock-list">
				{tasks &&
					tasks.map((shot, i) => {
						return (
							<Task
								key={shot.id}
								task={shot}
								orderNum={i}
								selected={Boolean(selected === shot.name)}
								handleClick={handleClick}
							/>
						);
					})}
			</div>
		</Layout>
	);
};

export default MyTasks;
