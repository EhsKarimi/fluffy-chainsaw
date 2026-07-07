export type UserFontSize = "compact" | "normal" | "large" | "extraLarge";
export type UserDensity = "compact" | "normal" | "comfortable";
export type UserTablePageSize = 10 | 20 | 50 | 100;

export type UserPersonalizationSettings = {
  fontSize: UserFontSize;
  density: UserDensity;
  defaultTablePageSize: UserTablePageSize;
  reduceMotion: boolean;
};
