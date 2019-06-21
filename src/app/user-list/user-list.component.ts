import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, UserService } from '../_services/index';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  model: any = {};
  loading = false;

  constructor(
    private router: Router,
    private alertservice: AlertService,
    private userService: UserService

  ) { }

  ngOnInit() {
  }
  register() {
    this.userService.create(this.model).subscribe(data => {
      this.alertservice.success('Registration successful', true);
      this.router.navigate(['/login']);
    },
      error => {
        this.alertservice.error(error);
        this.loading = false;
      });
  }

}
