import { Component, OnInit } from '@angular/core';
import { Bookmark } from '../model/bookmark-model';
import { Store } from '@ngrx/store';
import { addBookmark } from '../state/bookmarks.actions';

@Component({
  selector: 'app-add-bookmark',
  templateUrl: './add-bookmark.component.html',
  styleUrls: ['./add-bookmark.component.css']
})


export class AddBookmarkComponent implements OnInit {
  title: string = '';
  url: string = '';
  group: string = '';

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  addToBookmark(): void {
    const newBookmark : Bookmark = {
      title: this.title,
      url: this.url,
      group: this.group,
    }

    this.store.dispatch(addBookmark(newBookmark));
  }

}
