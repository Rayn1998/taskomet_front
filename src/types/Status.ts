export enum EStatus {
    NoStatus,
    ReadyToWork,
    InProgress,
    DailiesForCheck,
    Approved,
    Done,
}
export const StatusLabels: Record<EStatus, string> = {
    [EStatus.NoStatus]: "нет статуса",
    [EStatus.ReadyToWork]: "готова к работе",
    [EStatus.InProgress]: "в работе",
    [EStatus.DailiesForCheck]: "дейлиз на проверку",
    [EStatus.Approved]: "approved",
    [EStatus.Done]: "done",
};
