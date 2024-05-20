import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixasDeleteComponent } from './fixas-delete.component';

describe('FixasDeleteComponent', () => {
  let component: FixasDeleteComponent;
  let fixture: ComponentFixture<FixasDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixasDeleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FixasDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
