import { MouseEvent, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Layout from "@/components/Layout/Layout";
import LayoutItem from "@/components/Layout/components/LayoutItem/LayoutItem";
import { scenesApi } from "@/routes/scenes.api";

// MUI
import LinearProgress from "@mui/material/LinearProgress";

// STORES
import { useErrorDataStore } from "@/zustand/errorDataStore";
import { useScenesStore } from "@/zustand/scenesStore";
import { useSceneDataStore } from "@/zustand/sceneDataStore";
import { useTaskInfoStore } from "@/zustand/taskInfoStore";

// TYPES
import type IScene from "@shared/types/Scene";
import type IEntityProgress from "@shared/types/EntityProgress";

const Scenes = () => {
	// TASK INFO STORE
	const { isOpen: taskViewOpen } = useTaskInfoStore();

	// ERROR DATA STORE
	const { setErrorMessage } = useErrorDataStore();

	// SCENES STORE
	const { scenes, scenesProgress, lastProject, setScenes, resetScenes } =
		useScenesStore();

	// SCENE DATA STORE
	const { setSceneData, setRelatedScene, relatedScene, resetSceneData } =
		useSceneDataStore();

	const [selected, setSelected] = useState<string>("");

	const navigate = useNavigate();
	const location = useLocation();

	const handleClick = (scene: IScene) => {
		setSelected(scene.name);
		setRelatedScene(scene);
	};

	const handleDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
		const scene = e.currentTarget.getAttribute("data-name")!.toLowerCase();
		navigate(`${location.pathname}/${scene}`);
	};

	useEffect(() => {
		if (!(selected && taskViewOpen && relatedScene)) return;

		scenesApi
			.getData(relatedScene.id)
			.then((newSceneData) => {
				setSceneData(newSceneData);
			})
			.catch(console.log);
	}, [selected, taskViewOpen, relatedScene]);

	useEffect(() => {
		resetSceneData();
		const projectName = location.pathname.split("/").pop();
		if (projectName === lastProject?.toLowerCase()) return;

		const scenesRequest = (projectName: string) => {
			scenesApi
				.getAll(projectName)
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
				scenesProgress &&
				scenes.map((scene, i) => {
					const progress = scenesProgress.find((progress) => {
						if (progress.entityId === scene.id) return progress;
					}) as IEntityProgress;
					return (
						<LayoutItem<IScene>
							dataType="scene"
							key={i}
							number={i + 1}
							item={scene}
							itemProgress={progress}
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

export default Scenes;
