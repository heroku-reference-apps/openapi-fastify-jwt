# User Directory and Profile - Fastify OpenAPI with Authentication

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

This is a Fastify-backed Node.js application that demonstrates authentication (with JWTs using RSA256) and OpenAPI specification generation.

This API has two routes.

1. `GET /directory` is a public route. It returns a list of usernames from the database.
2. `GET /profile` is an authenciated route, requiring an RSA256-signed JWT with a `username` in the payload. Then, it retrieves additional information about that user from the database.

![Architecture](img/architecture.png)

## Create Heroku App

First create a Heroku app to deploy this application by running:

```sh
heroku create <app-name>
```

## Setup database

Along with your basic Heroku app, you will need to use a PostgreSQL add-on.
You can do it manually by running:

```sh
heroku addons:create heroku-postgresql:mini
```

Once your database is set up, you should run the SQL statements found in the following two files (in this order):

1. `data/create_schema.sql` (which creates the `users` table)
2. `data/create_records.sql` (which inserts 64 sample records into the `users` table)

You can do it by running:

```sh
heroku pg:psql < data/create_schema.sql
heroku pg:psql < data/create_records.sql
```

Once you have the database up and running, Heroku will automatically add a config var called `DATABASE_URL`. This should contain all of the information you need for connecting to the database (in `plugins/db.js`).

## Deploy code to Heroku

More detailed instructions for how to deploy using Heroku Git can be found [here](https://devcenter.heroku.com/articles/git#create-a-heroku-remote).

```sh
heroku git:remote -a <app-name>
git push heroku main
```

## Working with RSA public/private keys

An example key pair can be found in `utils/keys`.

You should generate your own keys ([online tool](https://cryptotools.net/rsagen)). You can store them in the `utils/keys` folder, which is set to gitignore this folder.

### Convert the public key to base64

You will need to convert the public key to base64 and add it as a Heroku config var. This value is used to verify JWTs for the authenticated route.

An example of how to convert the example public key file to base64 on your local machine:

**Linux**

```sh
cat utils/keys/public_key.example.rsa | base64 -w 0
```

**macOS**

```sh
cat utils/keys/public_key.example.rsa | base64
```

Then, you would [set the config var](https://devcenter.heroku.com/articles/config-vars) for `RSA_PUBLIC_KEY_BASE_64` from the command line. As a single command, that would look like this:

**Linux**

```sh
heroku config:set RSA_PUBLIC_KEY_BASE_64=`cat utils/keys/public_key.example.rsa | base64 -w 0`
```

**macOS**

```sh
heroku config:set RSA_PUBLIC_KEY_BASE_64=`cat utils/keys/public_key.example.rsa | base64`
```

## Send a `GET` request to `/directory`

This route does not need authentication.

```
curl https://<HEROKU-APP-URL>/directory
```

The response will be an array of usernames.

## Generate a signed JWT with a username

To access the authenticated route (`/profile`), you need a JWT signed with the private key, and the payload of that JWT must have `username`. Choose one of the usernames from the `GET /directory` response.

An example of how to generate a JWT using the example private key:

```sh
npm run generate:jwt utils/keys/private_key.example.rsa '{"username":"aisha.upton"}'
```

## Send an authenticated `GET` request to `/profile`

This route uses bearer auth with the JWT you just generated.

```
curl \
  --header "Authorization:Bearer copy-the-jwt-you-just-generated" \
  https://<HEROKU-APP-URL>/profile
```

## Working with Swagger UI

You can view API documentation at:

https://HEROKU-APP-URL/api-docs

## Working with Postman

In Postman, click "Import", then (with the server running), paste in https://HEROKU-APP-URL/api-docs/yaml. Import this as a Postman Collection.

You can immediately send the `GET` directory request.

To run the `GET` profile request, edit the "User Directory and Profile" collection. Go to "Variables" and add `bearerToken`, using the JWT that you generated earlier. Make sure to click **Save** when you are done.

Now, you can run the `GET` profile request.
