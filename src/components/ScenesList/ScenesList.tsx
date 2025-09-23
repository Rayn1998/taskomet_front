import { FC, MouseEvent, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Layout from "@/components/Layout/Layout";
import LayoutItem from "@/components/Layout/components/LayoutItem/LayoutItem";
import { api } from "@/utils/Api";

// STORES
import { useErrorDataStore } from "@/zustand/errorDataStore";
import { useScenesStore } from "@/zustand/scenesStore";
import { useSceneDataStore } from "@/zustand/sceneDataStore";

// TYPES
import type IScene from "@shared/types/Scene";

const ScenesList: FC = () => {
	// ERROR DATA STORE
	const { setErrorMessage } = useErrorDataStore();

	// SCENES STORE
	const { scenes, setScenes } = useScenesStore();

	// SCENE DATA STORE
	const { setData: setSceneData, resetData: resetSceneData } =
		useSceneDataStore();

	const [selected, setSelected] = useState<string>("");

	const handleClick = (scene: IScene) => {
		setSelected(scene.name);
		setSceneData(scene);
	};
	const navigate = useNavigate();
	const location = useLocation();
	const handleDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
		const scene = e.currentTarget.getAttribute("data-name")!.toLowerCase();
		navigate(`${location.pathname}/${scene}`);
	};

	useEffect(() => {
		resetSceneData();
		const projectId = location.pathname.split("/").pop();
		if (projectId && projectId.length > 0) {
			api.getScenes(projectId)
				.then((res) => {
					setScenes(res);
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
		<Layout isHeader isStatusline order menu>
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
		</Layout>
	);
};

export default ScenesList;
