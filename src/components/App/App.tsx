import { Routes, Route, Navigate } from "react-router-dom";
import { SnackbarProvider } from "notistack";

// COMPONENTS
import ArtistsLoading from "@/components/ArtistsLoading/ArtistsLoading";
import ContextMenu from "@/components/ContextMenu/ContextMenu";
import CreateArtistPopup from "@/components/Popups/CreateArtist/CreateArtist";
import CreateComment from "@/components/Popups/CreateComment/CreateComment";
import CreateProjectPopup from "@/components/Popups/CreateProject/CreateProject";
import CreateScenePopup from "@/components/Popups/CreateScene/CreateScene";
import CreateTaskPopup from "@/components/Popups/CreateTask/CreateTask";
import ErrorComponent from "@/components/Error/Error";
import ImagePreviewPopup from "@/components/Popups/ImagePreview/ImagePreview";
import MyTasks from "@/components/MyTasks/MyTasks";
import ProjectsList from "@/components/ProjectsList/ProjectsList";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import ScenesList from "@/components/ScenesList/ScenesList";
import ShotsList from "@/components/ShotsList/ShotsList";
import Signup from "@/components/Signup/Signup";

const App = () => {
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
					<Route element={<ProtectedRoute />}>
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
						<Route
							path="/artists-loading"
							element={<ArtistsLoading />}
						/>
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
			</div>
		</SnackbarProvider>
	);
};

export default App;
