import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { selectBookmarks } from './state/bookmarks.selector'; 
import { BookmarkState } from './state/bookmarks.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'bookmark-manager';

  bookmarks$ = this.store.pipe(select(selectBookmarks));

  constructor(
    private store: Store<BookmarkState>
  ) {}
}
