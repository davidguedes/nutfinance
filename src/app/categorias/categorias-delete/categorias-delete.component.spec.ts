import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasDeleteComponent } from './categorias-delete.component';

describe('CategoriasDeleteComponent', () => {
  let component: CategoriasDeleteComponent;
  let fixture: ComponentFixture<CategoriasDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriasDeleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoriasDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
