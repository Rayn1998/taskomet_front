export enum EStatus {
    NoStatus = 0,
    ReadyToWork = 1,
    InProgress = 2,
    DailiesForCheck = 3,
    Approved = 4,
    Done = 5,
}
export const StatusLabels: Record<EStatus, string> = {
    [EStatus.NoStatus]: "нет статуса",
    [EStatus.ReadyToWork]: "готова к работе",
    [EStatus.InProgress]: "в работе",
    [EStatus.DailiesForCheck]: "дейлиз на проверку",
    [EStatus.Approved]: "approved",
    [EStatus.Done]: "done",
};
