import { FC, MouseEvent, useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Layout from "@/components/Layout/Layout";
import LayoutItem from "@/components/Layout/components/LayoutItem/LayoutItem";
import { api } from "@/utils/Api";

// MUI
import LinearProgress from "@mui/material/LinearProgress";

// STORES
import { useErrorDataStore } from "@/zustand/errorDataStore";
import { useProjectsStore } from "@/zustand/projectsStore";
import { useScenesStore } from "@/zustand/scenesStore";
import { useSceneDataStore } from "@/zustand/sceneDataStore";

// TYPES
import type IScene from "@shared/types/Scene";

const ScenesList: FC = () => {
	// ERROR DATA STORE
	const { setErrorMessage } = useErrorDataStore();

	// PROJECTS STORE
	const { getProject } = useProjectsStore();

	// SCENES STORE
	const { scenes, lastProject, setScenes, resetScenes } = useScenesStore();

	// SCENE DATA STORE
	const { setData: setSceneData, resetData: resetSceneData } =
		useSceneDataStore();

	const [selected, setSelected] = useState<string>("");

	const navigate = useNavigate();
	const location = useLocation();

	const handleClick = (scene: IScene) => {
		setSelected(scene.name);
		setSceneData(scene);
	};

	const handleDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
		const scene = e.currentTarget.getAttribute("data-name")!.toLowerCase();
		navigate(`${location.pathname}/${scene}`);
	};

	useEffect(() => {
		resetSceneData();
		const projectName = location.pathname.split("/").pop();
		if (projectName === lastProject?.toLowerCase()) return;

		const scenesRequest = (projectName: string) => {
			api.getScenes(projectName)
				.then((scenes) => {
					setScenes(scenes, projectName);
				})
				.catch((err) => {
					if (err instanceof Error) {
						setErrorMessage(err.message);
						return navigate("/error-page");
					}
					navigate("/not-found");
				});
		};

		if (!projectName) return;

		if (projectName !== lastProject?.toLowerCase()) {
			resetScenes();
			scenesRequest(projectName);
		}
	}, [lastProject]);
	return (
		<Layout isHeader isStatusline order menu>
			{scenes === null && <LinearProgress />}
			{scenes &&
				scenes.map((scene, i) => {
					return (
						<LayoutItem<IScene>
							dataType="scene"
							key={i}
							number={i + 1}
							item={scene}
							handleClick={handleClick}
							handleDoubleClick={handleDoubleClick}
							selected={Boolean(scene.name === selected)}
						/>
					);
				})}
			{!scenes ||
				(scenes.length === 0 && (
					<p className="empty-declaration">No scenes here yet...</p>
				))}
		</Layout>
	);
};

export default ScenesList;
