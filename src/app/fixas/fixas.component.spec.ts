import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixasComponent } from './fixas.component';

describe('FixasComponent', () => {
  let component: FixasComponent;
  let fixture: ComponentFixture<FixasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
