import { useEffect } from "react";
import { useNavigate, Routes, Route, Navigate } from "react-router-dom";
import { SnackbarProvider } from "notistack";

// COMPONENTS
import ProjectsList from "@/components/ProjectsList/ProjectsList";
import ScenesList from "@/components/ScenesList/ScenesList";
import ShotsList from "@/components/ShotsList/ShotsList";
import Signup from "@/components/Signup/Signup";
import ErrorComponent from "@/components/Error/Error";
import CreateArtistPopup from "@/components/Popups/CreateArtist/CreateArtist";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import CreateProjectPopup from "@/components/Popups/CreateProject/CreateProject";
import CreateScenePopup from "@/components/Popups/CreateScene/CreateScene";
import CreateTaskPopup from "@/components/Popups/CreateTask/CreateTask";
import CreateComment from "@/components/Popups/CreateComment/CreateComment";
import ContextMenu from "@/components/ContextMenu/ContextMenu";
import ImagePreviewPopup from "@/components/Popups/ImagePreview/ImagePreview";
import MyTasks from "@/components/MyTasks/MyTasks";

import { api } from "@/utils/Api";

// STORES
import { useArtistStore } from "@/zustand/artistStore";
import { useAuthStore } from "@/zustand/authStore";
import { useErrorDataStore } from "@/zustand/errorDataStore";

const App = () => {
	const navigate = useNavigate();

	// ARTIST STORE
	const setArtists = useArtistStore((state) => state.setArtists);

	// ERROR STORE
	const { setErrorMessage } = useErrorDataStore();

	// FOR TESTING
	// const hydrateAuth = useAuthStore((state) => state.hydrateAuth);
	// useEffect(() => {
	// 	hydrateAuth();
	// }, []);
	// const isAuth = Boolean(useAuthStore((state) => state.auth));

	useEffect(() => {
		api.getArtists()
			.then((artistList) => {
				if (artistList.length > 0) {
					setArtists(artistList);
				}
			})
			.catch((err) => {
				if (err instanceof Error) {
					setErrorMessage(err.message);
					return navigate("/error-page");
				}
			});
	}, []);

	// FOR DEVELOPING
	const isAuth = true;
	return (
		<SnackbarProvider
			style={{ fontSize: "1.5rem", cursor: "pointer" }}
			autoHideDuration={3000}
		>
			<div className="app">
				<Routes>
					<Route
						path="/"
						element={<Navigate to="/projects" replace />}
					/>
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
						<Route path="/my-tasks" element={<MyTasks />} />
					</Route>

					<Route path="/signup" element={<Signup />} />
					<Route path="/error-page" element={<ErrorComponent />} />
					<Route path="/not-found" element={<ErrorComponent />} />
				</Routes>
				<CreateArtistPopup />
				<CreateProjectPopup />
				<CreateScenePopup />
				<CreateTaskPopup />
				<CreateComment />
				<ContextMenu />
				<ImagePreviewPopup />
				{/* <TelegramAuth /> */}
			</div>
		</SnackbarProvider>
	);
};

export default App;
