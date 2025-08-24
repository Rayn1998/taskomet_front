export enum EArtistRole {
    Artist = 0,
    Coordinator = 1,
    Supervisor = 2,
    Admin = 3,
    God = 10,
}

export const ArtistRoleLabels: Record<EArtistRole, string> = {
    [EArtistRole.Artist]: "Artist",
    [EArtistRole.Coordinator]: "Coordinator",
    [EArtistRole.Supervisor]: "Supervisor",
    [EArtistRole.Admin]: "Admin",
    [EArtistRole.God]: "God",
};
