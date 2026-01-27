import { checkLocation } from "./checkLocation";
import { snackBar } from "./snackBar";

// API
import { artitstApi } from "@/routes/artists.api";
import { projectsApi } from "@/routes/projects.api";
import { scenesApi } from "@/routes/scenes.api";
import { tasksApi } from "@/routes/tasks.api";

export const handleRefresh = (
    location: any,
    id: number,
    setArtists: (data: any) => void,
    setProjects: (data: any) => void,
    setScenes: (data: any, projectName: any) => void,
    setTasks: (data: any, path: any) => void,
) => {
    const currentLocation = checkLocation(location);

    artitstApi
        .getAll()
        .then((artists) => {
            setArtists(artists);
        })
        .catch(() => console.log("error"));

    if (currentLocation.project || currentLocation.artistsLoading) {
        projectsApi
            .getAll()
            .then(setProjects)
            .catch(() => snackBar("Can't receive projects", "error"));
    }

    if (currentLocation.scene || currentLocation.artistsLoading) {
        const projectName = location.pathname.split("/").pop();
        projectName &&
            scenesApi
                .getAll(projectName)
                .then((scenes) => setScenes(scenes, projectName))
                .catch(() => snackBar("Can't receive scenes", "error"));
    }

    if (currentLocation.task) {
        const [projectName, sceneName] = location.pathname.split("/").slice(-2);
        if (!(projectName && sceneName)) return;

        tasksApi
            .getAllForScene(projectName, sceneName)
            .then((tasks) => setTasks(tasks, location.pathname))
            .catch(() => snackBar("Can't receive tasks", "error"));
    }

    if (currentLocation.myTasks || currentLocation.artistsLoading) {
        // в artistsLoading сейчас не работает. Надо понять как передавать выбранный id. Новый стор?
        tasksApi
            .getMyTasks(id)
            .then((tasks) => {
                setTasks(tasks, location.pathname);
            })
            .catch((err) => console.error(err));
    }

    snackBar("Refreshed!", "success");
};
