import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddBookmarkComponent } from './add-bookmark.component';

import { BrowserModule } from '@angular/platform-browser';

import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BookmarkState } from '../state/bookmarks.state';
import { addBookmark } from '../state/bookmarks.actions';

describe('AddBookmarkComponent', () => {
  let component: AddBookmarkComponent;
  let fixture: ComponentFixture<AddBookmarkComponent>;
  let el: HTMLElement;
  let store: MockStore<BookmarkState>;
  let mockBookmarks;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddBookmarkComponent],
      imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatFormFieldModule,
      ],
      providers: [provideMockStore()],
    });
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(AddBookmarkComponent);
    component = fixture.componentInstance;

    mockBookmarks = store.overrideSelector('bookmarks', []);
    spyOn(store, 'dispatch').and.callFake(() => {});
  });

  it('Should create the Add Bookmark Component', () => {
    expect(component).toBeTruthy();
  });

  it(`Should say 'Add Bookmark' as the title of the card`, () => {
    fixture.detectChanges();
    el = fixture.debugElement.nativeElement;
    expect(el.querySelector('div > mat-card > h2')?.textContent).toContain(
      'Add Bookmark'
    );
  });

  it(
    'The form should be invalid as there are no inputs',
    waitForAsync(() => {
      component.bookmarkForm.controls['title'].setValue('');
      component.bookmarkForm.controls['url'].setValue('');
      component.bookmarkForm.controls['group'].setValue('');
      expect(component.bookmarkForm.valid).toBeFalsy();
    })
  );

  it(
    'The form should be valid as there are now inputs',
    waitForAsync(() => {
      component.bookmarkForm.controls['title'].setValue('Facebook');
      component.bookmarkForm.controls['url'].setValue('facebook.com');
      component.bookmarkForm.controls['group'].setValue('Social');
      expect(component.bookmarkForm.valid).toBeTruthy();
    })
  );

  it('Should dispatch to the store once the addBookmark is called with a predefined custom ID', () => {
    const titleControl = component.bookmarkForm.controls['title'];
    const urlControl = component.bookmarkForm.controls['url'];
    const groupControl = component.bookmarkForm.controls['group'];

    titleControl.setValue('Facebook');
    urlControl.setValue('facebook.com');
    groupControl.setValue('Social');
    const newBookmarkId = '1';

    const newBookmark = {
      id: newBookmarkId,
      title: titleControl.value,
      url: 'https://www.' + urlControl.value,
      group: groupControl.value,
    };
    // can be passed without the FormGroupDirective and it should still add to the store
    component.addBookmark(undefined, newBookmarkId);

    expect(store.dispatch).toHaveBeenCalledWith(addBookmark(newBookmark));
  });
});
