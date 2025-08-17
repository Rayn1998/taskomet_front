import { FC, MouseEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import TasksBlockItem from "@/components/Layout/components/TasksblockItem/TasksBlockItem";

import { api } from "@/utils/Api";
import { errorDataStore } from "@/zustand/errorDataStore";
import IProject from "@shared/types/Project";
// потом добавить React-Table чтобы менять размер столбцов вручную

const ProjectsList: FC = () => {
	const setErrorData = errorDataStore((state) => state.setMessage);
	const [projects, setProjects] = useState<IProject[]>([]);
	const [selected, setSelected] = useState<string>("");
	const navigate = useNavigate();

	const handleClick = (name: string) => {
		setSelected(name);
	};

	const handleDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
		const project = e.currentTarget
			.getAttribute("data-name")
			?.toLowerCase();
		navigate(`/projects/${project}`);
	};

	useEffect(() => {
		(async () => {
			try {
				const result = await api.getProjects();
				setProjects(result);
			} catch (err: unknown) {
				if (err instanceof Error) {
					setErrorData(err.message);
					return navigate("/error-page");
				}
				navigate("/not-found");
			}
		})();
	}, []);
	return (
		<Layout>
			<div className="tasksblock-list">
				{projects.map((task, i) => {
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

export default ProjectsList;
