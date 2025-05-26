# TascMaster

This project is a simple Todo application built with Angular. It allows users to register, log in, and manage their todo items. The application includes features such as adding, editing, deleting, and toggling the completion status of todo items.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Development Server](#development-server)
- [Code Scaffolding](#code-scaffolding)
- [Building](#building)
- [Running Unit Tests](#running-unit-tests)
- [Running End-to-End Tests](#running-end-to-end-tests)
- [Deployment Notes](#deployment-notes)
- [Additional Resources](#additional-resources)
- [License](#license)

## Features

- User registration and login
- Add, edit, delete, and toggle completion status of todo items
- Persistent storage using MongoDB
- Automatic logout after 12 hours of inactivity
- Cross-domain API communication with CORS support

## Getting Started

To get started with this project, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/my-todo-crud.git
   cd my-todo-crud
   ```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Deployment Notes

When deploying the application:

1. Ensure the backend CORS settings include your frontend domain
2. Update the environment files with the correct API URL
3. Set environment variables on the backend hosting service

For server deployment, ensure these environment variables are set:

- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `PORT`: The port to run the server (if not using default)

### CORS Issues

If experiencing CORS issues:

- Verify that the frontend domain is listed in the backend's CORS configuration
- Ensure authentication headers are properly set
- Check browser console for specific CORS error messages

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
