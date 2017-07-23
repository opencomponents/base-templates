First of all, thank you for contributing. It’s appreciated.

# To submit a pull request

1. Open a GitHub issue before doing significant amount of work.
2. Clone the repo. If it was already cloned, then git pull to get the latest from master.
3. Run `npm install` before anything else, and wait.
6. Write code.
7. Write test (coverage regressions will fail the build). Run test with `npm test`. 
8. Commit using `npm run commit` and follow the CLI instructions.
9. Make a pull request against the master branch.

# To release new versions

1. We run on semantic-release, meaaning that the right version for each package will be automatically published upon succesful merge to master.