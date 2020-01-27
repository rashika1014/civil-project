import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ServicedetailPage } from './servicedetail.page';

describe('ServicedetailPage', () => {
  let component: ServicedetailPage;
  let fixture: ComponentFixture<ServicedetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicedetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ServicedetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
