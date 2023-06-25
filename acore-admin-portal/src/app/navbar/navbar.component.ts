import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @ViewChild('sidenav', { static: true }) sidenav!: MatSidenav;
  isSidenavOpened = true;
  email = 'superadmin@example.com';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
  }

  toggleSidenav() {
    this.isSidenavOpened = !this.isSidenavOpened;
    this.sidenav.toggle();
  }

  isNavItemActive(item: string) {
    return true;
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
