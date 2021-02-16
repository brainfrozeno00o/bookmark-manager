// this page contains all the logic for showing the bookmarks
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { of, Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Bookmark } from '../model/bookmark-model';
import { editBookmark, removeBookmark } from '../state/bookmarks.actions';
import { selectBookmarksByGroup } from '../state/bookmarks.selector';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.css']
})
export class BookmarksComponent implements OnInit {
  bookmarks$: Observable<Bookmark[]>; // the observable to get the current state
  bookmarksSubscription!: Subscription; // to be used for unsubscribing once the component is destroyed
  bookmarks: Bookmark[] = []; // this is needed as the helper for getting the groups, and also for determining the length of all bookmarks

  groups$: Observable<String[]>;
  groups: String[] = [];
  
  selected: String = "All"; // this is for the default option in the select options

  constructor(
    private store: Store<{ bookmarks: Bookmark[] }>,
    public dialog: MatDialog,
  ) { 
    this.bookmarks$ = this.store.pipe(select('bookmarks'));
    // use the default option in creating the observable for the groups
    this.groups$ = of([this.selected]);
  }

  ngOnInit(): void {
    this.bookmarksSubscription = this.bookmarks$.pipe(
      switchMap(x => {
        // get all current bookmarks to be then used in the groups observable
        this.bookmarks = x;
        // proceed with the inner observable of getting the groups
        return this.groups$;
      })
    ).subscribe(groups => {
      this.groups = [...groups, ...new Set(this.bookmarks.map(bookmark => bookmark.group))];
    })
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
  templateUrl: 'edit-bookmark-dialog.html'
})
export class EditBookmarkDialog{
  editBookmarkForm = this.fb.group({
    title: ['', Validators.required],
    url: ['', Validators.required],
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

}
