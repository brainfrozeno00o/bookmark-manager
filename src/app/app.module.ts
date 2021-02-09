import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookmarksComponent } from './bookmarks/bookmarks.component';
import { StoreModule } from '@ngrx/store';
import { bookmarkReducer } from './state/bookmarks.reducer';
import { AddBookmarkComponent } from './add-bookmark/add-bookmark.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@NgModule({
  declarations: [
    AppComponent,
    BookmarksComponent,
    AddBookmarkComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    StoreModule.forRoot(
      { bookmarks: bookmarkReducer }
    ),
    BrowserAnimationsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
