import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import { snackBar } from "@/utils/snackBar";
import { handleRefresh } from "@/utils/refresh";
import { authApi } from "@/routes/auth.api";

// COMPONENTS
import Admin from "@/pages/Admin/Admin";
import ArtistsLoading from "@/pages/ArtistsLoading/ArtistsLoading";
import ContextMenu from "@/components/ContextMenu/ContextMenu";
import CreateArtistPopup from "@/components/Popups/CreateArtist/CreateArtist";
import CreateComment from "@/components/Popups/CreateComment/CreateComment";
import CreateProjectPopup from "@/components/Popups/CreateProject/CreateProject";
import CreateScenePopup from "@/components/Popups/CreateScene/CreateScene";
import CreateTaskPopup from "@/components/Popups/CreateTask/CreateTask";
import ErrorComponent from "@/pages/Error/Error";
import ImagePreviewPopup from "@/components/Popups/ImagePreview/ImagePreview";
import MyTasks from "@/pages/MyTasks/MyTasks";
import Projects from "@/pages/Projects/Projects";
import ProjectsStatistics from "@/pages/ProjectsStatistics/ProjectsStatistics";
// import ProtectedRoute from "@/components/_ProtectedRoute/ProtectedRoute";
import Scenes from "@/pages/Scenes/Scenes";
import Shots from "@/pages/Shots/Shots";
import Signup from "@/pages/Signup/Signup";
import SignIn from "@/pages/SignIn/SignIn";

// STORES
import { useAuthStore } from "@/zustand/authStore";
import { useRefreshStore } from "@/zustand/refreshStore";
import { useArtistStore } from "@/zustand/artistStore";
import { useProjectsStore } from "@/zustand/projectsStore";
import { useScenesStore } from "@/zustand/scenesStore";
import { useTasksStore } from "@/zustand/tasksStore";
import { artistsApi } from "@/routes/artists.api";

const App = () => {
	const location = useLocation();

	const { startInterval, delay } = useRefreshStore();
	const { auth, setAuth, isAuthChecked, setIsAuthChecked } = useAuthStore();
	const { setArtists } = useArtistStore();
	const { setProjects } = useProjectsStore();
	const { setScenes } = useScenesStore();
	const { setTasks } = useTasksStore();

	useEffect(() => {
		if (isAuthChecked || auth) return;
		authApi.getMe().then((res) => {
			setAuth(res.data);
			setIsAuthChecked(true);
		});
	}, [isAuthChecked, auth]);

	useEffect(() => {
		artistsApi
			.getAll()
			.then((res) => setArtists(res.data))
			.catch((err) => snackBar(err.message, "error"));
	}, []);

	useEffect(() => {
		if (!auth) return;
		const id = auth.id;
		startInterval(() =>
			handleRefresh(
				location,
				id,
				setArtists,
				setProjects,
				setScenes,
				setTasks,
			),
		);
		setTimeout(
			() => snackBar(`Auto refresh every ${delay} minute(s)`, "info"),
			3000,
		);
	}, [auth]);

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
					{/* <Route element={<ProtectedRoute />}> */}
					<Route path="/projects" element={<Projects />} />
					<Route path="/projects/:projectId" element={<Scenes />} />
					<Route
						path="/projects/:projectId/:sceneId"
						element={<Shots />}
					/>
					<Route path="/admin" element={<Admin />} />
					<Route path="/my-tasks" element={<MyTasks />} />
					<Route
						path="/artists-loading"
						element={<ArtistsLoading />}
					/>
					<Route
						path="/projects-statistics"
						element={<ProjectsStatistics />}
					/>
					<Route path="/signup" element={<Signup />} />
					<Route path="/signin" element={<SignIn />} />
					<Route path="/error-page" element={<ErrorComponent />} />
					<Route path="/not-found" element={<ErrorComponent />} />
					<Route
						path="*"
						element={<Navigate to="/not-found" replace />}
					/>
				</Routes>
				<CreateProjectPopup />
				<CreateScenePopup />
				<CreateTaskPopup />
				{/* Создание артиста сейчас поломано */}
				<CreateArtistPopup />
				<CreateComment />
				<ImagePreviewPopup />
				<ContextMenu />
			</div>
		</SnackbarProvider>
	);
};

export default App;
