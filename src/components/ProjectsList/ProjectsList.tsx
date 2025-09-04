import { MouseEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import TasksBlockItem from "@/components/Layout/components/TasksblockItem/TasksBlockItem";

import { api } from "@/utils/Api";

// STORES
import { errorDataStore } from "@/zustand/errorDataStore";
import { useProjectsStore } from "@/zustand/projectsStore";
import { useProjectDataStore } from "@/zustand/projectDataStore";

const ProjectsList = () => {
	const navigate = useNavigate();

	// PROJECTS STORE
	const { projects, setProjects } = useProjectsStore();

	// ERROR DATA STORE
	const setErrorData = errorDataStore((state) => state.setMessage);

	// PROJECT DATA STORE
	const { setData: setProjectData, resetData: resetProjectData } =
		useProjectDataStore();

	const [selected, setSelected] = useState<string>("");

	const handleClick = (name: string, description: string) => {
		setSelected(name);
		setProjectData({ name, description });
	};

	const handleDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
		const project = e.currentTarget
			.getAttribute("data-name")!
			.toLowerCase();
		navigate(`/projects/${project}`);
	};

	useEffect(() => {
		resetProjectData();
		api.getProjects()
			.then((res) => {
				setProjects(res);
			})
			.catch((err) => {
				if (err instanceof Error) {
					console.log(err.message);
					setErrorData(err.message);
					return navigate("/error-page");
				}
				navigate("/not-found");
			});
	}, []);
	return (
		<Layout>
			<div className="tasksblock-list">
				{projects &&
					projects.map((task, i) => {
						return (
							<TasksBlockItem
								dataType="project"
								key={i}
								number={i + 1}
								item={task}
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
