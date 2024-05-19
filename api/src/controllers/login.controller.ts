import {inject} from '@loopback/core';
import {
    Request,
    RestBindings,
    get,
    response,
} from '@loopback/rest';

export class LoginController {
    constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

    @get('/login')
    @response(200)
    login() {
        return "Login Page"
    }
}