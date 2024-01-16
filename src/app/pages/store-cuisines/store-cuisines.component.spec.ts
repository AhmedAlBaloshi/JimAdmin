import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreCuisinesComponent } from './store-cuisines.component';

describe('StoreCuisinesComponent', () => {
  let component: StoreCuisinesComponent;
  let fixture: ComponentFixture<StoreCuisinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreCuisinesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreCuisinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
