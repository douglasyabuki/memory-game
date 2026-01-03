export interface RenamingItem {
  original: string;
  new: string;
}

export type RenamingMap = Record<string, RenamingItem[]>;
