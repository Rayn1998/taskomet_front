import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";

import { snackBar } from "@/utils/snackBar";
import { checkLocation } from "@/utils/checkLocation";
// import { api } from "@/routes/Api";

import Title from "@/components/InfoBlock/components/Title/Title";
import Description from "@/components/InfoBlock/components/Description/Description";
import Comment from "@/components/InfoBlock/components/Comment/Comment";
import Media from "@/components/InfoBlock/components/Media/Media";
import Warning from "@/components/Popups/Warning/Warning";

// MUI
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import InsertCommentOutlinedIcon from "@mui/icons-material/InsertCommentOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";

// STORES
import { useAuthStore } from "@/zustand/authStore";
import { useTaskInfoStore } from "@/zustand/taskInfoStore";
import { useProjectsStore } from "@/zustand/projectsStore";
import { useProjectDataStore } from "@/zustand/projectDataStore";
import { useScenesStore } from "@/zustand/scenesStore";
import { useSceneDataStore } from "@/zustand/sceneDataStore";
import { useTasksStore } from "@/zustand/tasksStore";
import { useTaskDataStore } from "@/zustand/taskDataStore";
import { useCreateCommentPopupStore } from "@/components/Popups/CreateComment/CreateCommentPopupStore";

// TYPES
import { EArtistRole } from "@/types/ArtistRole";

const InfoBlock = ({ blockOpen }: { blockOpen: boolean }) => {
	const location = useLocation();

	const [taskLocation, setTaskLocation] = useState<boolean>(false);
	const [myTasksLocation, setMyTasksLocation] = useState<boolean>(false);
	const [sceneLocation, setSceneLocation] = useState<boolean>(false);
	const [projectsLocation, setprojectsLocation] = useState<boolean>(false);
	const [forbiddenComment, setForbiddenComment] = useState<boolean>(false);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const { auth } = useAuthStore();
	const { removeTask } = useTasksStore();
	const { removeProject } = useProjectsStore();
	const { removeScene } = useScenesStore();
	const { setOpenClose: setTaskInfoOpenClose } = useTaskInfoStore();
	const { projectData, relatedProject } = useProjectDataStore();
	useEffect(() => console.log(projectData), [projectData]);
	const { sceneData, relatedScene } = useSceneDataStore();
	const { resetTaskData, taskData, relatedTask } = useTaskDataStore();
	const { setOpenClose: setOpenCloseComment } = useCreateCommentPopupStore();

	const handleDeleteButton = () => {
		setIsModalOpen(!isModalOpen);
	};

	// const handleDelete = () => {
	// 	if (taskLocation && relatedTask) {
	// 		api.deleteTask(relatedTask.id)
	// 			.then((res) => {
	// 				snackBar(
	// 					`Task ${res.name} was deleted successfully!`,
	// 					"success",
	// 					[removeTask.bind(null, res.id), resetTaskData],
	// 				);
	// 			})
	// 			.catch((_) => {
	// 				snackBar("Error while deleting the task", "error");
	// 			});
	// 	}
	// 	if (sceneLocation && relatedScene) {
	// 		api.deleteScene(relatedScene.id)
	// 			.then((_) => {
	// 				snackBar(
	// 					`Scene ${relatedScene.name} was deleted successfully!`,
	// 					"success",
	// 					[
	// 						removeScene.bind(null, relatedScene.id),
	// 						resetTaskData,
	// 					],
	// 				);
	// 			})
	// 			.catch((err) => {
	// 				snackBar("Error while deleting the scene", "error");
	// 			});
	// 	}
	// 	if (projectsLocation && relatedProject) {
	// 		api.deleteProject(relatedProject.id)
	// 			.then((_) => {
	// 				snackBar(
	// 					`Project ${relatedProject.name} was deleted successfully!`,
	// 					"success",
	// 					[
	// 						removeProject.bind(null, relatedProject.id),
	// 						resetTaskData,
	// 					],
	// 				);
	// 			})
	// 			.catch((_) => {
	// 				snackBar("Error while deleting the project", "error");
	// 			});
	// 	}
	// };

	useEffect(() => {
		if ((taskLocation || myTasksLocation) && taskData && relatedTask) {
			setForbiddenComment(false);
		} else {
			setForbiddenComment(false);
		}
	}, [taskLocation, taskData, myTasksLocation, relatedTask]);

	const handleOpenComment = useCallback(() => {
		if (!forbiddenComment) setOpenCloseComment();
	}, [forbiddenComment]);

	useEffect(() => {
		const checkedLocation = checkLocation(location);
		checkedLocation.project && setprojectsLocation(true);
		checkedLocation.scene && setSceneLocation(true);
		checkedLocation.task && setTaskLocation(true);
		checkedLocation.myTasks && setMyTasksLocation(true);
	}, [location]);

	return (
		<div
			className="infoblock"
			style={{
				width: blockOpen ? "100%" : "0",
				opacity: blockOpen ? 1 : 0,
			}}
		>
			<div className="infoblock__block-buttons">
				<ArrowCircleRightOutlinedIcon
					className="infoblock__block-buttons-hide"
					onClick={() => setTaskInfoOpenClose(false)}
				/>
				<InsertCommentOutlinedIcon
					className="infoblock__block-buttons-add"
					onClick={handleOpenComment}
				/>
				{/* <ModeEditOutlineOutlinedIcon className="infoblock__block-buttons-edit-info" /> */}
				{/* {auth && auth.role !== EArtistRole.Artist && (
					// <Warning
					// 	isOpen={isModalOpen}
					// 	setClose={handleDeleteButton}
					// 	cb={handleDelete}
					// >
					// 	<DeleteOutlinedIcon
					// 		className="infoblock__block-buttons-delete"
					// 		onClick={handleDeleteButton}
					// 	/>
					// </Warning>
				)} */}
			</div>
			<div className="infoblock-content">
				{projectData && relatedProject && projectsLocation && (
					<>
						<Title title={relatedProject.name} />
						<Description description={relatedProject.description} />
						{projectData.map((data, i, tasks) => {
							return (
								<Media
									data={data}
									relatedEntityId={relatedProject.id}
									key={i}
								/>
							);
						})}
					</>
				)}
				{sceneData && relatedScene && sceneLocation && (
					<>
						<Title title={relatedScene.name} />
						<Description description={relatedScene.description} />
						{sceneData.map((data, i, tasks) => {
							return (
								<Media
									data={data}
									relatedEntityId={relatedScene.id}
									key={i}
								/>
							);
						})}
					</>
				)}
				{taskData &&
					relatedTask &&
					(taskLocation || myTasksLocation) && (
						<>
							<Title title={relatedTask.name} />
							<Description
								description={relatedTask.description}
							/>
							{taskData.map((data, i, tasks) => {
								const isFirst = i === 0;
								const statusChanged =
									isFirst ||
									data.status !== tasks[i - 1]?.status;
								return (
									<Comment
										statusChanged={statusChanged}
										taskData={data}
										relatedTaskId={relatedTask.id}
										key={i}
									/>
								);
							})}
						</>
					)}
			</div>
		</div>
	);
};

export default InfoBlock;
