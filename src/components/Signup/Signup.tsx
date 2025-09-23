import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TelegramAuth from "@/components/TelegramAuth/TelegramAuth";

import { api } from "@/utils/Api";

import { useAuthStore } from "@/zustand/authStore";
import { useErrorDataStore } from "@/zustand/errorDataStore";
import { useArtistStore } from "@/zustand/artistStore";

// TYPES
// import type ITelegramAuthData from "@shared/types/TgAuthData";

const Signup = () => {
	const navigate = useNavigate();
	const { auth, tgAuth, setAuth, setTgAuth, setLoggedIn } = useAuthStore();
	const { setErrorMessage } = useErrorDataStore();
	const { setArtists } = useArtistStore();
	useEffect(() => {
		const init = async () => {
			const userDataString = localStorage.getItem("user");
			if (!userDataString) return;

			const parsedData = JSON.parse(userDataString);
			if (!tgAuth) setTgAuth(JSON.parse(userDataString));

			if (!auth && tgAuth && parsedData.id) {
				let authArtist;

				try {
					console.log("id before search: ", parsedData.id);
					const artist = await api.getArtist(parsedData.id);

					if (Array.isArray(artist) && artist.length === 0) {
						console.log("WHY HERE AGAIN? artist: ", artist);
						authArtist = await api.createArtist({
							name: `${tgAuth.first_name} ${tgAuth.last_name}`,
							user_name: tgAuth.username,
							role: 1,
							photo_url: tgAuth.photo_url ?? "",
							tg_id: parsedData.id,
						});
					} else {
						console.log("MUST BE HERE");
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
			}
		};

		init();
		// ELSE HERE ONLY FOR DEVELOPMENT
		// else {
		// 	// ELSE FOR DEVELOPMENT DISABLE WHEN PROD
		// 	setAuth({
		// 		id: 33,
		// 		name: "Yuriy Bodolanov",
		// 		role: 1,
		// 		user_name: "bodolanov",
		// 		photo_url:
		// 			"https://t.me/i/userpic/320/L00DAS7h4otNF4Or_Qy4l9n32VBw3HQl1yWyjhxemrw.jpg",
		// 	});
		// 	setLoggedIn(true);
		// 	api.getArtists()
		// 		.then((artistList) => {
		// 			if (artistList.length > 0) {
		// 				setArtists(artistList);
		// 			}
		// 		})
		// 		.catch((err) => {
		// 			if (err instanceof Error) {
		// 				setErrorMessage(err.message);
		// 				return navigate("/error-page");
		// 			}
		// 		})
		// 		.finally(() => {
		// 			navigate("/projects");
		// 		});
		// }
	}, [tgAuth]);
	return (
		<div className="signup" style={{ width: "100%", height: "100%" }}>
			<div className="signup-form">
				<TelegramAuth />
			</div>
		</div>
	);
};

export default Signup;
