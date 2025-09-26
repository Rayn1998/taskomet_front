import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import InfoBlock from "@/components/InfoBlock/InfoBlock";

// UTILS
import { checkLocation } from "@/utils/checkLocation";

// MUI
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// STORES
import { useTaskViewStore } from "@/zustand/taskViewStore";
import { useTaskInfoStore } from "@/zustand/taskInfoStore";
import { useCreateProjectPopupStore } from "@/components/Popups/CreateProject/CreateProjectPopupStore";
import { useCreateScenePopupStore } from "@/components/Popups/CreateScene/CreateScenePopupStore";
import { useCreateTaskPopupStore } from "@/components/Popups/CreateTask/CreateTaskPopupStore";

// TYPES
import type { ILayoutProps } from "@/components/Layout/Layout";

const ItemsBlock = ({
	children,
	order,
	menu,
	canvas,
	isHeader,
	isStatusline,
}: ILayoutProps) => {
	const location = useLocation();

	const [createProjectAllowed, setCreateProjectAllowed] =
		useState<boolean>(false);
	const [createSceneAllowed, setCreateSceneAllowed] =
		useState<boolean>(false);
	const [createTaskAllowed, setCreateTaskAllowed] = useState<boolean>(false);
	const [myTasksLocation, setMyTasksLocation] = useState<boolean>(false);

	// TASK POPUP STORE
	const { setOpenClose: setOpenCloseTaskPopup } = useCreateTaskPopupStore();

	// PROJECT POPUP STORE
	const { setOpenClose: setOpenCloseProjectPopup } =
		useCreateProjectPopupStore();

	// SCENE POPUP STORE
	const { setOpenClose: setOpenCloseScenePopup } = useCreateScenePopupStore();

	// TASK INFO STORE
	const { isOpen: taskOpen, setOpenClose: infoOpenClose } =
		useTaskInfoStore(); // !!!!!!!!!!!!!!

	// TASK VIEW STORE
	const handleClick = useTaskViewStore((state) => state.setChange);

	const handleAddButton = () => {
		if (createProjectAllowed) setOpenCloseProjectPopup();
		if (createSceneAllowed) setOpenCloseScenePopup();
		if (createTaskAllowed) setOpenCloseTaskPopup();
	};

	useEffect(() => {
		const checkedLocation = checkLocation(location);
		checkedLocation.project && setCreateProjectAllowed(true);
		checkedLocation.scene && setCreateSceneAllowed(true);
		checkedLocation.task && setCreateTaskAllowed(true);
		checkedLocation.myTasks && setMyTasksLocation(true);
	}, [location]);

	const itemsBlockHeight = isHeader && isStatusline ? "79%" : "89%";

	return (
		<div className="itemsblock" style={{ height: itemsBlockHeight }}>
			<div
				className="itemsblock-left_block"
				style={{
					width: taskOpen ? "50%" : "100%",
				}}
			>
				{menu && (
					<div className="itemsblock-menu">
						<AddCircleOutlineOutlinedIcon
							className="itemsblock-button"
							onClick={handleAddButton}
						/>
						<InfoOutlinedIcon
							className="itemsblock-button"
							onClick={() => infoOpenClose(true)}
						/>
					</div>
				)}
				{canvas && <div className="itemsblock-canvas">{children}</div>}
				{order && (
					<div className="itemsblock-order">
						<div>Порядок</div>
						<div>Имя</div>
						<div>Статус</div>
						<div>Исполнители</div>
						<div>Часы</div>
						<div>Приоритет</div>
					</div>
				)}
				{menu && order && !canvas && (
					<div
						className="itemsblock-list"
						style={{
							height:
								menu && order && isStatusline ? "80%" : "100%",
						}}
					>
						{children}
					</div>
				)}
			</div>
			{!canvas && <InfoBlock blockOpen={taskOpen} />}
		</div>
	);
};

export default ItemsBlock;
