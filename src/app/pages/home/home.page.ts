import { Component, OnInit } from '@angular/core';
import { SideBarModel } from '../../models/sideBar.model';
import { jwtDecode } from 'jwt-decode';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  filteredSidebarsUrl: SideBarModel[] = [];
  sidebarsUrl: SideBarModel[] = [
    {
      pageUrl: 'in-app-browser',
      name: 'Naš Svet',
      iconSrc: 'people-outline',
    },
    {
      pageUrl: 'profile',
      name: 'Profil',
      iconSrc: 'person-outline',
    },
    {
      pageUrl: 'users',
      name: 'Korisnici',
      iconSrc: 'people-outline',
    },
    {
      pageUrl: 'settings',
      name: 'Podešavanja',
      iconSrc: 'settings-outline',
    },
  ];
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      console.log('Home page');
      this.filterSidebars();
    });
  }

  filterSidebars() {
    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const userRole = decodedToken.role;
        if (userRole == 'Admin') {
          this.filteredSidebarsUrl = this.sidebarsUrl;
        } else {
          this.filteredSidebarsUrl = this.sidebarsUrl.filter(
            (item) => item.pageUrl !== 'users'
          );
        }
        console.log(this.filteredSidebarsUrl);
      } catch (error) {
        console.error('Invalid token:', error);
      }
    } else {
      this.filteredSidebarsUrl = this.sidebarsUrl.filter(
        (item) => item.pageUrl !== 'users'
      );
    }
  }
}
