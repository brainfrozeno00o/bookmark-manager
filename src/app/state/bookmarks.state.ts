// this is for initializing the state when the page is loaded
import { Bookmark } from "../model/bookmark-model";

export interface BookmarkState {
    bookmarks: ReadonlyArray<Bookmark>;
}