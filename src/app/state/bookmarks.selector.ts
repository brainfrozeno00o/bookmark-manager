import { createSelector } from '@ngrx/store';
import { Bookmark } from '../model/bookmark-model';
import { BookmarkState } from './bookmarks.state';

export const selectBookmarks = (state: BookmarkState) => state.bookmarks;

export const selectBookmarksByGroup = createSelector(
    selectBookmarks,
    (bookmarks: Bookmark[], props: String) => {
        if (props === "All") return bookmarks;
        else return bookmarks.filter(bookmark => bookmark.group === props);
    }
)