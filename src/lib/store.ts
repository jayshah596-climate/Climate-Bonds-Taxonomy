"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Bookmark {
  id: string;
  title: string;
  href: string;
  type: string;
  addedAt: string;
}

export interface HistoryEntry {
  href: string;
  title: string;
  visitedAt: string;
}

interface AppState {
  bookmarks: Bookmark[];
  history: HistoryEntry[];
  compareList: string[];
  toggleBookmark: (bookmark: Omit<Bookmark, "addedAt">) => void;
  isBookmarked: (id: string) => boolean;
  pushHistory: (entry: Omit<HistoryEntry, "visitedAt">) => void;
  clearHistory: () => void;
  toggleCompare: (sectorId: string) => void;
  clearCompare: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      history: [],
      compareList: [],
      toggleBookmark: (bookmark) =>
        set((state) => {
          const exists = state.bookmarks.some((b) => b.id === bookmark.id);
          return {
            bookmarks: exists
              ? state.bookmarks.filter((b) => b.id !== bookmark.id)
              : [{ ...bookmark, addedAt: new Date().toISOString() }, ...state.bookmarks],
          };
        }),
      isBookmarked: (id) => get().bookmarks.some((b) => b.id === id),
      pushHistory: (entry) =>
        set((state) => {
          const filtered = state.history.filter((h) => h.href !== entry.href);
          return {
            history: [{ ...entry, visitedAt: new Date().toISOString() }, ...filtered].slice(0, 50),
          };
        }),
      clearHistory: () => set({ history: [] }),
      toggleCompare: (sectorId) =>
        set((state) => ({
          compareList: state.compareList.includes(sectorId)
            ? state.compareList.filter((id) => id !== sectorId)
            : state.compareList.length >= 4
            ? state.compareList
            : [...state.compareList, sectorId],
        })),
      clearCompare: () => set({ compareList: [] }),
    }),
    { name: "cbte-app-store" }
  )
);
