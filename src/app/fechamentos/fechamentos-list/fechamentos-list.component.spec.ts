import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FechamentosListComponent } from './fechamentos-list.component';

describe('FechamentosListComponent', () => {
  let component: FechamentosListComponent;
  let fixture: ComponentFixture<FechamentosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FechamentosListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FechamentosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
