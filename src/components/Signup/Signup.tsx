import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import TelegramAuth from "@/components/TelegramAuth/TelegramAuth";
import { snackBar } from "@/utils/snackBar";

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
				const artist = await api.getArtist(tgAuth.username);

				let authArtist;

				if (Array.isArray(artist) && artist.length === 0) {
					authArtist = await api.createArtist({
						name: `${tgAuth.first_name} ${tgAuth.last_name}`,
						user_name: tgAuth.username,
						role: 10,
						photo_url: tgAuth.photo_url ?? "",
						tg_id: tgAuth.id,
					});
				} else {
					// Тут проверка, если артист был создан до регистрации
					// у него не будет id телеграма и фото
					const artistWithRequiredData = { ...artist };
					if (tgAuth.id) artistWithRequiredData.id = tgAuth.id;
					if (tgAuth.photo_url)
						artistWithRequiredData.photo_url = tgAuth.photo_url;

					let equalData = true;
					for (const key of Object.keys(
						artistWithRequiredData,
					) as (keyof typeof artistWithRequiredData)[]) {
						if (artistWithRequiredData[key] !== artist[key]) {
							equalData = false;
						}
					}
					if (!equalData) {
						const newDataForUpdate = {
							tg_id: artistWithRequiredData.tg_id,
							photo_url: artistWithRequiredData.photo_url,
							user_name: artistWithRequiredData.user_name,
						};
						api.updateArtistAfterRegister(newDataForUpdate)
							.then((artist) => {
								snackBar(
									`Welcome to Taskomet, dear ${artist.name}`,
								);
							})
							.catch((_) =>
								snackBar(
									"Something went wrong. Please contact @bodolanov about the problem",
									"error",
								),
							);
					}

					authArtist = artistWithRequiredData;
				}

				setAuth(authArtist);
				setLoggedIn(true);
				snackBar(`Welcome back, dear ${authArtist.name}`);

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
