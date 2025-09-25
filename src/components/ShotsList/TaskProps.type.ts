import ITask from "@shared/types/Task";

export type TaskProps = {
    task: ITask;
    orderNum: number;
    selected: boolean;
    handleClick: (taskId: number) => void;
    handleDoubleClickNavigateToTask?: boolean;
};
