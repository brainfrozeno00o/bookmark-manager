// this page contains all the logic for adding a bookmark
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Bookmark } from '../model/bookmark-model';
import { addBookmark } from '../state/bookmarks.actions';
import { StringUtils } from 'turbocommons-ts';

@Component({
  selector: 'app-add-bookmark',
  templateUrl: './add-bookmark.component.html',
  styleUrls: ['./add-bookmark.component.css']
})


export class AddBookmarkComponent implements OnInit {
  bookmarkForm = this.fb.group({
    title: ['', Validators.required],
    url: ['', [Validators.required, this.validUrlValidator]],
    group: ['', Validators.required],
  });

  constructor(private store: Store, private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  generateUid() {
    return Date.now().toString(36) + '-' + Math.random().toString(36).substr(2);
  }

  addBookmark(formDirective?: FormGroupDirective, customId?: string): void {
    const bookmarkId: String = !!customId ? customId : this.generateUid();
    const newBookmark: Bookmark = { id: bookmarkId, ...this.bookmarkForm.value};
    this.store.dispatch(addBookmark(newBookmark));
    formDirective?.resetForm();
    this.bookmarkForm.reset();
  }

  validUrlValidator(control: AbstractControl): {[key: string]: any} | null {
    if (control.value) {
      const noProtocol = { 'noProtocol': true };
      const invalidUrl = { 'invalidUrl': true };
      // need the security protocol
      if (control.value.startsWith("www.") || control.value === "www.") {
        return noProtocol;
      } else {
        const url = control.value;
        return StringUtils.isUrl(url) ? null : invalidUrl;
      }
    }
    return null;
  }

}
