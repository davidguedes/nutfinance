import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrcamentosFormComponent } from './orcamentos-form.component';

describe('OrcamentosFormComponent', () => {
  let component: OrcamentosFormComponent;
  let fixture: ComponentFixture<OrcamentosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrcamentosFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrcamentosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
