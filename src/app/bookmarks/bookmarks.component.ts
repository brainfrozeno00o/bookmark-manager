// this page contains all the logic for showing the bookmarks
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Bookmark } from '../model/bookmark-model';
import { editBookmark, removeBookmark } from '../state/bookmarks.actions';
import { selectBookmarksByGroup } from '../state/bookmarks.selector';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StringUtils } from 'turbocommons-ts';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.css']
})
export class BookmarksComponent implements OnInit, OnDestroy {
  bookmarks$: Observable<Bookmark[]>; // the observable to get the current state
  bookmarksSubscription!: Subscription; // to be used for unsubscribing once the component is destroyed
  bookmarks: Bookmark[] = []; // this is needed as the helper for getting the groups, and also for determining the length of all bookmarks

  groups: String[] = ["All"];
  
  selected: String = this.groups[0]; // this is for the default option in the select options

  constructor(
    private store: Store<{ bookmarks: Bookmark[] }>,
    public dialog: MatDialog,
  ) {
    // get all bookmarks from the start and only once 
    this.bookmarks$ = this.store.pipe(select('bookmarks'));
  }

  ngOnInit(): void {
    this.bookmarksSubscription = this.bookmarks$.pipe(
      map(bookmarks => {
        this.bookmarks = bookmarks;
        this.groups = ["All", ...new Set(bookmarks.map(bookmark => bookmark.group))];
      })
    ).subscribe(_ => {
      console.log(`Subscribed with the following: \nBookmarks: ${this.bookmarks}\nBookmark Groups: ${this.groups}`);
    });
  }

  // only invoked when the select/dropdown is changed
  showCurrentGroup(choice: String) {
    this.bookmarks$ = this.store.pipe((
      select(selectBookmarksByGroup, choice)
    ));
  }

  // invoked when clicking the delete bookmark
  removeBookmark(bookmark: Bookmark) {
    // if there is one more bookmark left for a specific group, force the selection back to All
    if (this.bookmarks.filter(bmrk => bmrk.group === bookmark.group).length === 1) {
      this.selected = "All";
      this.showCurrentGroup(this.selected);
    }

    this.store.dispatch(removeBookmark(bookmark));
  }

  // open the edit dialog
  openEditDialog(bookmark: Bookmark) {
    const dialogRef = this.dialog.open(EditBookmarkDialog, {data: bookmark});
  }

  // destroy subscription
  ngOnDestroy(): void {
    if (this.bookmarksSubscription) {
      this.bookmarksSubscription.unsubscribe();
    }
  }
}

@Component({
  selector: 'edit-bookmark-dialog',
  templateUrl: 'edit-bookmark-dialog.html',
  styleUrls: ['./bookmarks.component.css']
})
export class EditBookmarkDialog{
  editBookmarkForm = this.fb.group({
    title: ['', Validators.required],
    url: ['', [Validators.required, this.validUrlValidator]],
    group: ['', Validators.required],
  });

  constructor(
    public dialogRef: MatDialogRef<EditBookmarkDialog>,
    private store: Store,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public bookmark: Bookmark
  ) {
    this.editBookmarkForm.patchValue({
      id: bookmark.id,
      title: bookmark.title,
      url: bookmark.url.slice(12),
      group: bookmark.group
    });
  }
  
  // invoked when editing the bookmark
  editBookmark() {
    this.editBookmarkForm.get('url')?.patchValue('https://www.' + this.editBookmarkForm.get('url')?.value);
    const editedBookmark = { id:this.bookmark.id, ...this.editBookmarkForm.value };
    this.store.dispatch(editBookmark(editedBookmark));
    this.editBookmarkForm.reset();
    this.dialogRef.close();
  }

  // invoked when cancelling the edit 
  cancelEdit() {
    this.dialogRef.close();
  }

  validUrlValidator(control: AbstractControl): {[key: string]: any} | null {
    if (control.value) {
      const invalidUrl = { 'invalidUrl': true };
      // due to the 'www.' found in the form, no need to type www.
      if (control.value.startsWith("www.") || control.value === "www.") {
        return invalidUrl;
      } else {
        const url = "https://" + control.value; // add the protocol to make sure that is covered
        return StringUtils.isUrl(url) ? null : invalidUrl;
      }
    }
    return null;
  }

}
