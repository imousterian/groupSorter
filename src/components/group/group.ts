import { Component, Input} from '@angular/core';
// import { User } from '../../services/user.svc';

@Component({
  selector: 'group',
  templateUrl: 'group.html'
})

export class GroupComponent {
  @Input() group;

  constructor() {}
  
}
