import { createReducer, on } from "@ngrx/store";
import * as BookmarkActions from "./bookmarks.actions";
import { Bookmark } from "../model/bookmark-model";

export const initialState: Bookmark[] = [];

export const bookmarkReducer = createReducer(
    initialState,
    on(BookmarkActions.addBookmark, (state, bookmark) => {
        // avoid duplicates based on title and if they are in the same group
        if (state.find(oneBookmark => oneBookmark.title === bookmark.title && oneBookmark.group === bookmark.group)) return state; 
        else return [...state, bookmark];
    }),
    on(BookmarkActions.removeBookmark, (state, bookmark) => {
        return state.filter((bm) => bm.id !== bookmark.id); // the unique identifier is now based on ID
    }),
);