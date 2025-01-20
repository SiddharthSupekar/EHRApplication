import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAppointmentPractitionerComponent } from './add-appointment-practitioner.component';

describe('AddAppointmentPractitionerComponent', () => {
  let component: AddAppointmentPractitionerComponent;
  let fixture: ComponentFixture<AddAppointmentPractitionerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAppointmentPractitionerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAppointmentPractitionerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
