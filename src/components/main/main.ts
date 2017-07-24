import { Component, OnInit /*, OnDestroy*/ } from '@angular/core';
import { User, UserService } from '../../services/user.svc';
import { Group, GroupService } from '../../services/group.svc';

@Component({
  selector: 'main',
  templateUrl: 'main.html'
})

export class MainPageComponent implements OnInit {
  minNumber: number = 3;
  maxNumber: number = 5;
  groupedAttendees: Array<any> = [];
  allGroups: Group[] = [];
  attendees: User[] = [];
  groups: Array<[User]> = [];

  constructor(private userSvc: UserService, private groupSvc: GroupService) { 
  }
  
  /*
    On first page load, get groups from the database (presumably, saved last time the app was used),
    then get a list of users. If there are no groups yet (i.e., app is used for the first time),
    then shuffle the users into groups and save the groups to the database. Otherwise, display existing groups.
  */
  ngOnInit() {
    this.getGroups()
      .then((groups) => this.getUsers())
      .then(users => {
        // check if users are already divided into groups
        if (this.allGroups && this.allGroups.length === 0) {
          // no groups yet; create and shuffle them
          this.persistShuffledGroupsToDatabase(true, null)
            .then(response => this.mapUsersToGroups())
        } else {
          this.mapUsersToGroups();
        }
      })
      .catch(err => {
        
      })
  }

  /*
    Gets group list from the database
  */
  getGroups(): Promise<Group[]> {
    return this.groupSvc.getAll()
      .then(response => {
        this.allGroups = response;
        return response;
      })
  }

  /*
    Gets user list from the database
  */
  getUsers(): Promise<User[]> {
    return this.userSvc.getAll()
      .then(response => {
        this.attendees = response;
        return response;
      })
  }

  /*
    Shuffles users into groups and sends either a post or a put request in order to create or update groups.
  */
  persistShuffledGroupsToDatabase(postRequest: boolean, putRequest: boolean): Promise<Group[]> {
    let numOfGroups: number = this.isDivisible(this.attendees, this.minNumber, this.maxNumber);
    this.groups = this.chunkArray(this.attendees, numOfGroups);
    let promises: any[] = [];
    for (let i = 0; i < this.groups.length; i += 1) {
      let payload: any = {};
      payload.groupID = i + 1;
      payload.users = this.groups[i].map(user => user.id);
      if (postRequest !== null) {
        promises.push(this.groupSvc.createGroup(payload));
      } else if (putRequest !== null) {
        promises.push(this.groupSvc.updateGroup(i+1,payload));
      }
    }
    return Promise.all(promises)
      .then(response => {
        this.allGroups = response;
        return response;
      })
  }

  /*
    Remaps users to groups in order to be passed through a template.
    Primarily because current architecture assumes that the main component fetches all data,
    then passes it in a proper format to group component, which passes attendees to the next component.
  */
  mapUsersToGroups() {
    for (let i = 0; i < this.allGroups.length; i += 1) {
      let currentGroup: any = this.allGroups[i];
      let group: any = {};
      group.id = currentGroup.id;
      group.attendees = currentGroup.users.map(userID => {
        return this.attendees.find((_user) => {
          return _user.id === userID;
        })
      });
      this.groupedAttendees.push(group);
    }
  }
  
  /*
    Determines if it is possible to divide the array into equal parts 
  */
  isDivisible(arr: any[], min: number, max: number): number {
    let len: number = arr.length;
    let groups: number = 0;
    for (let i = max; min <= i; i--) {
      let totalGroups = len / i;
      if (Number.isInteger(totalGroups)) {
        groups = i;
        break;
      }
    }
    if (groups === 0) {
      for (let i = max, remainder = 0; min <= i; i--) {
        remainder = len % i;
        if (remainder >= min && remainder <= max) {
          groups = i;
          break;
        }
      }
    }
    return groups;
  }

  /*
    Called from the template in order to rearrange groups
  */
  rearrange() {
    this.attendees = this.shuffle(this.attendees);
    this.persistShuffledGroupsToDatabase(null, true)
      .then(response => {
        this.mapUsersToGroups();
      })
  }

  /*
    Helper method to shuffle users
  */
  shuffle(array: any[]): Array<any> {
    let index: number = array.length;
    let tempVal: number = 0;
    let randIndex: number = 0;

    while (0 !== index) {
      randIndex = Math.floor(Math.random() * index);
      index -= 1;

      tempVal = array[index];
      array[index] = array[randIndex];
      array[randIndex] = tempVal;
    }
    return array;
  }

  /*
    Helper method to subdivide an array into chunks
  */
  chunkArray(arr: Array<any>, chunkNum: number): Array<any> {
    let chunks: number = Math.ceil(arr.length / chunkNum);
    let chunkedArray: Array<any> = [];
    this.groupedAttendees = [];
    for(let i = 0; i < chunks; i++){
      let start: number = i * chunkNum;
      let len: number = Math.min(arr.length - start, chunkNum);
      let tempArr: Array<any> = arr.slice(start, start+len);
      chunkedArray.push(tempArr);
    }
    return chunkedArray;
  }

}
