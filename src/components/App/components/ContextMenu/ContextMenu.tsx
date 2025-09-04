import { useState, useEffect } from "react";
import { useSnackbar, closeSnackbar } from "notistack";
import { api } from "@/utils/Api";

// MUI
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

// STORES
import { useProjectsStore } from "@/zustand/projectsStore";
import { useProjectDataStore } from "@/zustand/projectDataStore";
import { useScenesStore } from "@/zustand/scenesStore";
import { useSceneDataStore } from "@/zustand/sceneDataStore";
import { useTaskDataStore } from "@/zustand/taskDataStore";
import { useTasksStore } from "@/zustand/tasksStore";

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
	const { task, resetData: resetTaskData } = useTaskDataStore();

	// TASKS STORE
	const { removeTask } = useTasksStore();

	// SNACKBAR
	const { enqueueSnackbar } = useSnackbar();

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
				const snackBarId = enqueueSnackbar(
					`Project ${project.name} was successfully deleted`,
					{
						variant: "success",
						action: (
							<IconButton
								onClick={() => closeSnackbar(snackBarId)}
							>
								<CloseIcon />
							</IconButton>
						),
					},
				);
			})
			.catch((err) => console.log(err));
	};

	const handleSceneDelete = () => {
		if (!scene) return;
		api.deleteScene(scene.id).then(() => {
			removeScene(scene.id);
			setContextMenu(null);
			const snackBarId = enqueueSnackbar(
				`Scene ${scene.name} was successfully deleted`,
				{
					variant: "success",
					action: (
						<IconButton onClick={() => closeSnackbar(snackBarId)}>
							<CloseIcon />
						</IconButton>
					),
				},
			);
		});
	};

	const handleTaskDelete = () => {
		if (!task) return;
		api.deleteTask(task.id).then((deletedTask) => {
			removeTask(deletedTask.id);
			resetTaskData();
			setContextMenu(null);
			const snackBarId = enqueueSnackbar(
				`Task ${task.name} was successfully deleted`,
				{
					variant: "success",
					action: (
						<IconButton onClick={() => closeSnackbar(snackBarId)}>
							<CloseIcon />
						</IconButton>
					),
				},
			);
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
		</Menu>
	);
};

export default ContextMenu;
