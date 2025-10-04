import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";

import { api } from "@/utils/Api";
import { snackBar } from "@/utils/snackBar";

// MUI
import CircularProgress from "@mui/material/CircularProgress";

// STORES
import { useAuthStore } from "@/zustand/authStore";
import { useErrorDataStore } from "@/zustand/errorDataStore";
import { useArtistStore } from "@/zustand/artistStore";

interface IProtectedRouteProps {
	redirectingPath?: string;
}

const ProtectedRoute = ({
	redirectingPath = "/signup",
}: IProtectedRouteProps) => {
	const location = useLocation();
	const navigate = useNavigate();

	// AUTH STORE
	const { auth, tgAuth, setAuth, setTgAuth } = useAuthStore();

	// ERROR STORE
	const { setErrorMessage } = useErrorDataStore();

	// ARTISTS STORE
	const { setArtists } = useArtistStore();

	useEffect(() => {
		const userDataString = localStorage.getItem("user");
		if (!userDataString) {
			navigate(redirectingPath);
			return;
		}

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
						role: 0,
						photo_url: tgAuth.photo_url ?? "",
						tg_id: tgAuth.id,
					});
				} else {
					// Тут проверка, если артист был создан до регистрации
					// у него не будет id телеграма и фото
					const artistWithRequiredData = { ...artist };
					if (tgAuth.id) artistWithRequiredData.tg_id = tgAuth.id;
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
				snackBar(`Welcome back, dear ${authArtist.name}`);

				const artists = await api.getArtists();
				if (artists?.length) setArtists(artists);

				let redirectingPath = location.pathname;
				if (redirectingPath === "/signup")
					redirectingPath = "/projects";

				navigate(redirectingPath);
			} catch (err) {
				if (err instanceof Error) {
					setErrorMessage(err.message);
					navigate("/error-page");
				}
			}
		};

		loadAuth();
	}, [tgAuth, auth]);
	if (!(auth && tgAuth)) {
		return (
			<div
				style={{
					width: "100vw",
					height: "100vh",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<CircularProgress />{" "}
			</div>
		);
	}

	return <Outlet />;
};

export default ProtectedRoute;
