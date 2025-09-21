import { FC } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "@/components/Layout/components/Header/Header";
import Statusline from "@/components/Layout/components/Statusline/Statusline";
import ItemsBlock from "@/components/Layout/components/ItemsBlock/ItemsBlock";

// TYPES
import type { IChildrenComponent } from "@/types/IChildrenComponent";

const Layout: FC<IChildrenComponent> = ({ children }) => {
	return (
		<div className="layout">
			<Sidebar />
			<div className="layout-main-block">
				<Header />
				<Statusline />
				<ItemsBlock>{children}</ItemsBlock>
			</div>
		</div>
	);
};

export default Layout;
