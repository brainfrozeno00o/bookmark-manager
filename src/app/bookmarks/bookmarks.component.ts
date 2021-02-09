// this page contains all the logic for showing the bookmarks
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { of, Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { BookmarkState } from '../state/bookmarks.state';
import { selectBookmarks } from '../state/bookmarks.selector'; 
import { Bookmark } from '../model/bookmark-model';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.css']
})
export class BookmarksComponent implements OnInit {
  bookmarks$: Observable<Bookmark[]>;
  bookmarksSubscription!: Subscription;
  bookmarks: Bookmark[] = [];
  allBookmarks: Bookmark[] = [];

  groups$: Observable<String[]>;
  groups: String[] = [];
  
  selected: String = "All"; // this is for the default option in the select options

  constructor(private store: Store<BookmarkState>) { 
    this.bookmarks$ = this.store.pipe(select(selectBookmarks));
    this.groups$ = of(["All"]);
  }

  ngOnInit(): void {
    this.bookmarksSubscription = this.bookmarks$.pipe(
      switchMap(x => {
        this.bookmarks = x;
        this.allBookmarks = this.bookmarks;
        return this.groups$;
      })
    ).subscribe(groups => {
      this.groups = [...groups, ...new Set(this.bookmarks.map(bookmark => bookmark.group))];
      console.log(this.groups);
    })
  }

  showCurrentValue(choice: String) {
    this.bookmarks = this.allBookmarks; // reset to all bookmarks first
    if (choice !== "All") {
      this.bookmarks = this.bookmarks.filter(bookmark => bookmark.group === choice);     
    }
  }

  // destroy subscription
  ngOnDestroy(): void {
    if (this.bookmarksSubscription) {
      this.bookmarksSubscription.unsubscribe();
    }
  }
}
