import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Layout from "@/components/Layout/Layout";
import AccordionItemsBlock from "@/components/AccordionItemsBlock/AccordionItemsBlock";

import { api } from "@/routes/Api";

// STORES
import { useTasksStore } from "@/zustand/tasksStore";
import { useAuthStore } from "@/zustand/authStore";

// TYPES
import type ITask from "@shared/types/Task";

const MyTasks = () => {
	const location = useLocation();

	// TASKS STORE
	const { tasks, setTasks, lastPath, resetTasks } = useTasksStore();

	// AUTH STORE
	const { auth } = useAuthStore();

	const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
	const [filteredByProjectTasks, setFilteredByProjectTasks] = useState<
		[string, ITask[]][] | null
	>(null);

	const handleClick = (taskId: number) => {
		setSelectedTaskId(taskId);
	};

	useEffect(() => {
		if (auth !== null && !tasks) {
			const id = auth.id;
			api.getMyTasks(id)
				.then((tasks) => {
					setTasks(tasks, location.pathname);
				})
				.catch((err) => console.error(err));
		}
	}, [auth, tasks]);

	useEffect(() => {
		if (!tasks) return;

		if (auth !== null && location.pathname !== lastPath) {
			resetTasks();
			return;
		}

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
	}, [tasks, auth, location.pathname]);
	return (
		<Layout isHeader order menu>
			<div className="my-tasks-content">
				<AccordionItemsBlock<ITask>
					selectedEntityId={-1}
					noEntitySelectedText="Select an artist to get his tasks assigned"
					noItemsForSelectedEntityText="This artist has no tasks assigned yet..."
					selectedItemId={selectedTaskId}
					handleItemClick={handleClick}
					itemsArray={filteredByProjectTasks}
					handleDoubleClickNavigateToTask={false}
				/>
			</div>
		</Layout>
	);
};

export default MyTasks;
