import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";

import { snackBar } from "@/utils/snackBar";
import { checkLocation } from "@/components/Layout/utils/checkLocation";
import { api } from "@/utils/Api";

import Title from "@/components/Layout/components/ItemsBlock/components/Title/Title";
import Description from "@/components/Layout/components/ItemsBlock/components/Description/Description";
import Comment from "@/components/Layout/components/ItemsBlock/components/Comment/Comment";

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
import { TypeOfData } from "@/types/TypeOfData";
import { EStatus } from "@/types/Status";
import { formatSQLTimestamp } from "@/utils/formatSQLTimestamp";

const InfoBlock = ({ blockOpen }: { blockOpen: boolean }) => {
	const location = useLocation();

	const [taskLocation, setTaskLocation] = useState<boolean>(false);
	const [sceneLocation, setSceneLocation] = useState<boolean>(false);
	const [projectsLocation, setprojectsLocation] = useState<boolean>(false);
	const [forbidden, setForbidden] = useState<boolean>(false);

	const { removeTask } = useTasksStore();
	const { removeProject } = useProjectsStore();
	const { removeScene } = useScenesStore();
	const { setClose: closeTask } = useTaskInfoStore();
	const { data: projectData, project } = useProjectDataStore();
	const { data: sceneData, scene } = useSceneDataStore();
	const {
		task: taskDataTask,
		resetData: resetTaskData,
		data: taskData,
	} = useTaskDataStore();
	const { setOpenClose: setOpenCloseComment } = useCreateCommentPopupStore();

	// useEffect(() => {
	// 	if (!taskDataTask) return;
	// 	if (taskData.length === 0) {
	// 		api.updateTaskStatus({
	// 			type: TypeOfData.Status,
	// 			task_id: taskDataTask.id,
	// 			created_at: formatSQLTimestamp(new Date()),
	// 			created_by: 1,
	// 			status: EStatus.NoStatus,
	// 			spent_hours: null,
	// 		});
	// 	}
	// }, [taskData]);

	const handleDeleteButton = () => {
		if (taskLocation && taskDataTask) {
			api.deleteTask(taskDataTask.id)
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
		if (projectsLocation && project) {
			api.deleteProject(project.id)
				.then((_) => {
					snackBar(
						`Project ${project.name} was deleted successfully!`,
						"success",
						[removeProject.bind(null, project.id), resetTaskData],
					);
				})
				.catch((err) => {
					snackBar("Error while deleting the project", "error");
				});
		}
	};

	useEffect(() => {
		if (taskLocation && taskData) {
			setForbidden(false);
		} else {
			setForbidden(true);
		}
	}, [taskLocation, taskData]);

	const handleOpenComment = useCallback(() => {
		if (!forbidden) setOpenCloseComment();
	}, [forbidden]);

	useEffect(() => {
		const checkedLocation = checkLocation(location);
		checkedLocation.project && setprojectsLocation(true);
		checkedLocation.scene && setSceneLocation(true);
		checkedLocation.task && setTaskLocation(true);
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
						opacity: forbidden ? 0.5 : 1,
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
				{taskData && taskDataTask && taskLocation && (
					<>
						<Title title={taskDataTask.name} />
						<Description description={taskDataTask.description} />
						{taskData.map((task, i, tasks) => {
							const isFirst = i === 0;
							const statusChanged =
								isFirst || task.status !== tasks[i - 1]?.status;
							return (
								<Comment
									statusChanged={statusChanged}
									task={task}
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
