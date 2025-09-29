import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Layout from "@/components/Layout/Layout";
import AccordionItemsBlock from "@/components/AccordionItemsBlock/AccordionItemsBlock";
import ListItemsBlock from "@/components/ListItemsBlock/ListItemsBlock";
// import Task from "@/components/Task/Task";

import { api } from "@/utils/Api";

// STORES
import { useTasksStore } from "@/zustand/tasksStore";
import { useAuthStore } from "@/zustand/authStore";

// TYPES
import type ITask from "@shared/types/Task";

const MyTasks = () => {
	const location = useLocation();

	// PROJECTS STORE
	// const { projects } = use

	// TASKS STORE
	const { tasks, setTasks, lastPath, resetTasks } = useTasksStore();

	// AUTH STORE
	const { auth } = useAuthStore();

	const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
		null,
	);
	const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
	const [filteredByProjectTasks, setFilteredByProjectTasks] = useState<
		[string, ITask[]][] | null
	>(null);

	const handleClick = (taskId: number) => {
		setSelectedTaskId(taskId);
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
		<Layout isHeader order menu>
			<div className="my-tasks-content">
				{/* <ListItemsBlock 

				/> */}
				{/* <div className="my-tasks-projects-list"> */}
				{/* {filteredByProjectTasks?.map((filteredArray, i) => {
						return(
							filteredArray[0].map(project => {
								return <
							})
						)
					})} */}
				{/* </div> */}
				<div className="itemsblock-list">
					<AccordionItemsBlock
						selectedEntityId={selectedProjectId}
						selectedItemId={selectedTaskId}
						noEntitySelectedText="Select project to see assigned tasks"
						handleItemClick={handleClick}
						itemsArray={filteredByProjectTasks}
					/>
				</div>
			</div>
		</Layout>
	);
};

export default MyTasks;
