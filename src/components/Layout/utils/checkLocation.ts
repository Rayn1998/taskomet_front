import { Location } from "react-router-dom";

interface checkLocationReturn {
    project: boolean;
    scene: boolean;
    task: boolean;
}

export const checkLocation = (location: Location): checkLocationReturn => {
    const result = {
        project: false,
        scene: false,
        task: false,
    };

    if (location.pathname.split("/").filter((item) => item !== "").length === 1)
        result.project = true;
    if (location.pathname.split("/").filter((item) => item !== "").length === 2)
        result.scene = true;
    if (location.pathname.split("/").slice(2).length >= 2) result.task = true;

    return result;
};
