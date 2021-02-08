import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BookmarkState } from '../state/bookmarks.state';
import { Bookmark } from '../model/bookmark-model';
import { map } from 'rxjs/operators';
import { selectBookmarks } from '../state/bookmarks.selector'; 

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.css']
})
export class BookmarksComponent implements OnInit {
  bookmarks$: Observable<Bookmark[]>;
  bookmarks: Bookmark[] = [];

  constructor(private store: Store<BookmarkState>) { 
    this.bookmarks$ = this.store.pipe(select(selectBookmarks));
  }

  ngOnInit(): void {
    this.bookmarks$.pipe(
      map(x => this.bookmarks = x)
    ).subscribe();
  }
}
