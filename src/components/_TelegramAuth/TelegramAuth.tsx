import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useAuthStore } from "@/zustand/authStore";

declare global {
	interface Window {
		onTelegramAuth: (user: any) => void;
	}
}

const TelegramAuth = () => {
	const location = useLocation();
	const navigate = useNavigate();
	// const { setTgAuth } = useAuthStore();

	useEffect(() => {
		console.log(process.env.REACT_APP_TEST);
		if (process.env.REACT_APP_TEST === "true") {
			const fakeUser = {
				auth_date: "1231451212",
				first_name: "Yuriy",
				hash: "4152352352",
				last_name: "Bodolanov",
				username: "bodolanov",
				photo_url:
					"https://t.me/i/userpic/320/L00DAS7h4otNF4Or_Qy4l9n32VBw3HQl1yWyjhxemrw.jpg",
				id: "1234567890",
			};
			localStorage.setItem("user", JSON.stringify(fakeUser));
			// setTgAuth(fakeUser);
		}
	}, []);

	useEffect(() => {
		window.onTelegramAuth = function (user) {
			localStorage.setItem("user", `${JSON.stringify(user)}`);
			// setTgAuth(user);

			let enteringPath = "";
			location.pathname === "/signup"
				? (enteringPath = "/projects")
				: (enteringPath = location.pathname);

			navigate(enteringPath);
		};

		const script = document.createElement("script");
		script.src = "https://telegram.org/js/telegram-widget.js?22";
		script.async = true;
		script.setAttribute("data-telegram-login", "matchmovepro_bot");
		script.setAttribute("data-size", "big");
		script.setAttribute("data-onauth", "onTelegramAuth(user)");
		script.setAttribute("data-request-access", "write");

		document
			.getElementById("telegram-button-container")
			?.appendChild(script);

		return () => {
			window.onTelegramAuth = undefined as any;
			const container = document.getElementById(
				"telegram-button-container",
			);
			if (container) container.innerHTML = "";
		};
	}, []);
	return <div id="telegram-button-container"></div>;
};

export default TelegramAuth;
