import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsDraftsComponent } from './news-drafts.component';

describe('NewsDraftsComponent', () => {
  let component: NewsDraftsComponent;
  let fixture: ComponentFixture<NewsDraftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsDraftsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsDraftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
