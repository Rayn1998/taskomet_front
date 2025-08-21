export enum ArtistRole {
    Artist = 0,
    Coordinator = 1,
    Supervisor = 2,
    Admin = 3,
    God = 10,
}

export const ArtistRoleLabel: Record<ArtistRole, string> = {
    [ArtistRole.Artist]: "Artist",
    [ArtistRole.Coordinator]: "Coordinator",
    [ArtistRole.Supervisor]: "Supervisor",
    [ArtistRole.Admin]: "Admin",
    [ArtistRole.God]: "God",
};
