import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import InfoBlock from "@/components/Layout/components/ItemsBlock/components/InfoBlock/InfoBlock";

// TYPES
import { IChildrenComponent } from "@/types/IChildrenComponent";

// UTILS
import { checkLocation } from "@/components/Layout/utils/checkLocation";

// STORES
import { useTaskViewStore } from "@/zustand/taskViewStore";
import { useTaskInfoStore } from "@/zustand/taskInfoStore";
import { useCreateProjectPopupStore } from "@/components/Popups/CreateProject/CreateProjectPopupStore";
import { useCreateScenePopupStore } from "@/components/Popups/CreateScene/CreateScenePopupStore";
import { useCreateTaskPopupStore } from "@/components/Popups/CreateTask/CreateTaskPopupStore";

// IMAGES
import structureImage from "@/assets/images/structure.png";
import info from "@/assets/images/info.png";

const ItemsBlock = ({ children }: IChildrenComponent) => {
	const location = useLocation();

	const [createProjectAllowed, setCreateProjectAllowed] =
		useState<boolean>(false);
	const [createSceneAllowed, setCreateSceneAllowed] =
		useState<boolean>(false);
	const [createTaskAllowed, setCreateTaskAllowed] = useState<boolean>(false);

	// TASK POPUP STORE
	const { setOpenClose: setOpenCloseTaskPopup } = useCreateTaskPopupStore();

	// PROJECT POPUP STORE
	const { setOpenClose: setOpenCloseProjectPopup } =
		useCreateProjectPopupStore();

	// SCENE POPUP STORE
	const { setOpenClose: setOpenCloseScenePopup } = useCreateScenePopupStore();

	// TASK INFO STORE
	const { isOpen: taskOpen, setOpenClose: infoOpenClose } =
		useTaskInfoStore();

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
	}, [location]);

	return (
		<div className="itemsblock">
			<div
				className="itemsblock-left_block"
				style={{
					width: taskOpen ? "50%" : "100%",
				}}
			>
				<div className="itemsblock-menu">
					<button
						className="itemsblock-button"
						onClick={handleAddButton}
					>
						+
					</button>
					{/* <div
						className="itemsblock-structure-icon"
						onClick={handleClick}
						style={{
							backgroundImage: `url(${structureImage})`,
						}}
					></div> */}
					{/* <button className="itemsblock-button">menu</button> */}
					{/* <button>order</button> */}
					{/* <button>filter</button> */}
					{/* <button>view</button> */}
					<button
						className="itemsblock-button"
						onClick={infoOpenClose}
					>
						<img className="itemsblock-button__image" src={info} />
					</button>
				</div>
				<div className="itemsblock-ordering">
					<div>Порядок</div>
					<div>Имя</div>
					<div>Статус</div>
					<div>Исполнители</div>
					<div>Приоритет</div>
				</div>
				{children}
			</div>
			<InfoBlock blockOpen={taskOpen} />
		</div>
	);
};

export default ItemsBlock;
