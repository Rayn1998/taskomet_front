import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useSnackbar, closeSnackbar } from "notistack";
import { IChildrenComponent } from "@/types/IChildrenComponent";

// MUI
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

// STORES
import { useTasksStore } from "@/zustand/tasksStore";
import { useScenesStore } from "@/zustand/scenesStore";
import { useProjectsStore } from "@/zustand/projectsStore";
import { useTaskViewStore } from "@/zustand/taskViewStore";
import { useTaskInfoStore } from "@/zustand/taskInfoStore";
import { useTaskDataStore } from "@/zustand/taskDataStore";
import { useProjectDataStore } from "@/zustand/projectDataStore";
import { useCreateProjectPopupStore } from "@/components/Popups/CreateProject/CreateProjectPopupStore";
import { useCreateScenePopupStore } from "@/components/Popups/CreateScene/CreateScenePopupStore";
import { useCreateTaskPopupStore } from "@/components/Popups/CreateTask/CreateTaskPopupStore";
import { useSceneDataStore } from "@/zustand/sceneDataStore";
import { useCreateCommentPopupStore } from "@/components/Popups/CreateComment/CreateCommentPopupStore";

import Title from "@/components/Layout/components/ItemsBlock/components/Title/Title";
import Description from "@/components/Layout/components/ItemsBlock/components/Description/Description";
import Comment from "@/components/Layout/components/ItemsBlock/components/Comment/Comment";
import { api } from "@/utils/Api";

// IMAGES
import trash from "@/assets/images/delete.png";
import structureImage from "@/assets/images/structure.png";
import arrow from "@/assets/images/up-arrow.png";
import info from "@/assets/images/info.png";
import comment from "@/assets/images/comment.png";

