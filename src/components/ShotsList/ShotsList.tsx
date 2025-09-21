import { FC, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Layout from "@/components/Layout/Layout";
import Shot from "@/components/Shot/Shot";
import Task from "@/components/Task/Task";
import { api } from "@/utils/Api";

// STORES
import { useErrorDataStore } from "@/zustand/errorDataStore";
import { useTaskViewStore } from "@/zustand/taskViewStore";
import { useTasksStore } from "@/zustand/tasksStore";
import { useTaskDataStore } from "@/zustand/taskDataStore";

const ShotsList: FC = () => {
	const navigate = useNavigate();
	const location = useLocation();

	// TASK VIEW STORE
	const view = useTaskViewStore((state) => state.change);

	// ERROR DATA STORE
	const { setErrorMessage } = useErrorDataStore();

	// TASKS STORE
	const { tasks, setTasks } = useTasksStore();

	// TASK DATA STORE
	const { resetTaskData } = useTaskDataStore();

	const [selected, setSelected] = useState<string>("");

	const handleClick = (name: string) => {
		setSelected(name);
	};

	useEffect(() => {
		resetTaskData();
		const [projectId, sceneId] = location.pathname.split("/").slice(-2);
		if (projectId && projectId.length > 0) {
			api.getTasks(projectId, sceneId)
				.then((result) => {
					setTasks(result);
				})
				.catch((err) => {
					if (err instanceof Error) {
						setErrorMessage(err.message);
						return navigate("/error-page");
					}
					navigate("/not-found");
				});
		}
	}, []);

	return (
		<Layout>
			<div className="itemsblock-list">
				{view
					? tasks.map((shot, i) => {
							return (
								<Shot
									task={shot}
									key={shot.id}
									orderNum={i}
									selected={Boolean(selected === shot.name)}
									handleClick={handleClick}
								/>
							);
					  })
					: tasks.map((shot, i) => {
							return (
								<Task
									key={shot.id}
									task={shot}
									orderNum={i}
									selected={Boolean(selected === shot.name)}
									handleClick={handleClick}
								/>
							);
					  })}
			</div>
		</Layout>
	);
};

export default ShotsList;
