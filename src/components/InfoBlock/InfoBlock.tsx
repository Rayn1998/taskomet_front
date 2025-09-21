import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { snackBar } from "@/utils/snackBar";
import { checkLocation } from "@/utils/checkLocation";
import { api } from "@/utils/Api";

import Title from "@/components/InfoBlock/components/Title/Title";
import Description from "@/components/InfoBlock/components/Description/Description";
import Comment from "@/components/InfoBlock/components/Comment/Comment";

// STORES
import { useTaskInfoStore } from "@/zustand/taskInfoStore";
import { useProjectsStore } from "@/zustand/projectsStore";
import { useProjectDataStore } from "@/zustand/projectDataStore";
import { useScenesStore } from "@/zustand/scenesStore";
import { useSceneDataStore } from "@/zustand/sceneDataStore";
import { useTasksStore } from "@/zustand/tasksStore";
import { useTaskDataStore } from "@/zustand/taskDataStore";
import { useCreateCommentPopupStore } from "@/components/Popups/CreateComment/CreateCommentPopupStore";

// IMAGES
import arrow from "@/assets/images/up-arrow.png";
import trash from "@/assets/images/delete.png";
import comment from "@/assets/images/comment.png";

// TYPES
import type ITask from "@shared/types/Task";
import { TypeOfData } from "@/types/TypeOfData";
import { EStatus } from "@/types/Status";
import { formatSQLTimestamp } from "@/utils/formatSQLTimestamp";

const InfoBlock = ({ blockOpen }: { blockOpen: boolean }) => {
	const location = useLocation();

	const [taskLocation, setTaskLocation] = useState<boolean>(false);
	const [myTasksLocation, setMyTasksLocation] = useState<boolean>(false);
	const [sceneLocation, setSceneLocation] = useState<boolean>(false);
	const [projectsLocation, setprojectsLocation] = useState<boolean>(false);
	const [forbiddenComment, setForbiddenComment] = useState<boolean>(false);
	const [relatedToDataTask, setRelatedToDataTask] = useState<ITask | null>(
		null,
	);

	const { tasks, removeTask } = useTasksStore();
	const { removeProject } = useProjectsStore();
	const { removeScene } = useScenesStore();
	const { setClose: closeTask } = useTaskInfoStore();
	const { projectData } = useProjectDataStore();
	const { data: sceneData, scene } = useSceneDataStore();
	const { resetTaskData, taskData } = useTaskDataStore();
	const { setOpenClose: setOpenCloseComment } = useCreateCommentPopupStore();

	// useEffect(() => {
	// 	if (taskData.length === 0) {
	// 		api.updateTaskStatus({
	// 			type: TypeOfData.Status,
	// 			task_id: taskData[0].task_id,
	// 			created_at: formatSQLTimestamp(new Date()),
	// 			created_by: 1,
	// 			status: EStatus.NoStatus,
	// 			spent_hours: null,
	// 		});
	// 	}
	// }, [taskData]);

	const handleDeleteButton = () => {
		const relatedToDataTask = tasks.find(
			(task) => task.id === taskData[0].task_id,
		);
		if (taskLocation && relatedToDataTask) {
			api.deleteTask(relatedToDataTask.id)
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
		if ((taskLocation || myTasksLocation) && taskData.length > 0) {
			setForbiddenComment(false);
			const relatedTask = tasks.find(
				(task) => task.id === taskData[0].task_id,
			);
			if (relatedTask) setRelatedToDataTask(relatedTask);
		} else {
			setForbiddenComment(true);
		}
	}, [taskLocation, taskData, myTasksLocation]);

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
			className="itemsblock-right_block"
			style={{
				width: blockOpen ? "100%" : "0",
				opacity: blockOpen ? 1 : 0,
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
					style={{
						backgroundImage: `url(${comment})`,
						opacity: forbiddenComment ? 0.5 : 1,
					}}
					onClick={handleOpenComment}
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
					relatedToDataTask &&
					(taskLocation || myTasksLocation) && (
						<>
							<Title title={relatedToDataTask.name} />
							<Description
								description={relatedToDataTask.description}
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
										relatedTaskId={relatedToDataTask.id}
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
