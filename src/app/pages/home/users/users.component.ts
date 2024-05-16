import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ToasterService } from 'src/app/common/services/toaster.service';
import { UserService } from 'src/app/common/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: any = [];
  selectedUsers: any = [];
  totalUsers: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  searchQuery: string = '';
  displayedColumns: string[] = ['fullname', 'email'];
  selection = new SelectionModel<any>(true, []);
  private searchSubject: Subject<string> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private toasterService: ToasterService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.loadUsers();
    });

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query) => {
        this.searchQuery = query;
        this.loadUsers();
      });
  }

  loadUsers(page: number = 1, pageSize: number = this.pageSize) {
    this.currentPage = page;
    this.pageSize = pageSize;
    this.userService
      .getAllUsers(this.currentPage, this.pageSize, this.searchQuery)
      .subscribe({
        next: (data: any) => {
          this.users = data.items;
          this.totalUsers = data.totalCount;
          console.log(data);
        },
        error: (err: any) => {
          this.toasterService.presentToast(
            'Zabranjen pristup korisnicima.',
            'danger'
          );
        },
      });
  }

  searchUsers() {
    this.searchSubject.next(this.searchQuery);
  }

  pageChanged(event: PageEvent) {
    const pageNumber = event.pageIndex + 1;
    const newPageSize = event.pageSize;
    this.loadUsers(pageNumber, newPageSize);
  }

  toggleSelection(user: any) {
    const index = this.selectedUsers.indexOf(user);
    if (index === -1) {
      this.selectedUsers.push(user);
    } else {
      this.selectedUsers.splice(index, 1);
    }
  }

  isSelected(user: any): boolean {
    return this.selectedUsers.indexOf(user) !== -1;
  }

  sendNewsletters() {
    console.log(this.selectedUsers);
  }
}
