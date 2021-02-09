// this page contains all the logic for adding a bookmark
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Bookmark } from '../model/bookmark-model';
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

  addToBookmark(bookmarkForm: NgForm): void {
    const newBookmark : Bookmark = {
      title: this.title,
      url: this.url,
      group: this.group,
    }

    bookmarkForm.reset();

    this.store.dispatch(addBookmark(newBookmark));
  }

}
