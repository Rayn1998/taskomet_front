export enum EPriority {
    Normal,
    Min,
    High,
}

export const PriorityLabels: Record<EPriority, string> = {
    [EPriority.Normal]: "нормальный",
    [EPriority.Min]: "минимальный",
    [EPriority.High]: "высокий",
};
