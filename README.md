## Notehub

Secure Note Management.

## To run the application locally, follow the below steps.

1. Setting up the database:
   You need to provide the database connection details in .env and .env.development files in the root directory of the project. Here's a sample of what it should look like:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

The application uses Prisma ORM for database management. To generate the necessary tables in your PostgreSQL database, execute the following command:

```bash
npx prisma migrate dev --name init_creating_tables_in_db
```

After the successful execution of the above command, run the following command to deploy the migrations:

```bash
npx prisma migrate deploy
```

After deploying the migrations, generate the Prisma Client with the following command:

```bash
npx prisma generate
```

2. Running the app:
   Install all the required dependencies using the following command:

```bash
$ npm install
```

After all dependencies are successfully installed, start the application in development mode with the following command:

```bash
# development
$ npm run start:dev
```

After starting the application, it will be running on port 9000. The application uses Swagger for API documentation. To view the API documentation navigate to http://localhost:9000/api in your browser.

3. Running the tests:
   This application includes a suite of tests to verify its functionality. These tests are crucial for maintaining the integrity of the application.

To execute these tests, use the following command in your terminal:

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Stay in touch

- Author - [Yaswanth](https://github.com/yaswanth23)
- Website - [Github](https://github.com/yaswanth23)

## License

This project is [MIT licensed](LICENSE).
