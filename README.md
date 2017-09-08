# React Router 4 + Express + Passport Auth Example

This app is sort of haphazardly thrown together in order to illustrate React Router 4 + Passport. There is * a lot * to clean up! Tread carefully. It is a combination of `create-react-app` (code in src/ dir is client code) and [User Authentication with Passport and Express 4](https://github.com/mjhea0/passport-local-express4).

To get this operational, you need to open two tabs and use the following commands - 1 in each tab:

```
npm run start:client
```
to start webpack watching and building your client-side code into the build/ directory, and

```
npm run start:server
```
to start nodemon watching your code in the server/ directory and serving everything on localhost:3000

NOTE: the static index.html and code inside of build/ dir are served by express static configuration.
