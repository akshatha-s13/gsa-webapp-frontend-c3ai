# gsa-webapp-frontend-c3ai

## CI/CD Workflows

Our project utilizes two primary workflows: the CI Workflow and the Terraform, Build, and Deploy Workflow. Both workflows are integral components of our development process, enabling us to maintain a high-quality, up-to-date, and secure codebase.

### CI Workflow

Workflow file: [.github/workflows/ci.yml](.github/workflows/ci.yml)  

The CI Workflow is triggered on pull requests to the `main` or `develop` branches. This workflow is primarily designed to ensure the integrity of the codebase by building the application and potentially running tests whenever changes are proposed via pull requests.

The CI workflow follows these steps:

1. Checks out the repository.
2. Sets up the desired version of Node.js.
3. Installs the project dependencies with `npm ci`. This command is similar to `npm install`, but it's designed to be used in automated environments such as test platforms, continuous integration, and deployment -- or any situation where you want to make sure you're doing a clean install of your dependencies. It can significantly reduce install time by skipping certain user-oriented features. It also ensures that `package-lock.json` is respected.
4. Sets up the environment based on the target branch (using `main` or `develop` environment secrets).
5. Builds the application with `npm run build`.
6. (When tests are added) Runs the tests with `npm test`.

This CI workflow helps ensure that any proposed changes to the `develop` or `main` branches do not break the application build process.

### CD Workflow 

Workflow file: [.github/workflows/cd.yml](.github/workflows/cd.yml)  


The Terraform, Build, and Deploy Workflow handles the continuous deployment of the application. This workflow is triggered when changes are pushed to the `develop` branch or can be manually triggered via `workflow_dispatch` for a specific environment.

This workflow consists of two jobs:

1. **Terraform** job: This sets up the necessary infrastructure using Terraform and Terragrunt.
2. **Build and Deploy** job: This handles building and deploying the application.

This workflow ensures that our application is consistently deployed and up-to-date with the latest changes in the codebase.

### Branching and Pull Requests Best Practices

We follow a slightly modified version of the [GitHub Flow](https://guides.github.com/introduction/flow/). Here are the key principles:

1. **Ongoing development should be done in feature branches off `develop`.**
2. **Once the feature is completed, open a pull request to merge these changes into `develop`. The changes will then be deployed to the development environment.**
3. **After reviewing and testing the changes in the development environment, merge `develop` into `main` using a pull request. The changes will then be deployed into the production environment.**
4. **Anything in the `main` branch is always deployable to the production environment.**

Following these principles helps ensure that our codebase remains clean, and all changes are reviewed and tested before being deployed.

### Note

Both workflows utilize certain environment variables and secrets for tasks such as accessing AWS resources and setting up application configuration. Ensure these are correctly configured in your GitHub repository settings.
