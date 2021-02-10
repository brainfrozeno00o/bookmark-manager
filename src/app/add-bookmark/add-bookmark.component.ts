// this page contains all the logic for adding a bookmark
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Bookmark } from '../model/bookmark-model';
import { addBookmark } from '../state/bookmarks.actions';

@Component({
  selector: 'app-add-bookmark',
  templateUrl: './add-bookmark.component.html',
  styleUrls: ['./add-bookmark.component.css']
})


export class AddBookmarkComponent implements OnInit {
  bookmarkForm = this.fb.group({
    title: ['', Validators.required],
    url: ['', Validators.required],
    group: ['', Validators.required],
  });

  hasFormError: boolean = false;

  constructor(private store: Store, private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  addBookmark(formDirective?: FormGroupDirective): void {
    this.bookmarkForm.get('url')?.patchValue('https://www.' + this.bookmarkForm.get('url')?.value);
    const newBookmark: Bookmark = {...this.bookmarkForm.value};
    this.store.dispatch(addBookmark(newBookmark));
    formDirective?.resetForm();
    this.bookmarkForm.reset();
  }

}
