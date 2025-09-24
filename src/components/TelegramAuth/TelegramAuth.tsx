import { FC, useEffect } from "react";
import { useAuthStore } from "@/zustand/authStore";

declare global {
	interface Window {
		onTelegramAuth: (user: any) => void;
	}
}

const TelegramAuth: FC = () => {
	const { setTgAuth } = useAuthStore();

	useEffect(() => {
		if (process.env.REACT_APP_TEST === "true") {
			const fakeUser = {
				auth_date: 12314512,
				first_name: "Yuriy",
				hash: "4152352352",
				last_name: "Bodolanov",
				username: "bodolanov",
				id: 12312,
			};
			localStorage.setItem("user", JSON.stringify(fakeUser));
			setTgAuth(fakeUser);
		}
	}, []);

	useEffect(() => {
		window.onTelegramAuth = function (user) {
			// alert(
			// 	`Logged in as ${user.first_name} ${user.last_name} (${user.id}${
			// 		user.username ? ", @" + user.username : ""
			// 	})`,
			// );
			localStorage.setItem("user", `${JSON.stringify(user)}`);
			setTgAuth(user);
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
	return <></>;
};

export default TelegramAuth;
