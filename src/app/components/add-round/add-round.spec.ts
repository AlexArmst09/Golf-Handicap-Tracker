import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRound } from './add-round';

describe('AddRound', () => {
  let component: AddRound;
  let fixture: ComponentFixture<AddRound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRound]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRound);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
