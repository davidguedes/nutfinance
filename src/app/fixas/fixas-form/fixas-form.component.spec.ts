import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixasFormComponent } from './fixas-form.component';

describe('FixasFormComponent', () => {
  let component: FixasFormComponent;
  let fixture: ComponentFixture<FixasFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixasFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FixasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
