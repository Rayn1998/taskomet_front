import { useState, MouseEvent, useEffect } from "react";

// STORES
import { useProjectDataStore } from "@/zustand/projectDataStore";
import { useSceneDataStore } from "@/zustand/sceneDataStore";

// TYPES
import type IProject from "@shared/types/Project";
import type IScene from "@shared/types/Scene";
import type IEntityProgress from "@shared/types/EntityProgress";
import { EStatus, StatusColors } from "@/types/Status";
import { EPriority, PriorityColors } from "@/types/Priority";

interface ILayoutItem<T extends IProject | IScene> {
	dataType: string;
	number: number;
	item: T;
	itemProgress: IEntityProgress;
	handleClick: (item: T) => void;
	handleDoubleClick: (e: MouseEvent<HTMLDivElement>) => void;
	selected: boolean;
}

const LayoutItem = <T extends IProject | IScene>({
	dataType,
	number,
	item,
	itemProgress,
	handleClick,
	handleDoubleClick,
	selected,
}: ILayoutItem<T>) => {
	// PROJECT DATA STORE
	const { setRelatedProject } = useProjectDataStore();

	// SCENE DATA STORE
	const { setRelatedScene } = useSceneDataStore();

	const [hover, setHover] = useState<boolean>(false);

	const handleContextClick = () => {
		switch (dataType) {
			case "project":
				setRelatedProject(item as IProject);
				break;
			case "scene":
				setRelatedScene(item as IScene);
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
			<div className="item-status-wrapper">
				<div className="item-status">
					{itemProgress?.progress &&
						itemProgress.progress?.length > 0 &&
						itemProgress.progress.map((el, _, arr) => {
							return (
								<div
									key={el.status}
									style={{
										borderRadius: 0,
										width: `${
											(+el.amount / arr.length) * 100
										}%`,
										height: "100%",
										backgroundColor: `${
											StatusColors[el.status as EStatus]
										}`,
									}}
								></div>
							);
						})}
					{itemProgress?.progress &&
						itemProgress.progress?.length === 0 && (
							<div
								style={{
									borderRadius: 0,
									width: "100%",
									backgroundColor: "rgb(125, 125, 125)",
								}}
							></div>
						)}
				</div>
			</div>
			<p className="item-artists">{itemProgress?.executorsCount}</p>
			<p className="item-hours">{itemProgress?.spentHours}</p>
			<div className="item-priority-wrapper">
				<div className="item-priority">
					{itemProgress?.priority &&
						itemProgress.priority?.length > 0 &&
						itemProgress.priority.map((el, _, arr) => {
							return (
								<div
									key={el.priority}
									style={{
										borderRadius: 0,
										width: `${
											(+el.amount / arr.length) * 100
										}%`,
										height: "100%",
										backgroundColor: `${
											PriorityColors[
												el.priority as EPriority
											]
										}`,
									}}
								></div>
							);
						})}
					{itemProgress?.priority &&
						itemProgress.priority?.length === 0 && (
							<div
								style={{
									borderRadius: 0,
									width: "100%",
									backgroundColor: "rgb(125, 125, 125)",
								}}
							></div>
						)}
				</div>
			</div>
		</div>
	);
};

export default LayoutItem;
