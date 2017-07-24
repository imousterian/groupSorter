import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http, ConnectionBackend, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MainPageComponent } from './main';
import { UserService } from '../../services/user.svc';
import { GroupService } from '../../services/group.svc';

describe('Main Page Component:', () => {
  let comp: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;
  let de: DebugElement;

  beforeEach(() => {

    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [FormsModule, RouterTestingModule.withRoutes([])],
      declarations: [MainPageComponent],
      providers: [
        UserService,
        GroupService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http, useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions],
        }
      ],
    });
    fixture = TestBed.createComponent(MainPageComponent);
    fixture.detectChanges();
    comp = fixture.componentInstance;
    de = fixture.debugElement;
  });

  describe('.constructor()', () => {
    it('Should be defined', () => {
      expect(comp).toBeDefined();
    });
  });
});