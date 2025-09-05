import { useState, MouseEvent } from "react";

// STORES
import { useProjectDataStore } from "@/zustand/projectDataStore";
import { useSceneDataStore } from "@/zustand/sceneDataStore";

// TYPES
import IProject from "@shared/types/Project";
import IScene from "@shared/types/Scene";

interface IItem {
	dataType: string;
	number: number;
	item: IProject | IScene;
	handleClick: (name: string, description: string) => void;
	handleDoubleClick: (e: MouseEvent<HTMLDivElement>) => void;
	selected: boolean;
}

const Item = ({
	dataType,
	number,
	item,
	handleClick,
	handleDoubleClick,
	selected,
}: IItem) => {
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
			className="item"
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
			<p className="item-number">{number}</p>
			<p className="item-name">{item.name}</p>
			<p className="item-status">--заглушка--</p>
			<p className="item-artists">--</p>
			<p className="item-priority">{item.priority}</p>
		</div>
	);
};

export default Item;
