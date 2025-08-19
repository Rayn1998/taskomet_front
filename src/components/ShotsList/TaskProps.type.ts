import ITask from "@shared/types/Task";

export type TaskProps = {
    props: Pick<ITask, "name" | "id" | "status" | "executor_name" | "priority">;
};
