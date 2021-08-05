# Developer Guide

#### Development environment pre-requisites
* A package manager (e.g., npm, Yarn, or pnpm)
* A working Firebase account
* Expo Go on your mobile device or simulators
* ```expo-cli```, install with ```npm install expo-cli --global``` or ```yarn global add expo-cli```


#### Setting up
1. Clone this repository
2. git clone https://github.com/fwenyin/masterplan.git
3. Change-directory into the project root ```cd masterplan```
4. Install all dependencies with your package manager ```npm install``` or ```yarn install```
5. Create a Firebase application
6. Add a web application to your Firebase project
7. Grab the configuration info from Add Firebase SDK
If you missed this page, go to Project Overview, scroll down to Your apps, and locate the web app with your set nickname. Under SDK setup and configuration, choose Configand the configuration info is given to you in the form of config firebaseConfig = { ... };.
8. In Firebase, enable Authentication by navigating to Build > Authentication > Get started on your Firebase console
9. In Firebase, enable Realtime Database by navigating to Build > Realtime Database > Get started on your Firebase console
10. You may choose to initialise the database in test mode for debugging purposes.
11. Populate the firebase.js file with the Firebase configuration info as follows:
 ```
 apiKey: "<your firebaseConfig.apiKey>",
 authDomain: "<your firebaseConfig.authDomain>",
 databaseURL: "<your firebaseConfig.databaseURL>",
 projectId: "<your firebaseConfig.projectId>",
 storageBucket: "<your firebaseConfig.storageBucket>",
 messagingSenderId: "<your firebaseConfig.messagingSenderId>",
 appId: "<your firebaseConfig.appId>",
 measurementId: "<your firebaseConfig.measurementId>"
```
12. Run the app  ```npm start ``` or  ```yarn start ``` or  ```expo start ```
