import { ReactNode } from "react";

const IconWrapper = ({
	icon,
	onClick,
}: {
	icon: ReactNode;
	onClick?: () => void;
}) => {
	return (
		<div className="sidebar-image" onClick={onClick}>
			{icon}
		</div>
	);
};

export default IconWrapper;
