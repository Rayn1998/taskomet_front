export enum EArtistRole {
    Artist,
    Coordinator,
    Supervisor,
    Admin,
    God = 10,
}

export const ArtistRoleLabels: Record<EArtistRole, string> = {
    [EArtistRole.Artist]: "Artist",
    [EArtistRole.Coordinator]: "Coordinator",
    [EArtistRole.Supervisor]: "Supervisor",
    [EArtistRole.Admin]: "Admin",
    [EArtistRole.God]: "God",
};
