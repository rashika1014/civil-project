import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddslidesPage } from './addslides.page';

describe('AddslidesPage', () => {
  let component: AddslidesPage;
  let fixture: ComponentFixture<AddslidesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddslidesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddslidesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
