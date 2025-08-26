import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { IChildrenComponent } from "@/types/IChildrenComponent";

// STORES
import { useTaskViewStore } from "@/zustand/taskViewStore";
import { useTaskInfoStore } from "@/zustand/taskInfoStore";
import { useTaskDataStore } from "@/zustand/taskDataStore";
import { useProjectDataStore } from "@/zustand/projectDataStore";
import { useProjectPopupStore } from "@/zustand/projectPopupStore";
import { useScenePopupStore } from "@/zustand/scenePopupStore";
import { useTaskPopupStore } from "@/zustand/taskPopupStore";

import Comment from "@/components/Layout/components/TasksBlock/components/Comment/Comment";
import ProjectDescription from "@/components/Layout/components/TasksBlock/components/ProjectDescription/ProjectDescription";

// IMAGES
import structureImage from "@/assets/images/structure.png";
import arrow from "@/assets/images/up-arrow.png";
import info from "@/assets/images/info.png";
import comment from "@/assets/images/comment.png";

const TasksBlock = ({ children }: IChildrenComponent) => {
	const location = useLocation();

	const [createProjectAllowed, setCreateProjectAllowed] =
		useState<boolean>(false);
	const [createSceneAllowed, setCreateSceneAllowed] =
		useState<boolean>(false);
	const [createTaskAllowed, setCreateTaskAllowed] = useState<boolean>(false);

	const [taskLocation, setTaskLocation] = useState<boolean>(false);
	const [projectsLocation, setprojectsLocation] = useState<boolean>(false);

	// TASK DATA STORE
	const taskDdata = useTaskDataStore((state) => state.data);

	// PROJECT DATA STORE
	const projectData = useProjectDataStore((state) => state.data);

	// TASK POPUP STORE
	const setOpenCloseTaskPopup = useTaskPopupStore(
		(state) => state.setOpenClose,
	);

	// PROJECT POPUP STORE
	const setOpenCloseProjectPopup = useProjectPopupStore(
		(state) => state.setOpenClose,
	);

	// SCENE POPUP STORE
	const setOpenCloseScenePopup = useScenePopupStore(
		(state) => state.setOpenClose,
	);

	// TASK INFO STORE
	const taskOpen = useTaskInfoStore((state) => state.isOpen);
	const infoOpenClose = useTaskInfoStore((state) => state.setOpenClose);
	const closeTask = useTaskInfoStore((state) => state.setClose);

	// TASK VIEW STORE
	const handleClick = useTaskViewStore((state) => state.setChange);

	const handleAddButton = () => {
		if (createProjectAllowed) setOpenCloseProjectPopup();
		if (createSceneAllowed) setOpenCloseScenePopup();
		if (createTaskAllowed) setOpenCloseTaskPopup();
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
			setprojectsLocation(true);
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
		<div className="layout-tasksblock">
			<div
				className="layout-tasksblock-left_block"
				style={{
					width: taskOpen ? "50%" : "100%",
				}}
			>
				<div className="layout-tasksblock-menu">
					<button
						className="layout-tasksblock-button"
						onClick={handleAddButton}
					>
						+
					</button>
					<div
						className="layout-structure-icon"
						onClick={handleClick}
						style={{
							backgroundImage: `url(${structureImage})`,
						}}
					></div>
					{/* <button className="layout-tasksblock-button">menu</button> */}
					{/* <button>order</button> */}
					{/* <button>filter</button> */}
					{/* <button>view</button> */}
					<button
						className="layout-tasksblock-button"
						onClick={infoOpenClose}
					>
						<img
							className="layout-tasksblock-button__image"
							src={info}
						/>
					</button>
				</div>
				<div className="layout-tasksblock-ordering">
					<div>Порядок</div>
					<div>Имя</div>
					<div>Статус</div>
					<div>Исполнители</div>
					<div>Приоритет</div>
				</div>
				{children}
			</div>
			<div
				className="layout-tasksblock-right_block"
				style={{
					width: taskOpen ? "100%" : "0",
					opacity: taskOpen ? 1 : 0,
				}}
			>
				<div className="layout-tasksblock-right_block-buttons">
					<div
						className="layout-tasksblock-right_block-hide"
						style={{ backgroundImage: `url(${arrow})` }}
						onClick={closeTask}
					></div>
					<div
						className="layout-tasksblock-right_block-add"
						style={{ backgroundImage: `url(${comment})` }}
					></div>
				</div>
				<div className="layout-info-block">
					{taskDdata &&
						taskLocation &&
						taskDdata.map((data, i) => {
							return <Comment task={data} key={i} />;
						})}
					{projectData && projectsLocation && (
						<ProjectDescription
							description={projectData.description}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default TasksBlock;