const ItemsBlock = ({ children }: IChildrenComponent) => {
	const location = useLocation();

	const [createProjectAllowed, setCreateProjectAllowed] =
		useState<boolean>(false);
	const [createSceneAllowed, setCreateSceneAllowed] =
		useState<boolean>(false);
	const [createTaskAllowed, setCreateTaskAllowed] = useState<boolean>(false);

	const [taskLocation, setTaskLocation] = useState<boolean>(false);
	const [sceneLocation, setSceneLocation] = useState<boolean>(false);
	const [projectsLocation, setprojectsLocation] = useState<boolean>(false);

	// TASKS STORE
	const { removeTask } = useTasksStore();

	// SCENES STORE
	const { removeScene } = useScenesStore();

	// PROJECTS STORE
	const { removeProject } = useProjectsStore();

	// TASK DATA STORE
	const {
		data: taskData,
		task: taskDataTask,
		resetData: resetTaskData,
	} = useTaskDataStore();

	// SCENE DATA STORE
	const { data: sceneData, scene } = useSceneDataStore();

	// PROJECT DATA STORE
	const { data: projectData, project } = useProjectDataStore();

	// TASK POPUP STORE
	const { setOpenClose: setOpenCloseTaskPopup } = useCreateTaskPopupStore();

	// PROJECT POPUP STORE
	const { setOpenClose: setOpenCloseProjectPopup } =
		useCreateProjectPopupStore();

	// SCENE POPUP STORE
	const { setOpenClose: setOpenCloseScenePopup } = useCreateScenePopupStore();

	// TASK INFO STORE
	const {
		isOpen: taskOpen,
		setOpenClose: infoOpenClose,
		setClose: closeTask,
	} = useTaskInfoStore();

	// TASK VIEW STORE
	const handleClick = useTaskViewStore((state) => state.setChange);

	// CREATE COMMENT STORE
	const { setOpenClose: setOpenCloseComment } = useCreateCommentPopupStore();

	// SNACKBAR
	const { enqueueSnackbar } = useSnackbar();

	const handleAddButton = () => {
		if (createProjectAllowed) setOpenCloseProjectPopup();
		if (createSceneAllowed) setOpenCloseScenePopup();
		if (createTaskAllowed) setOpenCloseTaskPopup();
	};

	const handleDeleteButton = () => {
		if (taskLocation && taskDataTask) {
			api.deleteTask(taskDataTask.id)
				.then((res) => {
					const snackBarId = enqueueSnackbar(
						`Task ${res.name} was deleted successfully!`,
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
					removeTask(res.id);
					resetTaskData();
				})
				.catch((err) => {
					const snackBarId = enqueueSnackbar(
						`There was an error, ${err.message}`,
						{
							variant: "error",
							action: (
								<IconButton
									onClick={() => closeSnackbar(snackBarId)}
								>
									<CloseIcon />
								</IconButton>
							),
						},
					);
				});
		}
		if (sceneLocation && scene) {
			api.deleteScene(scene.id)
				.then((res) => {
					const snackBarId = enqueueSnackbar(
						`Scene ${scene.name} was deleted successfully!`,
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
					removeScene(scene.id);
					resetTaskData();
				})
				.catch((err) => {
					const snackBarId = enqueueSnackbar(
						`There was an error, ${err.message}`,
						{
							variant: "error",
							action: (
								<IconButton
									onClick={() => closeSnackbar(snackBarId)}
								>
									<CloseIcon />
								</IconButton>
							),
						},
					);
				});
		}
		if (projectsLocation && project) {
			api.deleteProject(project.id)
				.then((res) => {
					const snackBarId = enqueueSnackbar(
						`Scene ${project.name} was deleted successfully!`,
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
					removeProject(project.id);
					resetTaskData();
				})
				.catch((err) => {
					const snackBarId = enqueueSnackbar(
						`There was an error, ${err.message}`,
						{
							variant: "error",
							action: (
								<IconButton
									onClick={() => closeSnackbar(snackBarId)}
								>
									<CloseIcon />
								</IconButton>
							),
						},
					);
				});
		}
	};

	useEffect(() => {
		if (
			location.pathname.split("/").filter((item) => item !== "")
				.length === 1
		) {
			setCreateProjectAllowed(true);
			setprojectsLocation(true);
		} else {
			setCreateProjectAllowed(false);
		}

		if (
			location.pathname.split("/").filter((item) => item !== "")
				.length === 2
		) {
			setCreateSceneAllowed(true);
			setSceneLocation(true);
		} else {
			setCreateSceneAllowed(false);
		}

		if (location.pathname.split("/").slice(2).length >= 2) {
			setTaskLocation(true);
			setCreateTaskAllowed(true);
		} else {
			setCreateTaskAllowed(false);
		}
	}, [location]);

	return (
		<div className="itemsblock">
			<div
				className="itemsblock-left_block"
				style={{
					width: taskOpen ? "50%" : "100%",
				}}
			>
				<div className="itemsblock-menu">
					<button
						className="itemsblock-button"
						onClick={handleAddButton}
					>
						+
					</button>
					<div
						className="itemsblock-structure-icon"
						onClick={handleClick}
						style={{
							backgroundImage: `url(${structureImage})`,
						}}
					></div>
					{/* <button className="itemsblock-button">menu</button> */}
					{/* <button>order</button> */}
					{/* <button>filter</button> */}
					{/* <button>view</button> */}
					<button
						className="itemsblock-button"
						onClick={infoOpenClose}
					>
						<img className="itemsblock-button__image" src={info} />
					</button>
				</div>
				<div className="itemsblock-ordering">
					<div>Порядок</div>
					<div>Имя</div>
					<div>Статус</div>
					<div>Исполнители</div>
					<div>Приоритет</div>
				</div>
				{children}
			</div>
			<div
				className="itemsblock-right_block"
				style={{
					width: taskOpen ? "100%" : "0",
					opacity: taskOpen ? 1 : 0,
				}}
			>
				<div className="itemsblock-right_block-buttons">
					<div
						className="itemsblock-right_block-hide"
						style={{ backgroundImage: `url(${arrow})` }}
						onClick={closeTask}
					></div>
					<div
						className="itemsblock-right_block-add"
						style={{ backgroundImage: `url(${comment})` }}
						onClick={setOpenCloseComment}
					></div>
					<div
						className="itemsblock-right_block-delete"
						style={{ backgroundImage: `url(${trash})` }}
						onClick={handleDeleteButton}
					></div>
				</div>
				<div className="itemsblock-info-block">
					{projectData && projectsLocation && (
						<>
							<Title title={projectData.name} />
							<Description
								description={projectData.description}
							/>
						</>
					)}
					{sceneData && sceneLocation && (
						<>
							<Title title={sceneData.name} />
							<Description description={sceneData.description} />
						</>
					)}
					{taskData && taskDataTask && taskLocation && (
						<>
							<Title title={taskDataTask.name} />
							<Description
								description={taskDataTask.description}
							/>
							{taskData.map((task, i) => (
								<Comment task={task} key={i} />
							))}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default ItemsBlock;
