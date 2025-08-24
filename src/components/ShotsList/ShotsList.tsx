import { FC, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import Shot from "@/components/ShotsList/components/Shot/Shot";
import Task from "@/components/ShotsList/components/Task/Task";
import { api } from "@/utils/Api";
import { errorDataStore } from "@/zustand/errorDataStore";
import { useTaskViewStore } from "@/zustand/taskViewStore";
import ITask from "@shared/types/Task";

const ShotsList: FC = () => {
	const view = useTaskViewStore((state) => state.change);
	const setErrorData = errorDataStore((state) => state.setMessage);
	const [tasks, setTasks] = useState<ITask[]>([]);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const [projectId, sceneId] = location.pathname.split("/").slice(-2);
		if (projectId && projectId.length > 0) {
			(async () => {
				try {
					const result = await api.getTasks(projectId, sceneId);
					setTasks(result);
				} catch (err: unknown) {
					if (err instanceof Error) {
						setErrorData(err.message);
						return navigate("/error-page");
					}
					navigate("/not-found");
				}
			})();
		}
	}, []);
	return (
		<Layout>
			<div className="tasksblock-list">
				{view
					? tasks.map((shot, i) => {
							return <Shot props={shot} key={i} orderNum={i} />;
					  })
					: tasks.map((shot, i) => {
							return <Task key={i} props={shot} orderNum={i} />;
					  })}
			</div>
		</Layout>
	);
};

export default ShotsList;
