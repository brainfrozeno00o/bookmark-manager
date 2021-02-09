import { createAction, props } from "@ngrx/store";
import { Bookmark } from "../model/bookmark-model";

export const addBookmark = createAction(
    '[Bookmark List] Add Bookmark',
    props<Bookmark>()
);

export const removeBookmark = createAction(
    '[Bookmark List] Remove Bookmark',
    props<Bookmark>()
);



