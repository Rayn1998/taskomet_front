import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Layout from "@/components/Layout/Layout";
import AccordionItemsBlock from "@/components/AccordionItemsBlock/AccordionItemsBlock";
import ListItemsBlock from "@/components/ListItemsBlock/ListItemsBlock";
import StatisticBlock from "@/components/StatisticBlock/StatisticBlock";

import { api } from "@/utils/Api";

//STORES
import { useArtistStore } from "@/zustand/artistStore";
import { useTaskInfoStore } from "@/zustand/taskInfoStore";
import { useTasksStore } from "@/zustand/tasksStore";

// TYPES
import ITask from "@shared/types/Task";

const ArtistsLoading = () => {
	const location = useLocation();

	// TASK INFO STORE
	const { setOpenClose: setTaskInfoOpenClose } = useTaskInfoStore();

	// ARTISTS STORE
	const { artists } = useArtistStore();

	// TASKSK STORE
	const { tasks, setTasks, resetTasks, removeTask } = useTasksStore();

	// STATES
	const [selectedArtistId, setSelectedArtistId] = useState<number | null>(
		null,
	);
	const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
	// const [isStatisticsOpen, setIsStatisticsOpen] = useState<boolean>(false);
	const [filteredByProjectTasks, setFilteredByProjectTasks] = useState<
		[string, ITask[]][] | null
	>(null);

	const handleSelectArtist = useCallback(
		(id: number) => {
			if (id === selectedArtistId) return;
			console.log("here");
			setFilteredByProjectTasks(null);
			setSelectedArtistId(id);
			resetTasks();
			api.getMyTasks(id)
				.then((tasks) => {
					console.log("request");
					setTasks(tasks, location.pathname);
				})
				.catch((err) => console.log(err));
		},
		[selectedArtistId],
	);

	const handleTaskClick = (taskId: number) => {
		setSelectedTaskId(taskId);
	};

	// Закрывает Infoblock как только заходим на эту страницу
	useEffect(() => {
		setTaskInfoOpenClose(false);
	}, []);

	// Фильтр тасков по выбранному артисту, если исполнитель был изменён на этой странице
	useEffect(() => {
		if (tasks) {
			if (!selectedArtistId) resetTasks();

			for (const task of tasks) {
				selectedArtistId !== task.executor && removeTask(task.id);
			}
		}
	}, [tasks, selectedArtistId]);

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
				<ListItemsBlock
					items={artists}
					selectedItemId={selectedArtistId}
					handleSelectItem={handleSelectArtist}
				/>
				<div className="artists-loading-tasks-block">
					<div className="artists-loading-tasks">
						<AccordionItemsBlock<ITask>
							selectedEntityId={selectedArtistId}
							noEntitySelectedText="Select an artist to get his tasks assigned"
							noItemsForSelectedEntityText="This artist has no tasks assigned yet..."
							selectedItemId={selectedTaskId}
							handleItemClick={handleTaskClick}
							itemsArray={filteredByProjectTasks}
							// blockStyle={{ width: "100%" }}
						/>
					</div>
					<StatisticBlock />
				</div>
			</div>
		</Layout>
	);
};

export default ArtistsLoading;
