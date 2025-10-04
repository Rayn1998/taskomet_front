import { checkLocation } from "./checkLocation";
import { api } from "./Api";
import { snackBar } from "./snackBar";

export const handleRefresh = (
    location: any,
    setProjects: (data: any) => void,
    setScenes: (data: any, projectName: any) => void,
    setTasks: (data: any, path: any) => void,
) => {
    const currentLocation = checkLocation(location);

    if (currentLocation.project || currentLocation.artistsLoading) {
        api.getProjects()
            .then(setProjects)
            .catch(() => snackBar("Can't receive projects", "error"));
    }

    if (currentLocation.scene || currentLocation.artistsLoading) {
        const projectName = location.pathname.split("/").pop();
        projectName &&
            api
                .getScenes(projectName)
                .then((scenes) => setScenes(scenes, projectName))
                .catch(() => snackBar("Can't receive scenes", "error"));
    }

    if (
        currentLocation.task ||
        currentLocation.myTasks ||
        currentLocation.artistsLoading
    ) {
        const [projectName, sceneName] = location.pathname.split("/").slice(-2);
        if (!(projectName && sceneName)) return;

        api.getTasks(projectName, sceneName)
            .then((tasks) => setTasks(tasks, location.pathname))
            .catch(() => snackBar("Can't receive tasks", "error"));
    }

    snackBar("Refreshed!", "success");
};
