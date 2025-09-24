import { useState, MouseEvent } from "react";

// STORES
import { useProjectDataStore } from "@/zustand/projectDataStore";
import { useSceneDataStore } from "@/zustand/sceneDataStore";

// TYPES
import type IProject from "@shared/types/Project";
import type IScene from "@shared/types/Scene";

interface ILayoutItem<T extends IProject | IScene> {
	dataType: string;
	number: number;
	item: T;
	handleClick: (item: T) => void;
	handleDoubleClick: (e: MouseEvent<HTMLDivElement>) => void;
	selected: boolean;
}

const LayoutItem = <T extends IProject | IScene>({
	dataType,
	number,
	item,
	handleClick,
	handleDoubleClick,
	selected,
}: ILayoutItem<T>) => {
	// PROJECT DATA STORE
	const { setProjectData } = useProjectDataStore();

	// SCENE DATA STORE
	const { setScene } = useSceneDataStore();

	const [hover, setHover] = useState<boolean>(false);

	const handleContextClick = () => {
		switch (dataType) {
			case "project":
				setProjectData(item as IProject);
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
				handleClick(item);
				handleContextClick();
			}}
			onDoubleClick={(e) => handleDoubleClick(e)}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			style={{
				backgroundColor: selected
					? "rgb(10, 80, 80)"
					: hover
					? "rgb(5, 55, 80)"
					: "rgb(45, 50, 60)",
			}}
		>
			<p className="item-number">{number}</p>
			<p className="item-name">{item.name}</p>
			<p className="item-status">--заглушка--</p>
			<p className="item-artists">--</p>
			<p className="item-hours">--</p>
			<p className="item-priority">{item.priority}</p>
		</div>
	);
};

export default LayoutItem;
