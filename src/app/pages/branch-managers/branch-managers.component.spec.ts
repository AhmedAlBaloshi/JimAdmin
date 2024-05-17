import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchManagersComponent } from './branch-managers.component';

describe('BranchManagersComponent', () => {
  let component: BranchManagersComponent;
  let fixture: ComponentFixture<BranchManagersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchManagersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchManagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
