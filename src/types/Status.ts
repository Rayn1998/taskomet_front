export enum EStatus {
    NoStatus,
    ReadyToWork,
    InProgress,
    ReWork,
    DailiesForCheck,
    Approved,
    Done,
}
export const StatusLabels: Record<EStatus, string> = {
    [EStatus.NoStatus]: "нет статуса",
    [EStatus.ReadyToWork]: "готова к работе",
    [EStatus.InProgress]: "в работе",
    [EStatus.ReWork]: "на переработку",
    [EStatus.DailiesForCheck]: "дейлиз на проверку",
    [EStatus.Approved]: "approved",
    [EStatus.Done]: "done",
};

export const StatusColors: Record<EStatus, string> = {
    [EStatus.NoStatus]: "rgb(35, 35, 45)",
    [EStatus.ReadyToWork]: "rgb(60, 100, 240)",
    [EStatus.InProgress]: "rgb(60, 50, 200)",
    [EStatus.ReWork]: "rgb(190, 50, 50)",
    [EStatus.DailiesForCheck]: "rgb(190, 190, 25)",
    [EStatus.Approved]: "rgb(10, 120, 10)",
    [EStatus.Done]: "rgb(5, 80, 5)",
};
