import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridComponent } from './grid.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler/src/core';
import { AStarService } from 'src/app/services/a-star.service';

class MockAStarService {
  public cellViewModels = '';
}

fdescribe('GridComponent', () => {

  // Remove type to allow private member testing and gits rid of TS errors
  let component;
  let fixture: ComponentFixture<GridComponent>;
  let mockAStarService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridComponent ],
      providers: [
        {provide: AStarService, useClass: MockAStarService }
      ],

      // NO_ERRORS_SCHEMA stop errors arising from child components in html
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;
    spyOn(component, 'init');

    mockAStarService = TestBed.get(AStarService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('test 1', () => {
      expect(component.init).toHaveBeenCalled();
    });

  });

  describe('#init', () => {
    beforeEach(() => {
      component.init.and.callThrough();
      mockAStarService.cellViewModels = 'e';

      component.init();
    });

    it('test 2', () => {
      expect(component.cellVms).toEqual('e');
    });

  });
});
