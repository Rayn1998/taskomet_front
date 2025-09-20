import { useState, useEffect } from "react";
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
import { useTaskSpentHours } from "@/zustand/taskSpentHoursStore";

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
	const { project, resetData: resetProjectData } = useProjectDataStore();

	// SCENES STORE
	const { removeScene } = useScenesStore();

	// SCENE DATA STORE
	const { scene } = useSceneDataStore();

	// TASK DATA STORE
	const {
		task,
		resetData: resetTaskData,
		removeOneData,
	} = useTaskDataStore();

	// TASKS STORE
	const { removeTask } = useTasksStore();

	// COMMENT STORE
	const { commentData, resetCommentData } = useCommentDataStore();

	// TASK SPENT HOURS STORE
	const { updateHoursData } = useTaskSpentHours();

	const [contextMenu, setContextMenu] = useState<null | IContextMenuData>(
		null,
	);
	const handleContextMenuClose = () => setContextMenu(null);

	const handleProjectDelete = () => {
		if (!project) return;
		api.deleteProject(project.id)
			.then(() => {
				removeProject(project.id);
				resetProjectData();
				setContextMenu(null);
				snackBar(
					`Project ${project.name} was successfully deleted`,
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
		if (!task) return;
		api.deleteTask(task.id).then((deletedTask) => {
			removeTask(deletedTask.id);
			resetTaskData();
			setContextMenu(null);
			snackBar(`Task ${task.name} was successfully deleted`, "success");
		});
	};

	const handleComentDelete = () => {
		if (!commentData) return;

		api.deleteComment(commentData.id)
			.then((res) => {
				if (res) {
					removeOneData(commentData.id);
					updateHoursData({
						taskId: commentData.task_id,
						commentId: commentData.id,
						hours: -Number(commentData.spent_hours),
					});
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
				<MenuItem key="delete" onClick={handleProjectDelete}>
					Delete
				</MenuItem>,
			]}
			{contextMenu?.type === "scene" && [
				<MenuItem key="delete" onClick={handleSceneDelete}>
					Delete
				</MenuItem>,
			]}
			{contextMenu?.type === "task" && [
				<MenuItem key="delete" onClick={handleTaskDelete}>
					Delete
				</MenuItem>,
			]}
			{contextMenu?.type === "comment" && [
				<MenuItem key="delete" onClick={handleComentDelete}>
					Delete
				</MenuItem>,
			]}
		</Menu>
	);
};

export default ContextMenu;
