import { useState, useEffect } from "react";

import Warning from "@/components/Popups/Warning/Warning";

import { api } from "@/utils/Api";
import { snackBar } from "@/utils/snackBar";

// MUI
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// STORES
import { useProjectsStore } from "@/zustand/projectsStore";
import { useProjectDataStore } from "@/zustand/projectDataStore";
import { useScenesStore } from "@/zustand/scenesStore";
import { useSceneDataStore } from "@/zustand/sceneDataStore";
import { useTaskDataStore } from "@/zustand/taskDataStore";
import { useTasksStore } from "@/zustand/tasksStore";
import { useCommentDataStore } from "@/zustand/commentStore";

interface IContextMenuData {
	mouseX: number;
	mouseY: number;
	target: HTMLElement;
	type: string;
}

const ContextMenu = () => {
	// PROJECTS STORE
	const { removeProject } = useProjectsStore();

	// PROJECT DATA STORE
	const { projectData, resetProjectData } = useProjectDataStore();

	// SCENES STORE
	const { removeScene } = useScenesStore();

	// SCENE DATA STORE
	const { scene } = useSceneDataStore();

	// TASK DATA STORE
	const { resetTaskData, removeOneTaskData, relatedTask } =
		useTaskDataStore();

	// TASKS STORE
	const { tasks, removeTask, updateTask } = useTasksStore();

	// COMMENT STORE
	const { commentData, relatedTaskId, resetCommentData } =
		useCommentDataStore();

	// STATES
	const [contextMenu, setContextMenu] = useState<null | IContextMenuData>(
		null,
	);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const handleContextMenuClose = () => setContextMenu(null);

	const handleProjectDelete = () => {
		if (!projectData) return;
		api.deleteProject(projectData.id)
			.then(() => {
				removeProject(projectData.id);
				resetProjectData();
				setContextMenu(null);
				snackBar(
					`Project ${projectData.name} was successfully deleted`,
					"success",
				);
			})
			.catch((err) => console.log(err));
	};

	const handleSceneDelete = () => {
		if (!scene) return;
		api.deleteScene(scene.id).then(() => {
			removeScene(scene.id);
			setContextMenu(null);
			snackBar(`Scene ${scene.name} was successfully deleted`, "success");
		});
	};

	const handleTaskDelete = () => {
		if (!relatedTask) return;

		api.deleteTask(relatedTask.id).then((deletedTask) => {
			removeTask(deletedTask.id);
			resetTaskData();
			setContextMenu(null);
			snackBar(
				`Task ${relatedTask.name} was successfully deleted`,
				"success",
			);
		});
	};

	const handleComentDelete = () => {
		if (!commentData || !relatedTaskId) return;

		api.deleteComment(commentData.id)
			.then((res) => {
				if (res) {
					const deletedHours = commentData.spent_hours;
					if (deletedHours) {
						const relatedTask = tasks?.find(
							(task) => task.id === relatedTaskId,
						)!;
						const newHours = relatedTask.spent_hours - deletedHours;
						const newTask = {
							...relatedTask,
							spent_hours: newHours,
						};
						updateTask(newTask);
					}
					removeOneTaskData(commentData.id);
					resetCommentData();
					setContextMenu(null);
					snackBar("Comment was successfully deleted", "success");
				} else {
					throw new Error("Can't delete comment");
				}
			})
			.catch((err) => {
				snackBar(err.message, "error");
			});
	};

	useEffect(() => {
		const handleContextMenu = (e: globalThis.MouseEvent) => {
			e.preventDefault();

			const target = (e.target as HTMLElement).closest("[data-type]");
			if (!target) return;

			const dataType = target.getAttribute("data-type")!;

			setContextMenu({
				mouseX: e.clientX + 6,
				mouseY: e.clientY - 6,
				target: e.target as HTMLElement,
				type: dataType,
			});
		};

		document.addEventListener("contextmenu", handleContextMenu);
		return () =>
			document.removeEventListener("contextmenu", handleContextMenu);
	}, []);
	return (
		<Menu
			id="context-menu"
			open={contextMenu !== null}
			onClose={handleContextMenuClose}
			anchorReference="anchorPosition"
			anchorPosition={
				contextMenu !== null
					? { top: contextMenu.mouseY, left: contextMenu.mouseX }
					: undefined
			}
		>
			{contextMenu?.type === "project" && [
				<Warning
					key={contextMenu.type}
					isOpen={isModalOpen}
					setClose={() => {
						setIsModalOpen(false);
						setContextMenu(null);
					}}
					cb={handleProjectDelete}
				>
					<MenuItem key="delete" onClick={() => setIsModalOpen(true)}>
						Delete
					</MenuItem>
				</Warning>,
			]}
			{contextMenu?.type === "scene" && [
				<Warning
					key={contextMenu.type}
					isOpen={isModalOpen}
					cb={handleSceneDelete}
					setClose={() => {
						setIsModalOpen(false);
						setContextMenu(null);
					}}
				>
					<MenuItem key="delete" onClick={() => setIsModalOpen(true)}>
						Delete
					</MenuItem>
				</Warning>,
			]}
			{contextMenu?.type === "task" && [
				<Warning
					key={contextMenu.type}
					isOpen={isModalOpen}
					cb={handleTaskDelete}
					setClose={() => {
						setIsModalOpen(false);
						setContextMenu(null);
					}}
				>
					<MenuItem key="delete" onClick={() => setIsModalOpen(true)}>
						Delete
					</MenuItem>
				</Warning>,
				,
			]}
			{contextMenu?.type === "comment" && [
				<Warning
					key={contextMenu.type}
					isOpen={isModalOpen}
					cb={handleComentDelete}
					setClose={() => {
						setIsModalOpen(false);
						setContextMenu(null);
					}}
				>
					<MenuItem key="delete" onClick={() => setIsModalOpen(true)}>
						Delete
					</MenuItem>
				</Warning>,
			]}
		</Menu>
	);
};

export default ContextMenu;
