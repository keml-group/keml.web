import {TestBed, tick, fakeAsync, ComponentFixture} from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {

  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', fakeAsync(async () => {
    fixture.detectChanges();
    tick(1000);
    expect(app).toBeTruthy();
  }));

  it(`should have the 'keml.graphical' title`, fakeAsync(async () => {
    fixture.detectChanges();
    tick(1000);
    expect(app.title).toEqual('kemlgui');
  }));

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('KEML Graphical Editor');
  });
});
