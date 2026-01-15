import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileChangePasswordDialogComponent } from './profile-change-password-dialog.component';

describe('ProfileChangePasswordDialogComponent', () => {
  let component: ProfileChangePasswordDialogComponent;
  let fixture: ComponentFixture<ProfileChangePasswordDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileChangePasswordDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileChangePasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
