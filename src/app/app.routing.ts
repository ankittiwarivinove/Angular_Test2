import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { AuthGuard } from './_guards/index';
import { AddNewUserComponent } from './add-new-user/add-new-user.component';
import { UserListComponent } from './user-list/user-list.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'userList', component: RegisterComponent,canActivate: [AuthGuard] },
    { path: 'register', component: UserListComponent },
    { path:'addNewUser',component:AddNewUserComponent,canActivate: [AuthGuard] },
    { path:'Home',component: HomeComponent, canActivate: [AuthGuard]},


    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);