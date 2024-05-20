import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixasModalComponent } from './fixas-modal.component';

describe('FixasModalComponent', () => {
  let component: FixasModalComponent;
  let fixture: ComponentFixture<FixasModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixasModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FixasModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
