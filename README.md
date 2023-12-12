# Introduction

Project BackEnd Job-Web

Build on Express JS

Database MongoDB (NOSQL)

Apply structure MVC - Model View Controller

RESTful API

Deploy on [Vercel](https://vercel.com/)

URL : https://point-of-sale-be.vercel.app/

# Routes

## Index [" / "] : just render text "Job Web - API"

## Router for auth

- [GET] - /me : Get profile from database
- [GET] - /logout : logout
- [POST] - /signup : create new account
- [POST] - /signin : login by account

## Router for category

- [GET] - /categories : Get all category from database
- [DEL] - /category/delete/:category_id : Delete category by id
- [POST] - /category/create : Create new category
- [PUT] - /category/update/:category_id : Update category by id

## Router for company

- [GET] - /companies : Get all company from database
- [DEL] - /company/delete/:company_id : Delete company by id
- [POST] - /company/create : Create new company
- [PUT] - /company/update/:company_id : Update company by id

## Router for user

- [GET] - /allusers : Get all user from database
- [GET] - /user/:id : Find user by id
- [DEL] - /user/delete/:id : Delete user by id
- [POST] - /user/jobhistory : Create new jobhistory of user
- [PUT] - /user/update/:id : Update user by id

## Router for job

- [GET] - /jobs : Get all job from database
- [GET] - /job/:id : Find job by id
- [DEL] - /job/:id : Delete job by id
- [POST] - /job/create : Create new job
- [PUT] - /job/update/:job_id : Update job by id

