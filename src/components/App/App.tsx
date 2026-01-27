import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import { snackBar } from "@/utils/snackBar";
import { handleRefresh } from "@/utils/refresh";

// COMPONENTS
// import Admin from "@/components/Admin/Admin";
// import ArtistsLoading from "@/components/ArtistsLoading/ArtistsLoading";
// import ContextMenu from "@/components/ContextMenu/ContextMenu";
// import CreateArtistPopup from "@/components/Popups/CreateArtist/CreateArtist";
// import CreateComment from "@/components/Popups/CreateComment/CreateComment";
// import CreateProjectPopup from "@/components/Popups/CreateProject/CreateProject";
// import CreateScenePopup from "@/components/Popups/CreateScene/CreateScene";
// import CreateTaskPopup from "@/components/Popups/CreateTask/CreateTask";
import ErrorComponent from "@/pages/Error/Error";
// import ImagePreviewPopup from "@/components/Popups/ImagePreview/ImagePreview";
// import MyTasks from "@/components/MyTasks/MyTasks";
import ProjectsList from "@/components/ProjectsList/ProjectsList";
// import ProjectsStatistics from "@/components/ProjectsStatistics/ProjectsStatistics";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
// import ScenesList from "@/components/ScenesList/ScenesList";
// import ShotsList from "@/components/ShotsList/ShotsList";
import Signup from "@/pages/Signup/Signup";
import SignIn from "@/pages/SignIn/SignIn";

// STORES
import { useAuthStore } from "@/zustand/authStore";
import { useRefreshStore } from "@/zustand/refreshStore";
import { useArtistStore } from "@/zustand/artistStore";
import { useProjectsStore } from "@/zustand/projectsStore";
import { useScenesStore } from "@/zustand/scenesStore";
import { useTasksStore } from "@/zustand/tasksStore";

const App = () => {
	const location = useLocation();

	const { startInterval } = useRefreshStore();
	const { auth } = useAuthStore();
	const { setArtists } = useArtistStore();
	const { setProjects } = useProjectsStore();
	const { setScenes } = useScenesStore();
	const { setTasks } = useTasksStore();

	// useEffect(() => {
	// 	if (!auth) return;
	// 	const id = auth.id;
	// 	startInterval(() =>
	// 		handleRefresh(
	// 			location,
	// 			id,
	// 			setArtists,
	// 			setProjects,
	// 			setScenes,
	// 			setTasks,
	// 		),
	// 	);
	// 	setTimeout(() => snackBar("Auto refresh every minute", "info"), 3000);
	// }, [auth]);

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
					<Route path="/projects" element={<ProjectsList />} />
					{/* <Route
							path="/projects/:projectId"
							element={<ScenesList />}
						/>
						<Route
							path="/projects/:projectId/:sceneId"
							element={<ShotsList />}
						/>
						<Route path="/my-tasks" element={<MyTasks />} />
						<Route
							path="/artists-loading"
							element={<ArtistsLoading />}
						/>
						<Route path="/admin" element={<Admin />} />
						<Route
							path="/projects-statistics"
							element={<ProjectsStatistics />}
						/> */}
					{/* </Route> */}

					<Route path="/signup" element={<Signup />} />
					<Route path="/signin" element={<SignIn />} />
					<Route path="/error-page" element={<ErrorComponent />} />
					<Route path="/not-found" element={<ErrorComponent />} />
					<Route
						path="*"
						element={<Navigate to="/not-found" replace />}
					/>
				</Routes>
				{/* <CreateArtistPopup />
				<CreateProjectPopup />
				<CreateScenePopup />
				<CreateTaskPopup />
				<CreateComment />
				<ContextMenu />
				<ImagePreviewPopup /> */}
			</div>
		</SnackbarProvider>
	);
};

export default App;
