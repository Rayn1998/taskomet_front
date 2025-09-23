import { FC } from "react";
import Sidebar from "@/components/Layout/components/Sidebar/Sidebar";
import Header from "@/components/Layout/components/Header/Header";
import Statusline from "@/components/Layout/components/Statusline/Statusline";
import ItemsBlock from "@/components/Layout/components/ItemsBlock/ItemsBlock";

// TYPES
import type { IChildrenComponent } from "@/types/IChildrenComponent";

export interface ILayoutProps extends IChildrenComponent {
	isHeader?: boolean;
	isStatusline?: boolean;
	order?: boolean;
	menu?: boolean;
	canvas?: boolean;
}

const Layout = (props: ILayoutProps) => {
	const {
		children,
		isHeader = false,
		isStatusline = false,
		order = false,
		menu = false,
		canvas = false,
	} = props;
	return (
		<div className="layout">
			<Sidebar />
			<div className="layout-main-block">
				<Header isHeader={isHeader} />
				<Statusline isStatusLine={isStatusline} />
				<ItemsBlock {...props}>{children}</ItemsBlock>
			</div>
		</div>
	);
};

export default Layout;
