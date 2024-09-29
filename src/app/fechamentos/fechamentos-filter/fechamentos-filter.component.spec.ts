import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FechamentosFilterComponent } from './fechamentos-filter.component';

describe('FechamentosFilterComponent', () => {
  let component: FechamentosFilterComponent;
  let fixture: ComponentFixture<FechamentosFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FechamentosFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FechamentosFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
