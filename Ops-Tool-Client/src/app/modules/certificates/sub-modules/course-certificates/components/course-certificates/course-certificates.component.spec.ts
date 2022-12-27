import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCertificatesComponent } from './course-certificates.component';

describe('CourseCertificatesComponent', () => {
  let component: CourseCertificatesComponent;
  let fixture: ComponentFixture<CourseCertificatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseCertificatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseCertificatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
