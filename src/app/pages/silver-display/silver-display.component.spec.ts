import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SilverDisplayComponent } from './silver-display.component';

describe('SilverDisplayComponent', () => {
  let component: SilverDisplayComponent;
  let fixture: ComponentFixture<SilverDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SilverDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SilverDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
