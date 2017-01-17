# lambdasync-example-auth0
An example project of an API deployed on AWS Lambda with Lambdasync, authenticated by Auth0.

You can create the project yoruself, step by step by following this [tutorial](http://fredrik.anderzon.se/2017/01/17/authenticating-a-rest-api-on-aws-lambda-using-auth0/), or just run the project yourself and read the code.


## Prerequisites
You are going to need a URL for a mongodb database set up with a collection called `notes` for this code to work. How to set up a free MongoDB database on mLab is covered in [this tutorial](http://fredrik.anderzon.se/2016/11/26/create-a-rest-api-on-aws-lambda-using-lambdasync/).

You will need to set up a client on [Auth0](http://auth0.com) which is covered in [this tutorial](http://fredrik.anderzon.se/2017/01/17/authenticating-a-rest-api-on-aws-lambda-using-auth0/)

You will also need an AWS Account, and credentials, check out the [official docs on how to get your credentials](http://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html) before you start.

All in all you will need:

* MONGO_URL (url to mongodb including username and password)
* AUTH0_CLIENT
* AUTH0_SECRET
* AUTH0_DOMAIN
* AWS_ACCESS_KEY
* AWS_SECRET_ACCESS_KEY


## Deploy the API
To get the API up and running run these commands in a terminal, in the root of the project:

```
npm install
lambdasync
```

When you run the `lambdasync` command you will be asked for your AWS credentials to deploy the project to AWS Lambda.

Once that is done you will get a URL to your new API.

Before you can use it you need to add the MongoDB and Auth0 prerequisites as environment variables to your lambda script. This is done using the `lambdasync secret` command, like this:

```
lambdasync secret MONGO_URL=mongodb://YOUR_USER:YOUR_PASSWORD@YOUR_ACCOUNT.mlab.com:49207/notetaker
lambdasync secret AUTH0_CLIENT=YOUR_AUTH0_CLIENT_ID_HERE
lambdasync secret AUTH0_SECRET=YOUR_AUTH0_SECRET_HERE
lambdasync secret AUTH0_DOMAIN=YOUR_AUTH0_DOMAIN_HERE
```

Now the API will let you Create, Read, Update and Delete notes, as long as you are logged in and pass it the right Authorization token in the headers.


## Run the client
The project comes with a very basic client. Run it:

```
cd client
npm install
node index.js
```
This will host the client on `http://localhost:3001` (same URL as you added to the Auth0 client if you followed the tutorial.)

The client will let you login with Auth0. And after that add new notes, list notes, edit notes and delete notes.


## Code structure and request flow

The entry point of the app is `index.js`, which loads `src/app.js`.

Authentication is done by `src/app.js` passing the `Authorization` header to `src/auth.js` which uses the `jsonwebtoken` library and the secret, client id and domain from Auth0 to validate the token and return either an error, or a user id.

Once `src/app.js` has the user id, it uses `src/db.js` to establish a MongoDB connection, and then it will look at the http method and path of the request to call the right function in `src/note.js` to perform operations on the database.

* `GET /` -> getNotes()
* `POST /` -> addNote()
* `PUT /:noteId` -> updateNote()
* `DELETE /:noteId` -> deleteNote()

Once an operation is done (or has failed) the app returns a response object containing `{httpMethod, headers, body}` using the `respondAndClose` function from `src/util.js` to format the response correctly.
