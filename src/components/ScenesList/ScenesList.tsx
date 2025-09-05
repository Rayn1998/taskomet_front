import { FC, MouseEvent, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Layout from "@/components/Layout/Layout";
import Item from "@/components/Layout/components/Item/Item";
import { api } from "@/utils/Api";

// STORES
import { errorDataStore } from "@/zustand/errorDataStore";
import { useScenesStore } from "@/zustand/scenesStore";
import { useSceneDataStore } from "@/zustand/sceneDataStore";

// TYPES
import IScene from "@shared/types/Scene";

const ScenesList: FC = () => {
	// ERROR DATA STORE
	const setErrorData = errorDataStore((state) => state.setMessage);

	// SCENES STORE
	const { scenes, setScenes } = useScenesStore();

	// SCENE DATA STORE
	const { setData: setSceneData, resetData: resetSceneData } =
		useSceneDataStore();

	const [selected, setSelected] = useState<string>("");

	const handleClick = (name: string, description: string) => {
		setSelected(name);
		setSceneData({ name, description });
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
						setErrorData(err.message);
						return navigate("/error-page");
					}
					navigate("/not-found");
				});
		}
	}, []);
	return (
		<Layout>
			<div className="itemsblock-list">
				{scenes &&
					scenes.map((task, i) => {
						return (
							<Item
								dataType="scene"
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

export default ScenesList;
