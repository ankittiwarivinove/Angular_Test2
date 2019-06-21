import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService, UserService } from '../_services/index';
import { User } from '../_models/index';

@Component({
    templateUrl: 'register.component.html'
})

export class RegisterComponent {
    model: any = {};
    loading = false;
    currentUser: User;
    users: User[] = [];

    constructor(
        private router: Router,
        private userService: UserService,
        private alertService: AlertService) { 
            this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
         }

        ngOnInit() {
            this.loadAllUsers();
        }
    
    private loadAllUsers() {
        this.userService.getAll().subscribe(users => { this.users = users; });
    }
}
