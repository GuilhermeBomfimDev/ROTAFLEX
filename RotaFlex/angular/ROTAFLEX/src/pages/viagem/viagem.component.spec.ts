import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViagemComponent } from './viagem.component';

describe('ViagemComponent', () => {
  let component: ViagemComponent;
  let fixture: ComponentFixture<ViagemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViagemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViagemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
