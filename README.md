<p align="center">
  <a href="https://www.linkedin.com/company/moneteam/" target="blank"><img src="https://cdn.staff.am/staff.am/upload/c/2/0/b/c20beb14.jpg" width="120" alt="Nest Logo" /></a>
</p>

<div align="center">
  <h1>Test-task project for M-One Company</h1>
</div>

## Description

This project is a test task for **M-One Company**, built using **NestJS** framework by Me ([davmik2601](https://github.com/davmik2601)).
As Database, it uses PostgreSQL **without any ORM** (as per task requirements).
Used good architecture and best practices for building a good back-end API for this task requirements.

## Task Requirements
In this challenge You will build the Back-end API of a social website like facebook using Typescript, NestJS, And PostgreSQL, `Do not use ORMs` like Typeorm, MikrOrm, etc.. API must have the following well designed and fully functional endpoints.
Note: Do not use existing project code, or boilerplate.

* Users can register in the system using their own personal information. 
* Users can login into the system. 
* Users can search other users by advanced search which will accept combinations of first name, last name and age. 
* Users can add other users as friends, view requests list, accept or decline them.

Core expectations
* Database structure: Use best practice for database structure.
* Deployment (Optional): So CI/CD can use it for its purposes.
* System Design: Use the most advanced back-end architecture.
* Coding: Clean code. Good coding style. Good comments. Easy to read, debug.
* Documentation (Optional): Describe the architecture, technologies you use in your documents and readme file.

## Live
The Project is **already deployed** on the "Scaleway" server (similar to AWS EC2),
All server configurations, nginx, domain settings, SSL certificates, etc. **are done by me**.

You can check it out here:
### 👉👉👉 https://m-one-social.online/

## Project setup


1. First of all create db in your PostgreSQL server for the project
   and set up the environment variables in `.env` file (check `.env.example` for reference).


2. Please use **Node 20.x** versions


3. Install the dependencies using `yarn`:

```bash
$ yarn install
```

## Compile and run the project

You can run the following commands to compile and run the project:

```bash
# (first of all run all migrations)
$ yarn run migration:run 

# for development (watch mode)
$ yarn run start:dev
# without watch mode
$ yarn run start
# production mode
$ yarn run start:prod
```

## What is used in this project

* Documentation: **Swagger** (check https://m-one-social.online/docs to see endpoints)
* Database: **PostgreSQL** (_**without any ORM**_)
* Authentication: **JWT**, passport.js
* Validation: **class-validator**, class-transformer
* Text correction: **Eslint**