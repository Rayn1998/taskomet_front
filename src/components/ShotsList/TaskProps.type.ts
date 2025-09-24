import ITask from "@shared/types/Task";

export type TaskProps = {
    task: ITask;
    orderNum: number;
    selected: boolean;
    handleClick: (name: string) => void;
    handleDoubleClickNavigateToTask?: boolean;
};
