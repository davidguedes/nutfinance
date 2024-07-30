import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasModalComponent } from './categorias-modal.component';

describe('CategoriasModalComponent', () => {
  let component: CategoriasModalComponent;
  let fixture: ComponentFixture<CategoriasModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriasModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoriasModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
