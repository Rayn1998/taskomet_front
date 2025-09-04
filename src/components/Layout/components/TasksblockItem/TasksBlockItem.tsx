import { useState, MouseEvent } from "react";

// STORES
import { useProjectDataStore } from "@/zustand/projectDataStore";
import { useSceneDataStore } from "@/zustand/sceneDataStore";

// TYPES
import IProject from "@shared/types/Project";
import IScene from "@shared/types/Scene";

interface ITasksBlockItem {
	dataType: string;
	number: number;
	item: IProject | IScene;
	handleClick: (name: string, description: string) => void;
	handleDoubleClick: (e: MouseEvent<HTMLDivElement>) => void;
	selected: boolean;
}

const TasksBlockItem = ({
	dataType,
	number,
	item,
	handleClick,
	handleDoubleClick,
	selected,
}: ITasksBlockItem) => {
	// PROJECT DATA STORE
	const { setProject } = useProjectDataStore();

	// SCENE DATA STORE
	const { setScene } = useSceneDataStore();

	const [hover, setHover] = useState<boolean>(false);

	const handleContextClick = () => {
		switch (dataType) {
			case "project":
				setProject(item as IProject);
				break;
			case "scene":
				setScene(item as IScene);
				break;
		}
	};

	return (
		<div
			data-type={dataType}
			className="tasksblock-item"
			data-name={item.name}
			onContextMenu={handleContextClick}
			onClick={() => {
				handleClick(item.name, item.description!);
				handleContextClick();
			}}
			onDoubleClick={(e) => handleDoubleClick(e)}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			style={{
				backgroundColor:
					selected || hover ? "rgb(45, 50, 60)" : "rgb(35, 37, 44)",
			}}
		>
			<p className="tasksblock-item-number">{number}</p>
			<p className="tasksblock-item-name">{item.name}</p>
			<p className="tasksblock-item-status">--заглушка--</p>
			<p className="tasksblock-item-artists">--</p>
			<p className="tasksblock-item-priority">{item.priority}</p>
		</div>
	);
};

export default TasksBlockItem;
