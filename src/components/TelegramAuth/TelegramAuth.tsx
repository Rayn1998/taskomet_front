import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/zustand/authStore";

declare global {
	interface Window {
		onTelegramAuth: (user: any) => void;
	}
}

const TelegramAuth: FC = () => {
	const setAuth = useAuthStore((state) => state.setAuth);
	const navigate = useNavigate();

	useEffect(() => {
		window.onTelegramAuth = function (user) {
			// alert(
			// 	`Logged in as ${user.first_name} ${user.last_name} (${user.id}${
			// 		user.username ? ", @" + user.username : ""
			// 	})`,
			// );
			localStorage.setItem("user", `${JSON.stringify(user)}`);
			setAuth(user);
			navigate("/projects");
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
