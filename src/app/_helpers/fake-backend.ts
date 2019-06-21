import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/materialize';
import 'rxjs/add/operator/dematerialize';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let users: any[] = JSON.parse(localStorage.getItem('users')) || [];


        return Observable.of(null).mergeMap(() => {


            if (request.url.endsWith('/api/authenticate') && request.method === 'POST') {

                let filteredUsers = users.filter(user => {
                    return user.username === request.body.username && user.password === request.body.password;
                });

                if (filteredUsers.length) {

                    let user = filteredUsers[0];
                    let body = {
                        id: user.id,
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        token: 'fake-jwt-token'
                    };

                    return Observable.of(new HttpResponse({ status: 200, body: body }));
                } else {

                    return Observable.throw('Username or password is incorrect');
                }
            }


            if (request.url.endsWith('/api/users') && request.method === 'GET') {

                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    return Observable.of(new HttpResponse({ status: 200, body: users }));
                } else {

                    return Observable.throw('Unauthorised');
                }
            }


            if (request.url.match(/\/api\/users\/\d+$/) && request.method === 'GET') {

                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {

                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    let matchedUsers = users.filter(user => { return user.id === id; });
                    let user = matchedUsers.length ? matchedUsers[0] : null;

                    return Observable.of(new HttpResponse({ status: 200, body: user }));
                } else {

                    return Observable.throw('Unauthorised');
                }
            }

     
            if (request.url.endsWith('/api/users') && request.method === 'POST') {
             
                let newUser = request.body;

            
                let duplicateUser = users.filter(user => { return user.username === newUser.username; }).length;
                if (duplicateUser) {
                    return Observable.throw('Username "' + newUser.username + '" is already taken');
                }

              
                newUser.id = users.length + 1;
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));

              
                return Observable.of(new HttpResponse({ status: 200 }));
            }

      
            if (request.url.match(/\/api\/users\/\d+$/) && request.method === 'DELETE') {
               
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {

                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    for (let i = 0; i < users.length; i++) {
                        let user = users[i];
                        if (user.id === id) {

                            users.splice(i, 1);
                            localStorage.setItem('users', JSON.stringify(users));
                            break;
                        }
                    }


                    return Observable.of(new HttpResponse({ status: 200 }));
                } else {

                    return Observable.throw('Unauthorised');
                }
            }


            return next.handle(request);

        })


            .materialize()
            .delay(500)
            .dematerialize();
    }
}

export let fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};