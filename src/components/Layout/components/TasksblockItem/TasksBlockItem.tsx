import { useState, MouseEvent } from "react";

interface ITasksBlockItem {
	number: number;
	name: string;
	description?: string;
	priority: number;
	handleClick: (name: string, description: string) => void;
	handleDoubleClick: (e: MouseEvent<HTMLDivElement>) => void;
	selected: boolean;
}

const TasksBlockItem = ({
	number,
	name,
	priority,
	description,
	handleClick,
	handleDoubleClick,
	selected,
}: ITasksBlockItem) => {
	const [hover, setHover] = useState<boolean>(false);

	return (
		<div
			className="tasksblock-item"
			data-name={name}
			onClick={() => handleClick(name, description!)}
			onDoubleClick={(e) => handleDoubleClick(e)}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			style={{
				backgroundColor:
					selected || hover ? "rgb(45, 50, 60)" : "rgb(35, 37, 44)",
			}}
		>
			<p className="tasksblock-item-number">{number}</p>
			<p className="tasksblock-item-name">{name}</p>
			<p className="tasksblock-item-status">--заглушка--</p>
			<p className="tasksblock-item-artists">--</p>
			<p className="tasksblock-item-priority">{priority}</p>
		</div>
	);
};

export default TasksBlockItem;
