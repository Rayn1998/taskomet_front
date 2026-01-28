import { MouseEvent, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// COMPONENTS
import Layout from "@/components/Layout/Layout";
import LayoutItem from "@/components/Layout/components/LayoutItem/LayoutItem";

// API
import { projectsApi } from "@/routes/projects.api";

// MUI
import LinearProgress from "@mui/material/LinearProgress";

// STORES
import { useProjectsStore } from "@/zustand/projectsStore";
import { useProjectDataStore } from "@/zustand/projectDataStore";
import { useTaskInfoStore } from "@/zustand/taskInfoStore";

// TYPES
import type IProject from "@shared/types/Project";

// UTILS
import { snackBar } from "@/utils/snackBar";
import { useHotkeyInfoBlock } from "@/utils/useHotkey";

const Projects = () => {
	const navigate = useNavigate();

	useHotkeyInfoBlock(true);

	// TASK INFO STORE
	const { isOpen: isTaskInfoOpen } = useTaskInfoStore();

	// PROJECTS STORE
	const { projects, projectsProgress, setProjects } = useProjectsStore();

	// PROJECT DATA STORE
	const {
		setProjectData,
		setRelatedProject,
		relatedProject,
		resetProjectData,
	} = useProjectDataStore();

	const [selectedId, setSelectedId] = useState<number | null>(null);

	const progressMap = useMemo(() => {
		if (!projectsProgress) return;
		return Object.fromEntries(projectsProgress.map((p) => [p.entityId, p]));
	}, [projectsProgress]);

	const handleClick = (project: IProject) => {
		setSelectedId(project.id);
		setRelatedProject(project);
	};

	const handleDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
		const project = e.currentTarget
			.getAttribute("data-name")!
			.toLowerCase();
		navigate(`/projects/${project}`);
	};

	const onContext = (item: IProject) => {
		setRelatedProject(item);
	};

	useEffect(() => {
		if (!(isTaskInfoOpen && relatedProject)) return;

		projectsApi
			.getData(relatedProject.id)
			.then((newProjectData) => {
				setProjectData(newProjectData.data);
			})
			.catch(console.log);
	}, [isTaskInfoOpen, relatedProject]);

	useEffect(() => {
		resetProjectData();
		projectsApi
			.getAll()
			.then((res) => {
				setProjects(res.data);
			})
			.catch((err) => {
				if (err instanceof Error) {
					snackBar(err.message, "error");
				}
				snackBar("Server is not replying", "error");
			});
	}, []);
	return (
		<Layout isHeader isStatusline order menu>
			{projects === null && <LinearProgress />}
			{projects &&
				projectsProgress &&
				projects.map((project, i) => {
					const progress = progressMap
						? progressMap[project.id]
						: null;
					return (
						<LayoutItem<IProject>
							dataType="project"
							key={project.id}
							number={i + 1}
							item={project}
							itemProgress={progress}
							handleContext={() => onContext(project)}
							handleClick={handleClick}
							handleDoubleClick={handleDoubleClick}
							selected={project.id === selectedId}
						/>
					);
				})}
			{projects && projects.length === 0 && (
				<p className="empty-declaration">No projects here yet...</p>
			)}
		</Layout>
	);
};

export default Projects;
