import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryImageDialogComponent } from './gallery-image-dialog.component';

describe('GalleryImageDialogComponent', () => {
  let component: GalleryImageDialogComponent;
  let fixture: ComponentFixture<GalleryImageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryImageDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
