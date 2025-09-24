import { Location } from "react-router-dom";

interface checkLocationReturn {
    project: boolean;
    scene: boolean;
    task: boolean;
    myTasks: boolean;
    artistsLoading: boolean;
}

export const checkLocation = (location: Location): checkLocationReturn => {
    const result = {
        project: false,
        scene: false,
        task: false,
        myTasks: false,
        artistsLoading: false,
    };
    const path = location.pathname
        .split("/")
        .slice(1)
        .filter((stringPath) => stringPath.length !== 0);

    const ifProjects = (path: string[]) => path.includes("projects");
    if (path.length === 1 && ifProjects(path)) result.project = true;
    if (path.length === 1 && !ifProjects(path) && path.includes("my-tasks"))
        result.myTasks = true;
    if (
        path.length === 1 &&
        !ifProjects(path) &&
        path.includes("artists-loading")
    )
        result.artistsLoading = true;
    if (path.length === 2 && ifProjects(path)) result.scene = true;
    if (path.length === 3 && ifProjects(path)) result.task = true;
    return result;
};
