import { Component, Input} from '@angular/core';
import { User } from '../../services/user.svc';

@Component({
  selector: 'attendee',
  templateUrl: 'attendee.html'
})

export class AttendeeComponent {
  @Input() person: User;
  name: string;

  constructor() {
    this.waitToRender();
  }

  /*
    assign a value to name using a timeout
  */
  waitToRender(): void {
    let timer = Math.floor(Math.random() * 3000);
    setTimeout(() => {
      this.name = this.person.name;
    }, timer);
  }
}
