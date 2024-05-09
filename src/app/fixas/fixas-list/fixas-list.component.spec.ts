import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixasListComponent } from './fixas-list.component';

describe('FixasListComponent', () => {
  let component: FixasListComponent;
  let fixture: ComponentFixture<FixasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixasListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
