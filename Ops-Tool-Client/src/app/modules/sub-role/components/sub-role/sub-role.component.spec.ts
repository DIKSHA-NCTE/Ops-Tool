import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubRoleComponent } from './sub-role.component';

describe('AddSubroleComponent', () => {
  let component: SubRoleComponent;
  let fixture: ComponentFixture<SubRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
