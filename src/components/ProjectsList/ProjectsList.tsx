import { MouseEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import LayoutItem from "@/components/Layout/components/LayoutItem/LayoutItem";

import { api } from "@/utils/Api";

// STORES
import { useErrorDataStore } from "@/zustand/errorDataStore";
import { useProjectsStore } from "@/zustand/projectsStore";
import { useProjectDataStore } from "@/zustand/projectDataStore";

// TYPES
import type IProject from "@shared/types/Project";

const ProjectsList = () => {
	const navigate = useNavigate();

	// PROJECTS STORE
	const { projects, setProjects } = useProjectsStore();

	// ERROR DATA STORE
	const { setErrorMessage } = useErrorDataStore();

	// PROJECT DATA STORE
	const { setProjectData, resetProjectData } = useProjectDataStore();

	const [selected, setSelected] = useState<string>("");

	const handleClick = (project: IProject) => {
		setSelected(project.name);
		setProjectData(project);
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
					setErrorMessage(err.message);
					return navigate("/error-page");
				}
			});
	}, []);
	return (
		<Layout>
			<div className="itemsblock-list">
				{projects &&
					projects.map((project, i) => {
						return (
							<LayoutItem<IProject>
								dataType="project"
								key={i}
								number={i + 1}
								item={project}
								handleClick={handleClick}
								handleDoubleClick={handleDoubleClick}
								selected={Boolean(project.name === selected)}
							/>
						);
					})}
			</div>
		</Layout>
	);
};

export default ProjectsList;
