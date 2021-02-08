import { createSelector } from  "@ngrx/store";
import { BookmarkState } from "./bookmarks.state";
import { Bookmark } from "../model/bookmark-model";

export const selectBookmarks = createSelector(
    (state: BookmarkState) => state.bookmarks,
    (bookmarks: Bookmark[]) => bookmarks
);