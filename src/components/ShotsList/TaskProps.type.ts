import ITask from "@shared/types/Task";

export type TaskProps = {
    props: ITask;
    orderNum: number;
    selected: boolean;
    handleClick: (name: string) => void;
};
