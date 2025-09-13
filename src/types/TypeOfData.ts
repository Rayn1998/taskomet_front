export enum TypeOfData {
    SettingTheTask,
    Comment,
    Dailies,
    Status,
}

export const TypeOfDataLabels: Record<TypeOfData, string> = {
    [TypeOfData.Comment]: "Comment",
    [TypeOfData.Dailies]: "Dailies",
    [TypeOfData.SettingTheTask]: "Setting the task",
    [TypeOfData.Status]: "Status",
};

export const TypeOfDataColor: Record<TypeOfData, string> = {
    [TypeOfData.Comment]: "rgb(180, 20, 20)",
    [TypeOfData.Dailies]: "rgb(200, 200, 20)",
    [TypeOfData.SettingTheTask]: "rgb(140, 140, 140)",
    [TypeOfData.Status]: "rgb(0, 120, 230)",
};
