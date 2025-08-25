import { FC, MouseEvent, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import TasksBlockItem from "@/components/Layout/components/TasksblockItem/TasksBlockItem";
import { api } from "@/utils/Api";
import { errorDataStore } from "@/zustand/errorDataStore";
import IScene from "@shared/types/Scene";

const ScenesList: FC = () => {
	const setErrorData = errorDataStore((state) => state.setMessage);
	const [selected, setSelected] = useState<string>("");
	const [scenes, setScenes] = useState<IScene[]>([]);

	const handleClick = (name: string) => {
		setSelected(name);
	};
	const navigate = useNavigate();
	const location = useLocation();
	const handleDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
		const scene = e.currentTarget.getAttribute("data-name")!.toLowerCase();
		navigate(`${location.pathname}/${scene}`);
	};

	useEffect(() => {
		const projectId = location.pathname.split("/").pop();
		if (projectId && projectId.length > 0) {
			(async () => {
				try {
					const result = await api.getScenes(projectId);
					setScenes(result);
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
				{scenes.map((task, i) => {
					return (
						<TasksBlockItem
							key={i}
							number={i + 1}
							name={task.name}
							priority={task.priority}
							handleClick={handleClick}
							handleDoubleClick={handleDoubleClick}
							selected={Boolean(task.name === selected)}
						/>
					);
				})}
			</div>
		</Layout>
	);
};

export default ScenesList;
