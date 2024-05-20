import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixasFilterComponent } from './fixas-filter.component';

describe('FixasFilterComponent', () => {
  let component: FixasFilterComponent;
  let fixture: ComponentFixture<FixasFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixasFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FixasFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
