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

export const PriorityColors: Record<EPriority, string> = {
    [EPriority.Normal]: "rgba(50, 100, 120, 0.5)",
    [EPriority.Min]: "rgba(60, 150, 100, 0.5)",
    [EPriority.High]: "rgba(120, 50, 50, 1)",
};
