import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TelegramAuth from "@/components/TelegramAuth/TelegramAuth";

import { api } from "@/utils/Api";

import { useAuthStore } from "@/zustand/authStore";
import { useErrorDataStore } from "@/zustand/errorDataStore";
import { useArtistStore } from "@/zustand/artistStore";

const Signup = () => {
	const navigate = useNavigate();
	const { auth, tgAuth, setAuth, setTgAuth, setLoggedIn } = useAuthStore();
	const { setErrorMessage } = useErrorDataStore();
	const { setArtists } = useArtistStore();

	useEffect(() => {
		const userDataString = localStorage.getItem("user");
		if (!userDataString) return;

		const parsedData = JSON.parse(userDataString);
		if (!tgAuth) setTgAuth(parsedData);
	}, []);

	useEffect(() => {
		const loadAuth = async () => {
			if (!tgAuth || auth) return;

			try {
				const artist = await api.getArtist(tgAuth.id);

				let authArtist;

				if (Array.isArray(artist) && artist.length === 0) {
					authArtist = await api.createArtist({
						name: `${tgAuth.first_name} ${tgAuth.last_name}`,
						user_name: tgAuth.username,
						role: 1,
						photo_url: tgAuth.photo_url ?? "",
						tg_id: tgAuth.id,
					});
				} else {
					authArtist = artist;
				}

				setAuth(authArtist);
				setLoggedIn(true);

				const artists = await api.getArtists();
				if (artists?.length) setArtists(artists);

				navigate("/projects");
			} catch (err) {
				if (err instanceof Error) {
					setErrorMessage(err.message);
					navigate("/error-page");
				}
			}
		};

		loadAuth();
	}, [tgAuth, auth]);
	return (
		<div className="signup" style={{ width: "100%", height: "100%" }}>
			<div className="signup-form">
				<TelegramAuth />
			</div>
		</div>
	);
};

export default Signup;
