# UOA FSAE Jobs Board

## 2024 Team Leadership

- Kinzi Ceolin (Project Manager)
- Yang Qian (Tech Lead)

## 2024 Team Members

- Don Lin (Back-end, Architecture)
- Jack Haddad (Back-end, Front-end, Architecture)
- Sienna Nguyen (Front-end, Back-end)
- Frank Situ (Back-end, Architecture)
- Danny Jung (Back-end, Front-end, Architecture)
- Jolin Chen (Front-end)
- Jaehoon Oh (Front-end, Back-end)
- Josef Santos (Front-end)

## About

This project is focused on developing a new job platform website that allows Sponsors to post their job ads and FSAE members upload a profile and browse the jobs on offer.




# Running the build locally

## Downloads
FSAE Job Board is runs in the MERN stack (MongoDB, Express, React, and NodeJS) and reqires a few tools to be downloaded in order to run the app

- Either install Node through here https://nodejs.org/en/download/current or use Node Version Manager (NVM) found here Windows: https://github.com/coreybutler/nvm-windows Mac/Linux/WSL: https://github.com/nvm-sh/nvm. Currently FSAE Job Board has been tested to be fully working on Node v20

- Install git through https://git-scm.com/downloads, if you wish for a GUI for accessing the repoistory you can download Github Desktop through here https://desktop.github.com/download/


## Download the repository

In order to make changes to the repo you will have to clone the repository, this can be done by navigating to where you want the project folder to be placed and then running the terminal command: `git clone https://github.com/UoaWDCC/fsae-jobs-board.git`

## Setting up your environment (.env) files
Environment (.env) files are the files keeping any sensitive information, and are not stored on the codebase. Fsae Job Board uses one .env file for the backend. Download the .env file from the drive and place it in the same level as the example.env file in the api folder. Ensure the files are saved as .env file


⚠️ DO NOT share the .env file with anyone or upload it to GitHub or anywhere else - the file basically gives access to our databases which contain all the website assets and user information.


## Run the app
- Open 2 terminals
- Change directory by running `cd web` and `cd api` in each terminal
- Run `NPM install` in each terminal
- Run `NPM run dev` in web and `NPM` start in api directoires

## Important Libraries
### Mantine
The main frontend component library used is Mantine, find all relevant documentation regarding the use of the library the app on the google drive. Manitine doucmentation can be found here: https://mantine.dev/

### Loopback4
The backend is built ontop of the loopback4 framework which is built ontop of express. This library allows for easy generation of REST API's through command line, find all relevant doucmentation here: https://loopback.io/doc/en/lb4/.

For the full arcitecture review the system arcitecture diagram found in the Google Drive for how the libraries are used.