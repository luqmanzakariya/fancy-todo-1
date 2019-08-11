# iTodo
A Todo-list app for Portofolio on Hacktiv8 Bootcamp

## USAGE

Before using the API, make sure you install these packages on global by running this code:

    npm install -g live-server

### Usage Client
You can access the client via http://localhost:8080.
Make sure you have live server installed in your computer, then go to client folder and run these commands:

    live-server --host=localhost

## Usage Server
You can access the client via http://localhost:3000.
Make sure you have Node.js and npm installed in your computer, then go to server folder and run these commands:

    npm install
    npm start
    npm run dev

## List of User routes:
base url : http//localhost:3000/users

example :

    http//localhost:3000/users/register

| Route  | HTTP | Headers(s) | Body | Sucess Response | Error Response  | Description         |
| ------ | ---- | ---------- | - |-| ---- | ----- | ------------------- |
| `/users/register` | POST | `none` | `name, email, password` | (201) json(data) | (500) json(err.message)  | Sign up with new user info |
| `/users/login` | POST | `none` | `email, password` |  (200) json(data) | (500) json(err.message)  | Sign in and get an access token based on credentials |
| `/users/loginGoogle` | POST | `none`  | `none`|  (200) json(data) | (500) json(err.message) | Sign in and get an access token based on credentials |
| `/users/:id` | GET | `none`  | `none` |  (200) json(data) | (500) json(err.message) | Get all other user data for project collaboration |

## List of Todo routes:
base url : http//localhost:3000/todos

example :

    http//localhost:3000/todos/create

| Route | HTTP | Headers(s) | Body | Sucess Response | Error Response | Description |
| ----- | ---- | ---------- | ---- | ----------------| -------------- | ---|
| `/` | GET | `token` | `none` | (200) json(data)| (500) json(err.message) | Get all user's todo |
| `/:id` | GET | `token` | `none` | (200) json(data)| (500) json(err.message) | Get all todo details |
| `/create` | POST | `token` | `name, description, dueDate` | (200) json(data)| (500) json(err.message) | create todo |
| `/:id` | DELETE | `token` | `none` | (200) json(data)| (500) json(err.message) | delete a todo |
| `/:id` | PATCH | `token` | `name, description, dueDate` | (200) json(data)| (500) json(err.message) | update a todo |
| `/status/:id` | PATCH | `token` | `none` | (200) json(data)| (500) json(err.message) | change todo status |
| `/todoproject/:id` | DELETE | `token` | `none` | (200) json(data)| (500) json(err.message) | delete todo in a project |
| `/todoproject/status/:id` | PATCH | `token` | `none` | (200) json(data)| (500) json(err.message) | update status todo in a project |
| `/todoproject/:id` | GET | `token` | `none` | (200) json(data)| (500) json(err.message) | find todo details in project |
| `/todoproject/:id` | PATCH | `token` | `name, description, dueDate` | (200) json(data)| (500) json(err.message) | update todo in a project |

## List of Project routes:
base url : http//localhost:3000/projects

example :

    http//localhost:3000/projects/

| Route | HTTP | Headers(s) | Body | Sucess Response | Error Response | Description |
| ----- | ---- | ---------- | ---- | --------------- | -------------- | -|
| `/` | GET | `token` | `none` | (200) json(data)| (500) json(err.message) | find all user project |
| `/` | POST | `token` | `title, description, members,  UserId` | (200) json(data)| (500) json(err.message) | create a project |
| `/:id` | GET | `token` | `none` | (200) json(data)| (500) json(err.message) | get all todo on project |
| `/:id` | POST | `token` | `name, description, dueDate` | (200) json(data)| (500) json(err.message) | create todo on project |
| `/:id` | DELETE | `token` | `none` | (200) json(data)| (500) json(err.message) | delete project (only for project owner) |
| `/:id` | PATCH | `token` | `none` | (200) json(data)| (500) json(err.message) | add users to the project |