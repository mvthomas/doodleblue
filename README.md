# Setting Up the project

You can view the live project using this url [https://chatapp-61dd6.web.app/](https://chatapp-61dd6.web.app/)
The above link will be 100% functional, no mock data is used.

For a better use case, use default login and chat with user Elon Musk.

Or setup in local

1. Clone the repo from [https://github.com/mvthomas/doodleblue](https://github.com/mvthomas/doodleblue)
2. cd doodleblue && npm install
3. open [http://localhost:3000/](http://localhost:3000/)

## Overview and Stacks used

The Chat application is capable of create, edit, read and delete the user throughout the application on realtime.

Logged in user can send a text to any other user available in the user database, and the message will be sent and received on a real time basis and get scrolled to the newly avaialbe chat automatically.

User can switch between any user on a single button click on the login button avalable on the user management screen.

The stack used for the development in React, Redux, Material UI on client side, Firebsae FireStore and hosting on the server side.

## Documentation

In the project directory, you can run: (if local) or use the live link to view the application.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The entire application is designed as a Single Page Application, by default "mvthomas121@gmail.com" user will be logged in, and it willl be switched once user makes any login attempt.

You can pick any user available in the left section of the application (for mobile view, use the arrow icon button to see the list) and start the chat.

For a better use case, use default login and chat with user Elon Musk.

The logged in user information is also stored in localStorage with which we can start the session from the data where user left off on the previous session.

The logged in users information, the current user we are chatting with and the messages that are shared will be managed in the redux store using their repsective reducers in the redux directory.

All the network requests are managed under networks directory except the message service as it will built with onSnapshot function to listen for every new messages and update the view accordingly.

APIs Used:
1. Create/Update user using setDoc method.
2. Delete user uding deleteDoc method.
3. onSnaptshot to listen for active changes in the messages collection using the document id.
