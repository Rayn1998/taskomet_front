import { checkLocation } from "./checkLocation";
import { api } from "./Api";
import { snackBar } from "./snackBar";

export const handleRefresh = (
    location: any,
    id: number,
    setArtists: (data: any) => void,
    setProjects: (data: any) => void,
    setScenes: (data: any, projectName: any) => void,
    setTasks: (data: any, path: any) => void,
) => {
    const currentLocation = checkLocation(location);

    api.getArtists()
        .then((artists) => {
            setArtists(artists);
        })
        .catch(() => console.log("error"));

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

    if (currentLocation.task) {
        const [projectName, sceneName] = location.pathname.split("/").slice(-2);
        if (!(projectName && sceneName)) return;

        api.getTasks(projectName, sceneName)
            .then((tasks) => setTasks(tasks, location.pathname))
            .catch(() => snackBar("Can't receive tasks", "error"));
    }

    if (currentLocation.myTasks || currentLocation.artistsLoading) {
        // в artistsLoading сейчас не работает. Надо понять как передавать выбранный id. Новый стор?
        api.getMyTasks(id)
            .then((tasks) => {
                setTasks(tasks, location.pathname);
            })
            .catch((err) => console.error(err));
    }

    snackBar("Refreshed!", "success");
};
