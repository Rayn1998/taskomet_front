import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// COMPONENTS
import ProjectsList from "@/components/ProjectsList/ProjectsList";
import ScenesList from "@/components/ScenesList/ScenesList";
import ShotsList from "@/components/ShotsList/ShotsList";
import Signup from "@/components/Signup/Signup";
import Error from "@/components/Error/Error";
import CreateArtistPopup from "@/components/Popups/CreateArtist/CreateArtist";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import CreateProjectPopup from "../Popups/CreateProject/CreateProject";
import CreateScenePopup from "../Popups/CreateScene/CreateScene";
import CreateTaskPopup from "../Popups/CreateTask/CreateTask";

import { api } from "@/utils/Api";

// STORES
import { useArtistStore } from "@/zustand/artistStore";

const App = () => {
	// ARTIST STORE
	const setArtists = useArtistStore((state) => state.setArtists);

	// FOR TESTING
	// const hydrateAuth = useAuthStore((state) => state.hydrateAuth);
	// useEffect(() => {
	//     hydrateAuth();
	// }, []);
	// const isAuth = Boolean(useAuthStore((state) => state.auth));a

	useEffect(() => {
		(async () => {
			const artistList = await api.getArtists();
			if (artistList.length > 0) {
				setArtists(artistList);
			}
		})();
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
		</div>
	);
};

export default App;
