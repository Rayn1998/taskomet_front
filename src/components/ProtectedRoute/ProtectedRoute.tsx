import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";

// import { api } from "@/routes/Api";
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

const email = "test@mail.ru";
const password = "fucking_password";

const ProtectedRoute = ({
	redirectingPath = "/signup",
}: IProtectedRouteProps) => {
	const location = useLocation();
	const navigate = useNavigate();

	// AUTH STORE
	// const { auth, tgAuth, setAuth, setTgAuth } = useAuthStore();
	const { auth, setAuth } = useAuthStore();

	// ERROR STORE
	const { setErrorMessage } = useErrorDataStore();

	// ARTISTS STORE
	const { setArtists } = useArtistStore();

	// useEffect(() => {
	// 	const userDataString = localStorage.getItem("user");
	// 	if (!userDataString) {
	// 		navigate(redirectingPath);
	// 		return;
	// 	}

	// 	const parsedData = JSON.parse(userDataString);
	// 	console.log(parsedData);
	// 	// if (!tgAuth) setTgAuth(parsedData);
	// }, []);

	// useEffect(() => {
	// 	const loadAuth = async () => {
	// 		if (!auth) return;

	// 		try {
	// 			const artist = await api.getArtist(auth.user_name);

	// 			let authArtist;

	// 			if (Array.isArray(artist) && artist.length === 0) {
	// 				authArtist = await api.createArtist({
	// 					name: `${auth.name}`,
	// 					user_name: auth.user_name,
	// 					role: 0,
	// 					photo_url: auth.photo_url ?? "",
	// 					tg_id: auth.tg_id,
	// 					email,
	// 					password,
	// 				});
	// } else {
	// Тут проверка, если артист был создан до регистрации
	// у него не будет id телеграма и фото
	// const artistWithRequiredData = { ...artist };
	// if (auth.id) artistWithRequiredData.tg_id = auth.id;
	// if (tgAuth.photo_url)
	// artistWithRequiredData.photo_url = tgAuth.photo_url;

	// let equalData = true;
	// for (const key of Object.keys(
	// 	artistWithRequiredData,
	// ) as (keyof typeof artistWithRequiredData)[]) {
	// 	if (artistWithRequiredData[key] !== artist[key]) {
	// 		equalData = false;
	// 	}
	// }

	// if (!equalData) {
	// 	const newDataForUpdate = {
	// 		tg_id: artistWithRequiredData.tg_id,
	// 		photo_url: artistWithRequiredData.photo_url,
	// 		user_name: artistWithRequiredData.user_name,
	// 		email,
	// 		password,
	// 	};
	// 	api.updateArtistAfterRegister(newDataForUpdate)
	// 		.then((artist) => {
	// 			snackBar(
	// 				`Welcome to Taskomet, dear ${artist.name}`,
	// 			);
	// 		})
	// 		.catch((_) =>
	// 			snackBar(
	// 				"Something went wrong. Please contact @bodolanov about the problem",
	// 				"error",
	// 			),
	// 		);
	// }

	// authArtist = artistWithRequiredData;
	// }

	// setAuth(authArtist);
	// snackBar(`Welcome back, dear ${authArtist.name}`);

	// const artists = await api.getArtists();
	// if (artists?.length) setArtists(artists);

	// let redirectingPath = location.pathname;
	// if (redirectingPath === "/signup")
	// 	redirectingPath = "/projects";

	// navigate(redirectingPath);
	// } catch (err) {
	// 	if (err instanceof Error) {
	// 		setErrorMessage(err.message);
	// 		navigate("/error-page");
	// 	}
	// }
	// 	};

	// 	loadAuth();
	// }, [auth]);
	// if (!auth) {
	// 	return (
	// 		<div
	// 			style={{
	// 				width: "100vw",
	// 				height: "100vh",
	// 				display: "flex",
	// 				justifyContent: "center",
	// 				alignItems: "center",
	// 			}}
	// 		>
	// 			<CircularProgress />{" "}
	// 		</div>
	// 	);
	// }

	return <Outlet />;
};

export default ProtectedRoute;
