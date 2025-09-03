import { useState, useEffect } from "react";

// MUI
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

interface IContextMenuData {
	mouseX: number;
	mouseY: number;
	target: HTMLElement;
}

const ContextMenu = () => {
	const [contextMenu, setContextMenu] = useState<null | IContextMenuData>(
		null,
	);
	const handleContextMenuClose = () => setContextMenu(null);

	useEffect(() => {
		const handleContextMenu = (e: MouseEvent) => {
			e.preventDefault();
			setContextMenu({
				mouseX: e.clientX + 6,
				mouseY: e.clientY - 6,
				target: e.target as HTMLElement,
			});
		};

		document.addEventListener("contextmenu", handleContextMenu);
		return () =>
			document.removeEventListener("contextmenu", handleContextMenu);
	}, []);
	return (
		<Menu
			id="context-menu"
			open={contextMenu !== null}
			onClose={handleContextMenuClose}
			anchorReference="anchorPosition"
			anchorPosition={
				contextMenu !== null
					? { top: contextMenu.mouseY, left: contextMenu.mouseX }
					: undefined
			}
		>
			<MenuItem onClick={handleContextMenuClose}>Add</MenuItem>
			<MenuItem onClick={handleContextMenuClose}>Next</MenuItem>
			<MenuItem onClick={handleContextMenuClose}>Delete</MenuItem>
		</Menu>
	);
};

export default ContextMenu;
