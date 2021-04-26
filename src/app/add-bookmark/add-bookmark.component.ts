// this page contains all the logic for adding a bookmark
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Bookmark } from '../model/bookmark-model';
import { addBookmark } from '../state/bookmarks.actions';
import { StringUtils } from 'turbocommons-ts';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-bookmark',
  templateUrl: './add-bookmark.component.html',
  styleUrls: ['./add-bookmark.component.css']
})


export class AddBookmarkComponent implements OnInit, OnDestroy {
  bookmarkForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(40)]],
    url: ['', [Validators.required, this.validUrlValidator]],
    group: ['', [Validators.required, Validators.maxLength(20)]],
  });

  bookmarkFormSubscription: Subscription | undefined;

  constructor(private store: Store, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.bookmarkFormSubscription = this.bookmarkForm.valueChanges.subscribe(form => {
      // if the user is currently typing in the bookmark name field, the error will now appear if an error occurs in that field
      if (!!form.title) {
        this.bookmarkForm.controls.title.markAsTouched();
      }

      // if the user is currently typing in the bookmark URL field, the error will now appear if an error occurs in that field
      if (!!form.url) {
        this.bookmarkForm.controls.url.markAsTouched();
      }

      // if the user is currently typing in the bookmark group field, the error will now appear if an error occurs in that field
      if (!!form.group) {
        this.bookmarkForm.controls.group.markAsTouched();
      }
    });
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

  ngOnDestroy() {
    if (this.bookmarkFormSubscription) {
      this.bookmarkFormSubscription.unsubscribe();
    }
  }
}
