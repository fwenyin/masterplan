# README

##### Project Scope: 
Create a mobile application where students can see their daily tutorials or lessons at a glance and get recommendations on tasks to complete.

## 1. Problem
Students often face problems with their academics due to poor time management (Table 1). 

From having to rush assignments last minute to forgetting their meetings, this can negatively affect students' academics and work-life balance (Table 2). When rushing out the last-minute work or when they study last minute for their examinations, students may also be more stressed out and hence this would take a toll on their mental health. In addition, studying for examinations last minute is not the most effective way to prepare for examinations. Effective time management is associated with greater academic performance and lower levels of anxiety in students (Erik, 2019). Hence, there is a need to solve this problem. 

There are indeed various platforms available for students to plan their schedule, even the in-built Calendar application. However, none offer recommended study plans for students to follow. Students may not be working most efficiently if they fail to plan properly.

## 2. Solution
We created a mobile application whereby students will be able to see their daily tutorials or lessons as well as their project deadlines at a glance so that students can have a rough idea of what to prepare for the day. Students will be more organized with the system and optimize their time fully to avoid doing last-minute work and revision. As such, students will not be as stressed out and have a healthier mind.

## 3. Features of System


## 4. Application Program Flow


## 5. Frameworks used
Reactnative (to display elements on a mobile application)
Javascript (to animate or create logic)
Firebase (to connect with the front end and logic for database queries)
Expo (to deploy mobile application)


