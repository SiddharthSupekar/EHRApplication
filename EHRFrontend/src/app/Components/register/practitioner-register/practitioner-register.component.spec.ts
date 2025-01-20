import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PractitionerRegisterComponent } from './practitioner-register.component';

describe('PractitionerRegisterComponent', () => {
  let component: PractitionerRegisterComponent;
  let fixture: ComponentFixture<PractitionerRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PractitionerRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PractitionerRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
