import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// COMPONENTS
import ProjectsList from "@/components/ProjectsList/ProjectsList";
import ScenesList from "@/components/ScenesList/ScenesList";
import ShotsList from "@/components/ShotsList/ShotsList";
import Signup from "@/components/Signup/Signup";
import Error from "@/components/Error/Error";
import CreateArtistPopup from "@/components/Popups/CreateArtist/CreateArtist";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import CreateProjectPopup from "@/components/Popups/CreateProject/CreateProject";
import CreateScenePopup from "@/components/Popups/CreateScene/CreateScene";
import CreateTaskPopup from "@/components/Popups/CreateTask/CreateTask";
import ContextMenu from "@/components/App/components/ContextMenu/ContextMenu";

// MUI
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";

import { api } from "@/utils/Api";

// STORES
import { useArtistStore } from "@/zustand/artistStore";
import { useSnackBarStore } from "@/zustand/snackBarStore";

const App = () => {
	// const handleContextMenuClick = (e: MouseEventHandler<HTMLElement>) => {
	// e.preventDefault();
	// e.stopPropagation();
	// setAnchorEl(e.);
	// };

	const {
		open: snackBarOpen,
		message: snackBarMessage,
		setOpen: setSnackBarOpen,
	} = useSnackBarStore();

	// ARTIST STORE
	const setArtists = useArtistStore((state) => state.setArtists);

	const handleSnackBarClose = () => setSnackBarOpen(false);

	// FOR TESTING
	// const hydrateAuth = useAuthStore((state) => state.hydrateAuth);
	// useEffect(() => {
	//     hydrateAuth();
	// }, []);
	// const isAuth = Boolean(useAuthStore((state) => state.auth));a

	useEffect(() => {
		api.getArtists()
			.then((artistList) => {
				if (artistList.length > 0) {
					setArtists(artistList);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	// FOR DEVELOPING
	const isAuth = true;
	return (
		<div className="app">
			<Routes>
				<Route path="/" element={<Navigate to="/projects" replace />} />
				<Route element={<ProtectedRoute isAuth={isAuth} />}>
					<Route path="/projects" element={<ProjectsList />} />
					<Route
						path="/projects/:projectId"
						element={<ScenesList />}
					/>
					<Route
						path="/projects/:projectId/:sceneId"
						element={<ShotsList />}
					/>
				</Route>

				<Route path="/signup" element={<Signup />} />
				<Route path="/error-page" element={<Error />} />
				<Route path="/not-found" element={<Error />} />
			</Routes>
			<CreateArtistPopup />
			<CreateProjectPopup />
			<CreateScenePopup />
			<CreateTaskPopup />
			<Snackbar
				open={snackBarOpen}
				autoHideDuration={5000}
				onClose={handleSnackBarClose}
				slots={{ transition: Slide }}
			>
				<Alert severity="success">{snackBarMessage}</Alert>
			</Snackbar>
			<ContextMenu />
		</div>
	);
};

export default App;
