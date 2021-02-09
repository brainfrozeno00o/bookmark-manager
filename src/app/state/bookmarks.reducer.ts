// this file defines the reducer for the bookmarks
// it takes the current state and dispatched action in order to return
// a new state

import { createReducer, on, Action } from "@ngrx/store";
import * as BookmarkActions from "./bookmarks.actions";
import { Bookmark } from "../model/bookmark-model";

export const initialState: Bookmark[] = [];

export const bookmarkReducer = createReducer(
    initialState,
    on(BookmarkActions.addBookmark, (state, bookmark) => {
        if (state.find(oneBookmark => oneBookmark.title === bookmark.title)) return state; // avoid duplicates based on title
        else return [...state, bookmark];
    }),
    on(BookmarkActions.removeBookmark, (state, bookmark) => {
        return state.filter((bm) => bm.title !== bookmark.title);
    }),
);