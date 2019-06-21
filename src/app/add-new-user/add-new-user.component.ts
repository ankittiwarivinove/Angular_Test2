import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, UserService } from '../_services/index';

@Component({
  selector: 'app-add-new-user',
  templateUrl: './add-new-user.component.html',
  styleUrls: ['./add-new-user.component.css']
})
export class AddNewUserComponent implements OnInit {

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
