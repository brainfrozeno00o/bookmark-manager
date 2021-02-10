import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MatDividerModule } from '@angular/material/divider';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDividerModule,
      ],
      declarations: [
        AppComponent,
      ],
    }).compileComponents();
  });

  it('Should create the main app component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`Should say 'Bookmark Manager' as the main header of the page`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('Bookmark Manager');
  });
});
