// this page contains all the logic for showing the bookmarks
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Bookmark } from '../model/bookmark-model';
import { editBookmark, removeBookmark } from '../state/bookmarks.actions';
import { selectBookmarksByGroup } from '../state/bookmarks.selector';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StringUtils } from 'turbocommons-ts';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.css'],
})
export class BookmarksComponent implements OnInit, OnDestroy {
  bookmarks$: Observable<Bookmark[]>; // the observable to get the current state
  bookmarksSubscription!: Subscription; // to be used for unsubscribing once the component is destroyed
  bookmarks: Bookmark[] = []; // this is needed as the helper for getting the groups, and also for determining the length of all bookmarks

  groups: String[] = ['All'];

  selected: String = this.groups[0]; // this is for the default option in the select options

  constructor(
    private store: Store<{ bookmarks: Bookmark[] }>,
    public dialog: MatDialog,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar
  ) {
    // get all bookmarks from the start and only once
    this.bookmarks$ = this.store.pipe(select('bookmarks'));
  }

  ngOnInit(): void {
    this.bookmarksSubscription = this.bookmarks$
      .pipe(
        map((bookmarks) => {
          this.bookmarks = bookmarks;
          this.groups = [
            'All',
            ...new Set(bookmarks.map((bookmark) => bookmark.group)),
          ];
        })
      )
      .subscribe();
  }

  // only invoked when the select/dropdown is changed
  showCurrentGroup(choice: String) {
    this.bookmarks$ = this.store.pipe(select(selectBookmarksByGroup, choice));
  }

  // invoked when clicking the delete bookmark
  removeBookmark(bookmark: Bookmark) {
    // if there is one more bookmark left for a specific group, force the selection back to All
    if (
      this.bookmarks.filter((bmrk) => bmrk.group === bookmark.group).length ===
      1
    ) {
      this.selected = 'All';
      this.showCurrentGroup(this.selected);
    }

    this.store.dispatch(removeBookmark(bookmark));
  }

  // open the edit dialog
  openEditDialog(bookmark: Bookmark) {
    this.dialog.open(EditBookmarkDialog, {
      data: bookmark,
      restoreFocus: false,
    });
  }

  // open the delete dialog
  openDeleteDialog(bookmark: Bookmark) {
    let deleteDialog = this.dialog.open(DeleteBookmarkDialog, {
      data: bookmark,
      restoreFocus: false,
    });

    deleteDialog
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result) this.removeBookmark(result.data);
      });
  }

  // copy the link to the clipboard
  copyLinkToClipboard(bookmarkUrl: string) {
    if (this.clipboard.copy(bookmarkUrl)) {
      this.snackBar.open('Successfully copied to clipboard!', undefined, {
        duration: 2000,
      });
    }
  }

  // destroy subscription
  ngOnDestroy(): void {
    if (this.bookmarksSubscription) {
      this.bookmarksSubscription.unsubscribe();
    }
  }
}

// Edit Bookmark Dialog
@Component({
  selector: 'edit-bookmark-dialog',
  templateUrl: 'edit-bookmark-dialog.html',
  styleUrls: ['./bookmarks.component.css'],
})
export class EditBookmarkDialog implements OnInit, OnDestroy {
  editBookmarkForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(40)]],
    url: ['', [Validators.required, this.validUrlValidator]],
    group: ['', [Validators.required, Validators.maxLength(40)]],
  });

  editBookmarkFormSubscription: Subscription | undefined;

  constructor(
    public dialogRef: MatDialogRef<EditBookmarkDialog>,
    private store: Store,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public bookmark: Bookmark
  ) {
    this.editBookmarkForm.patchValue({
      id: bookmark.id,
      title: bookmark.title,
      url: bookmark.url,
      group: bookmark.group,
    });
  }

  ngOnInit() {
    this.editBookmarkFormSubscription = this.editBookmarkForm.valueChanges.subscribe(
      (form) => {
        // if the user is currently typing in the bookmark name field, the error will now appear if an error occurs in that field
        if (!!form.title) {
          this.editBookmarkForm.controls.title.markAsTouched();
        }

        // if the user is currently typing in the bookmark URL field, the error will now appear if an error occurs in that field
        if (!!form.url) {
          this.editBookmarkForm.controls.url.markAsTouched();
        }

        // if the user is currently typing in the bookmark group field, the error will now appear if an error occurs in that field
        if (!!form.group) {
          this.editBookmarkForm.controls.group.markAsTouched();
        }
      }
    );
  }

  // invoked when editing the bookmark
  editBookmark() {
    const editedBookmark = {
      id: this.bookmark.id,
      ...this.editBookmarkForm.value,
    };
    this.store.dispatch(editBookmark(editedBookmark));
    this.editBookmarkForm.reset();
    this.dialogRef.close();
  }

  // invoked when cancelling the edit
  cancelEdit() {
    this.dialogRef.close();
  }

  validUrlValidator(control: AbstractControl): { [key: string]: any } | null {
    if (control.value) {
      const noProtocol = { noProtocol: true };
      const invalidUrl = { invalidUrl: true };
      // need the security protocol
      if (control.value.startsWith('www.') || control.value === 'www.') {
        return noProtocol;
      } else {
        const url = control.value;
        return StringUtils.isUrl(url) ? null : invalidUrl;
      }
    }
    return null;
  }

  ngOnDestroy() {
    if (this.editBookmarkFormSubscription) {
      this.editBookmarkFormSubscription.unsubscribe();
    }
  }
}

// Delete Bookmark Dialog
@Component({
  selector: 'delete-bookmark-dialog',
  templateUrl: 'delete-bookmark-dialog.html',
  styleUrls: ['./bookmarks.component.css'],
})
export class DeleteBookmarkDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteBookmarkDialog>,
    @Inject(MAT_DIALOG_DATA) public bookmark: Bookmark
  ) {}

  // take note of the bookmark upon closing
  deleteBookmark() {
    this.dialogRef.close({ data: this.bookmark });
  }

  // cancel deleting the bookmark
  cancelDelete() {
    this.dialogRef.close();
  }
}
