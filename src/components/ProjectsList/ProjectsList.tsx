import { MouseEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import LayoutItem from "@/components/Layout/components/LayoutItem/LayoutItem";

import { projectsApi } from "@/routes/projects.api";

// MUI
import LinearProgress from "@mui/material/LinearProgress";

// STORES
import { useErrorDataStore } from "@/zustand/errorDataStore";
import { useProjectsStore } from "@/zustand/projectsStore";
import { useProjectDataStore } from "@/zustand/projectDataStore";
import { useTaskInfoStore } from "@/zustand/taskInfoStore";

// TYPES
import type IProject from "@shared/types/Project";
import IEntityProgress from "@shared/types/EntityProgress";

const ProjectsList = () => {
	const navigate = useNavigate();

	// TASK INFO STORE
	const { isOpen: isTaskInfoOpen } = useTaskInfoStore();

	// PROJECTS STORE
	const { projects, projectsProgress, setProjects } = useProjectsStore();

	// PROJECT DATA STORE

	// ERROR DATA STORE
	const { setErrorMessage } = useErrorDataStore();

	// PROJECT DATA STORE
	const {
		projectData,
		setProjectData,
		setRelatedProject,
		relatedProject,
		resetProjectData,
	} = useProjectDataStore();

	const [selected, setSelected] = useState<string>("");

	const handleClick = (project: IProject) => {
		setSelected(project.name);
		setRelatedProject(project);
	};

	const handleDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
		const project = e.currentTarget
			.getAttribute("data-name")!
			.toLowerCase();
		navigate(`/projects/${project}`);
	};

	useEffect(() => {
		if (!(selected && isTaskInfoOpen && relatedProject)) return;

		projectsApi
			.getData(relatedProject.id)
			.then((newProjectData) => {
				setProjectData(newProjectData);
			})
			.catch(console.log);
	}, [selected, isTaskInfoOpen, relatedProject]);

	useEffect(() => {
		resetProjectData();
		projectsApi
			.getAll()
			.then((projects) => {
				setProjects(projects);
			})
			.catch((err) => {
				if (err instanceof Error) {
					if (err.message.toLowerCase() === "unauthorized")
						return navigate("/signin");
					setErrorMessage(err.message);
					return navigate("/error-page");
				}
			});
	}, []);
	return (
		<Layout isHeader isStatusline order menu>
			{projects === null && <LinearProgress />}
			{projects &&
				projectsProgress &&
				projects.map((project, i) => {
					const progress = projectsProgress.find((progressItem) => {
						if (progressItem.entityId === project.id)
							return progressItem;
					}) as IEntityProgress;
					return (
						<LayoutItem<IProject>
							dataType="project"
							key={i}
							number={i + 1}
							item={project}
							itemProgress={progress}
							handleClick={handleClick}
							handleDoubleClick={handleDoubleClick}
							selected={Boolean(project.name === selected)}
						/>
					);
				})}
			{projects && projects.length === 0 && (
				<p className="empty-declaration">No projects here yet...</p>
			)}
		</Layout>
	);
};

export default ProjectsList;
