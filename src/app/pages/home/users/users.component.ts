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
  ageType: string[] = ['week'];
  childAgeOptions: Array<{ value: string; viewValue: string }> = [];
  selectedChildAges: string[] = [];

  users: any = [];
  selectedUsers: any = [];
  totalUsers: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  searchQuery: string = '';
  displayedColumns: string[] = ['select', 'fullname', 'email'];
  selection = new SelectionModel<any>(true, []);
  private searchSubject: Subject<string> = new Subject();
  private childAgeSubject: Subject<string[]> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private toasterService: ToasterService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.loadUsers();
      this.defineNumberOfAge();
    });

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query) => {
        this.searchQuery = query;
        this.loadUsers();
      });

    this.childAgeSubject.pipe(debounceTime(300)).subscribe((ages) => {
      this.selectedChildAges = ages;
      this.loadUsers();
    });
  }

  changeChildAge(event: any) {
    this.selectedChildAges = event;
  }

  defineNumberOfAge(newAgeTypes?: any) {
    this.childAgeOptions = [];
    this.childAgeOptions.push({
      value: 'allweeks',
      viewValue: 'Sve nedelje trudnoce',
    });
    this.ageType = newAgeTypes || this.ageType;
    if (this.ageType.includes('week')) {
      for (let i = 1; i <= 40; i++) {
        this.childAgeOptions.push({
          value: `week ${i}`,
          viewValue: `${i} nedelja trudnoce`,
        });
      }
    }

    if (this.ageType.includes('month')) {
      const monthRanges = [
        { start: 0, end: 3 },
        { start: 4, end: 6 },
        { start: 7, end: 9 },
        { start: 10, end: 12 },
        { start: 13, end: 18 },
        { start: 19, end: 24 },
        { start: 25, end: 36 },
      ];

      for (const range of monthRanges) {
        this.childAgeOptions.push({
          value: `month ${range.start}-${range.end}`,
          viewValue: `${range.start}-${range.end} meseci`,
        });
      }
    }

    if (this.ageType.includes('year')) {
      const yearRanges = [
        { start: 3, end: 4 },
        { start: 4, end: 5 },
        { start: 5, end: 6 },
        { start: 6, end: 7 },
      ];

      for (const range of yearRanges) {
        this.childAgeOptions.push({
          value: `year ${range.start}-${range.end}`,
          viewValue: `${range.start}-${range.end} godina`,
        });
      }
    }

    this.selectedChildAges = this.selectedChildAges.filter((age) =>
      this.childAgeOptions.some((option) => option.value === age)
    );
  }

  loadUsers(page: number = 1, pageSize: number = this.pageSize) {
    this.currentPage = page;
    this.pageSize = pageSize;
    let data = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      searchQuery: this.searchQuery,
      childAgeOptions: this.selectedChildAges,
    };
    this.userService.getAllUsers(data).subscribe({
      next: (data: any) => {
        this.users = data.items;
        this.totalUsers = data.totalCount;
        this.restoreSelections();
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

  filterByChildAge(event: any) {
    this.childAgeSubject.next(event);
  }

  pageChanged(event: PageEvent) {
    const pageNumber = event.pageIndex + 1;
    const newPageSize = event.pageSize;
    this.loadUsers(pageNumber, newPageSize);
  }

  toggleSelection(user: any) {
    const index = this.selectedUsers.findIndex(
      (selected: any) => selected.id === user.id
    );
    if (index === -1) {
      this.selectedUsers.push(user);
    } else {
      this.selectedUsers.splice(index, 1);
    }
  }

  isSelected(user: any): boolean {
    return this.selectedUsers.some((selected: any) => selected.id === user.id);
  }

  restoreSelections() {
    this.users.forEach((user: any) => {
      user.selected = this.isSelected(user);
    });
  }

  toggleSelectAll(event: any) {
    if (event.checked) {
      this.users.forEach((user: any) => {
        if (!this.isSelected(user)) {
          this.selectedUsers.push(user);
        }
      });
    } else {
      this.users.forEach((user: any) => {
        const index = this.selectedUsers.findIndex(
          (selected: any) => selected.id === user.id
        );
        if (index !== -1) {
          this.selectedUsers.splice(index, 1);
        }
      });
    }
  }

  isAllSelected(): boolean {
    return (
      this.users.length &&
      this.users.every((user: any) => this.isSelected(user))
    );
  }

  isSomeSelected(): boolean {
    return (
      this.users.some((user: any) => this.isSelected(user)) &&
      !this.isAllSelected()
    );
  }

  sendNewsletters() {
    console.log(this.selectedUsers);
  }
}