## 6. Systems Testing
| #  | Features                            | Testing Objective                                                                                         | Steps Taken                                                                                                                                                                                                                                                                                                                               | Expected results                                                                                                                                                                     | Pass/Fail |
|----|-------------------------------------|-----------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|
| 1  | Log In and Sign In                  | Test that users were able to register                                                                     | 1. Navigate to the sign up page 2. Input name, email and password 3. Verify successful login with the newly created account                                                                                                                                                                                                               | New users will be able to sign up and will be logged in after registration                                                                                                           | Pass      |
| 2  |                                     | Test that users are able to sign in with their registered email and password                              | 1. Sign in with email: test@gmail.com 2. Enter password: test1234                                                                                                                                                                                                                                                                         | Users will be able to sign in with the details that they have input during their registration                                                                                        | Pass      |
| 3  |                                     | Test that users are not able to sign up with an existing email                                            | 1.Navigate to the sign up page 2. Tried to use the email that already has an account (test@gmail.com) to try to sign up for another account                                                                                                                                                                                               | Users will not be able to sign up, and the error will pop up saying that the email address is already in use                                                                         | Pass      |
| 4  |                                     | Test that users will not be able to use a password that is less than 6 characters                         | 1.Navigate to the sign up page 2. Entered the name, email address and a password that is less than 6 characters                                                                                                                                                                                                                           | Users will not be able to create an account and there will be an error pop up saying that the password needs to be at least 6 characters                                             | Pass      |
| 5  |                                     | Test that users will not be able to sign up if they leave either the email address or password empty      | 1.Navigate to the sign up page 2. Left the email empty 3. Test 4. Keyed in email and left password empty                                                                                                                                                                                                                                  | There will be an error, saying that the email address is badly formatted, so users will have to key in their email address                                                           | Pass      |
| 6  |                                     | Test that users with invalid email cannot sign in                                                         | 1.Navigate to login page 2.Keyed in an email that has not been registered                                                                                                                                                                                                                                                                 | There will be an error, saying that there is no user record corresponding the email address, and user will not be able to sign in without the correct email                          | Pass      |
| 7  |                                     | Test that users with invalid password cannot sign in                                                      | 1. Navigate to login page 2. Keyed in a registered email and a password that does not correspond to what the users registered with                                                                                                                                                                                                        | There will be an error, saying that the password is invalid or there is no such user record, hence user will then not be able to sign in                                             | Pass      |
| 8  | Add Tasks and their datelines       | Test that users will be able to add their own to do lists                                                 | 1. After signing in or registering for an account, they will be directed to the lists page 2. Add a task named “Assignment 1” (typed into the bar above, with any task to complete, name? Then clicked the plus sign                                                                                                                      | The task named “Assignment 1” should show up on the list screen page                                                                                                                 | Pass      |
| 9  |                                     | Test that users will be able to add datelines to their task                                               | 1. After adding the task name, click the calendar icon next to the task and key in the dateline of the task, then choose from the datepicker (eg 2021-08-01)                                                                                                                                                                              | The dateline of the assignment should show up below the name of the task with “Dateline:2021-08-01”                                                                                  | Pass      |
| 10 |                                     | Test that users will be able to edit their datelines after adding a dateline                              | 1. Click on the task and edit the dateline by choosing another date                                                                                                                                                                                                                                                                       | The dateline of the assignment should be edited and the new dateline should be reflected instead                                                                                     |           |
| 11 |                                     | Test that users are able to delete an event from their to-do list                                         | 1. Click the X button on the right side of the event that is to be deleted                                                                                                                                                                                                                                                                | The event should be deleted from the list screen                                                                                                                                     | Pass      |
| 12 |                                     | Test that users are able to check off their list when they are done with an assignment                    | 1. Click on the task that has been completed                                                                                                                                                                                                                                                                                              | The event should be under completed task instead of pending tasks, with a strikethrough the event name and the dateline                                                              | Pass      |
| 13 | Navigate to the user profile screen | Test that users will be able to navigate to the user profile screen                                       | 1. Click the user profile screen button at the bottom of the page                                                                                                                                                                                                                                                                         | The user profile screen should be reflected                                                                                                                                          | Pass      |
| 14 |                                     | Test that users will be able to edit their study habits and add their most productive study timings       | 1. Click the +edit study habit button after navigating to the user profile screen 2. Select their most productive timings of the day, whether it is morning afternoon or at night (chose morning) 3. Edit their study habits, change it to another timing (edit to at night)                                                              | After step 2, the user profile screen should show that their “Most productive period: morning After step 3, the user profile screen should show their “Most productive period: night | Pass      |
| 15 |                                     | Test that users will be able to logout from the user profile screen                                       | 1. Click the logout button from the user profile screen page                                                                                                                                                                                                                                                                              | They should be brought back to the login page                                                                                                                                        | Pass      |
| 16 | Add events into the calendar        | Test that users will be able to create a new event with a name, start time and end time                   | 1.Navigate to the calendar page via the bottom of the screen by clicking on the calendar icon 2. Click the button add event 3. Key in the name of the event, the date, start time and stop time of the event. 4. Keyed in “Test1” as the Description, Date: “2021-07-21”, start time as “15:16” and stop time 19:03”                      | The event should pop up the date, 21 July with the time 15:16 - 19:03 at the top of the bar, and the title of the event below “Test 1”                                               | Pass      |
| 17 |                                     | Test that the time will be sorted accordingly to what the users key                                       | 1. Add another event on top of the previous event that was created 2. Keyed in “Test2” as the Description, Date: “2021-07-21”, start time as “01:03” and stop time 01:09”                                                                                                                                                                 | The page should show that test2 should be above test1 as it has the earlier timing the event will take place during the day                                                          | Pass      |
| 18 |                                     | Test that another event with a different name can also be added into the calendar with the same timing    | 1. Add another event onto the previous events 2. Keyed in “Test3” as the Description, Date: “2021-07-21”, start time as “01:03” and stop time 01:09”                                                                                                                                                                                      | The page should show test2 and test3 to have the same timing, just that the description is different, whereby it is the names of the events respectively                             | Pass      |
| 19 | Delete events from the calendar     | Test that events can be deleted from the calendar                                                         | 1. Delete an event from the calendar by clicking the “X” button on the right hand corner                                                                                                                                                                                                                                                  | The page should show that the event is removed from the calendar screen                                                                                                              | Pass      |
| 20 | Recommendations, study plan         | Test that study sessions can be recommended after putting in the exam date (2 days from the current date) | 1. Navigate to the user profile screen and edit study habits, add their most productive time (eg morning) 2. Navigate to the calendar screen 3. Add the examination name, key in the date, start time, and stop time of the examination (2 days from the current date) and toggle the “Exam? Get study plan” switch on and add the event  | The calendar screen should show 2 recommended study sessions, in the morning before the examination                                                                                  | Pass      |
| 21 |                                     | Test that study sessions can be recommended after putting in the exam date (2 weeks from current date)    | 1. Navigate to the user profile screen and edit study habits, add their most productive time (eg morning) 2. Navigate to the calendar screen 3. Add the examination name, key in the date, start time and stop time of the examination (2 weeks from current date) and toggle the Exam? Get study plan on and add event                   | The calendar screen should show 2 recommended study sessions, (weekly) in the morning before the examination                                                                         | Pass      |
| 22 |                                     | Test that study sessions can be recommended after putting in the exam date (2 months from current date)   | 1. Navigate to the user profile screen and edit study habits, add their most productive time (eg morning) 2. Navigate to the calendar screen 3. Add the examination name, key in the date, start time and stop time of the examination (2 weeks from current date) and toggle the Exam? Get study plan on and add event                   | The calendar should also show study sessions that are 2 weeks apart                                                                                                                  | Pass      |
| 23 |                                     | Test that the recommended study sessions can be deleted                                                   | 1. Navigate to the calendar screen and delete the recommended study plan that you do not require by clicking on the X button by the side of the event                                                                                                                                                                                     | The calendar should show that the study session is deleted                                                                                                                           | Pass      |


