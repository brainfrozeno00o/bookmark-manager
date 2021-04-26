import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';

import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';

import { BookmarksComponent } from './bookmarks.component';

import { BookmarkState } from '../state/bookmarks.state';
import { removeBookmark } from '../state/bookmarks.actions';

describe('BookmarksComponent', () => {
  let fixture: ComponentFixture<BookmarksComponent>;
  let component: BookmarksComponent;
  let store: MockStore<BookmarkState>;
  let mockBookmarksSelector;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatDividerModule,
        MatIconModule,
        FlexLayoutModule,
      ],
      declarations: [BookmarksComponent],
      providers: [provideMockStore()],
    });
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(BookmarksComponent);
    component = fixture.componentInstance;

    mockBookmarksSelector = store.overrideSelector('bookmarks', [
      {
        id: '1',
        title: 'Facebook',
        url: 'facebook.com',
        group: 'Social',
      },
      {
        id: '2',
        title: 'Twitter',
        url: 'twitter.com',
        group: 'Social',
      },
      {
        id: '3',
        title: 'Instagram',
        url: 'instagram.com',
        group: 'Social',
      },
      {
        id: '4',
        title: 'Synpulse',
        url: 'synpulse.com',
        group: 'Work',
      },
    ]);
  });

  it('Should create the Add Bookmark Component', () => {
    expect(component).toBeTruthy();
  });

  it('Should remove the bookmark when dispatch is called', () => {
    spyOn(store, 'dispatch').and.callFake(() => {});
    component.removeBookmark({
      id: '4',
      title: 'Synpulse',
      url: 'synpulse.com',
      group: 'Work',
    });
    expect(store.dispatch).toHaveBeenCalledWith(
      removeBookmark({
        id: '4',
        title: 'Synpulse',
        url: 'synpulse.com',
        group: 'Work',
      })
    );
  });
});
