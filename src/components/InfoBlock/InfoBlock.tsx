import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";

import { snackBar } from "@/utils/snackBar";
import { checkLocation } from "@/utils/checkLocation";
import { api } from "@/utils/Api";

import Title from "@/components/InfoBlock/components/Title/Title";
import Description from "@/components/InfoBlock/components/Description/Description";
import Comment from "@/components/InfoBlock/components/Comment/Comment";

// MUI
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import InsertCommentOutlinedIcon from "@mui/icons-material/InsertCommentOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

// STORES
import { useTaskInfoStore } from "@/zustand/taskInfoStore";
import { useProjectsStore } from "@/zustand/projectsStore";
import { useProjectDataStore } from "@/zustand/projectDataStore";
import { useScenesStore } from "@/zustand/scenesStore";
import { useSceneDataStore } from "@/zustand/sceneDataStore";
import { useTasksStore } from "@/zustand/tasksStore";
import { useTaskDataStore } from "@/zustand/taskDataStore";
import { useCreateCommentPopupStore } from "@/components/Popups/CreateComment/CreateCommentPopupStore";

const InfoBlock = ({ blockOpen }: { blockOpen: boolean }) => {
	const location = useLocation();

	const [taskLocation, setTaskLocation] = useState<boolean>(false);
	const [myTasksLocation, setMyTasksLocation] = useState<boolean>(false);
	const [sceneLocation, setSceneLocation] = useState<boolean>(false);
	const [projectsLocation, setprojectsLocation] = useState<boolean>(false);
	const [forbiddenComment, setForbiddenComment] = useState<boolean>(false);

	const { removeTask } = useTasksStore();
	const { removeProject } = useProjectsStore();
	const { removeScene } = useScenesStore();
	const { setOpenClose: setTaskInfoOpenClose } = useTaskInfoStore();
	const { projectData } = useProjectDataStore();
	const { data: sceneData, scene } = useSceneDataStore();
	const { resetTaskData, taskData, relatedTask } = useTaskDataStore();
	const { setOpenClose: setOpenCloseComment } = useCreateCommentPopupStore();

	const handleDeleteButton = () => {
		if (taskLocation && relatedTask) {
			api.deleteTask(relatedTask.id)
				.then((res) => {
					snackBar(
						`Task ${res.name} was deleted successfully!`,
						"success",
						[removeTask.bind(null, res.id), resetTaskData],
					);
				})
				.catch((err) => {
					snackBar("Error while deleting the task", "error");
				});
		}
		if (sceneLocation && scene) {
			api.deleteScene(scene.id)
				.then((_) => {
					snackBar(
						`Scene ${scene.name} was deleted successfully!`,
						"success",
						[removeScene.bind(null, scene.id), resetTaskData],
					);
				})
				.catch((err) => {
					snackBar("Error while deleting the scene", "error");
				});
		}
		if (projectsLocation && projectData) {
			api.deleteProject(projectData.id)
				.then((_) => {
					snackBar(
						`Project ${projectData.name} was deleted successfully!`,
						"success",
						[
							removeProject.bind(null, projectData.id),
							resetTaskData,
						],
					);
				})
				.catch((err) => {
					snackBar("Error while deleting the project", "error");
				});
		}
	};

	useEffect(() => {
		if ((taskLocation || myTasksLocation) && taskData && relatedTask) {
			setForbiddenComment(false);
		} else {
			setForbiddenComment(true);
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
				<DeleteOutlinedIcon
					className="infoblock__block-buttons-delete"
					onClick={handleDeleteButton}
				/>
			</div>
			<div className="infoblock-content">
				{projectData && projectsLocation && (
					<>
						<Title title={projectData.name} />
						<Description description={projectData.description} />
					</>
				)}
				{sceneData && sceneLocation && (
					<>
						<Title title={sceneData.name} />
						<Description description={sceneData.description} />
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
