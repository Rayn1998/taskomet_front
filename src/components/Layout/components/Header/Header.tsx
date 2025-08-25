import { useState, useRef } from "react";

import backgroundImage from "@/assets/images/user.png";

import { useAuthStore } from "@/zustand/authStore";

const Header = () => {
	const auth = useAuthStore((state) => state.auth);
	// console.log(auth);
	const isAuth = Boolean(auth);
	const [isSearchActive, setSearchActive] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleSetSearchActive = () => {
		setSearchActive(true);
		inputRef.current?.focus();
	};
	const handleSetSearchInactive = () => {
		setSearchActive(false);
	};
	return (
		<div className="header">
			<div className="header-container">
				<div
					className="header-search-container"
					onFocus={handleSetSearchActive}
					onBlur={handleSetSearchInactive}
					style={{
						outline: isSearchActive
							? "0.1rem solid rgb(68,120,250)"
							: "none",
					}}
				>
					<div
						className="header-search-icon"
						onClick={handleSetSearchActive}
					></div>
					<input
						ref={inputRef}
						className="header-search"
						placeholder="Search"
					></input>
				</div>
				<div className="header-right-block">
					<div className="header-preferences"></div>
					<div className="header-notification"></div>
					<div
						className="header-profile"
						style={{
							backgroundImage: `url(${
								isAuth ? auth.photo_url : backgroundImage
							})`,
						}}
					></div>
				</div>
			</div>
		</div>
	);
};

export default Header;
