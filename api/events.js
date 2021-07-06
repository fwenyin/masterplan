import firebase from "./firebase";

const db = firebase.database();

const newEvent = (id, title, date, startTime, stopTime) => ({ id, title, date, startTime, stopTime });
const newNUSModsLink = (id, link) => ({ id, link });

// dates accurate for AY2021 only
const nusStartDate = {
  "1": "2021-08-09", // monday week 1
  "2": "2021-08-16",
  "3": "2021-08-23",
  "4": "2021-08-30",
  "5": "2021-09-06",
  "6": "2021-09-13",
  "7": "2021-09-27",
  "8": "2021-10-04",
  "9": "2021-10-11",
  "10": "2021-10-18",
  "11": "2021-10-25",
  "12": "2021-11-01",
  "13": "2021-11-08",
} 

// to get the exact date of event, add value(days) to the monday of each week according to current day
const weektoDays = {
  "Monday": 0,
  "Tuesday": 1,
  "Wednesday": 2,
  "Thursday": 3,
  "Friday": 4,
}

// values for AY2021 only
const daysInMonth = {
  "08": 31,
  "09": 30,
  "10": 31,
  "11": 30,
  "12": 31
}

// shouldnt have link in database, just derive schedule
export const createNUSModsLink = async ({ userId, link }, onSuccess, onError) => {
  try {
    // push generates a new child node on the client side
    // thus allowing us to grab the correct new node id
    const NUSModslink = db.ref(`link/${userId}`).push();
    await NUSModslink.set(newNUSModsLink(NUSModslink.key, link));
    return onSuccess(NUSModslink);
  } catch (error) {
    return onError(error);
  }
}

export const createEvent = async ({ userId, title, date, startTime, stopTime }, onSuccess, onError) => {
  try {
    // push generates a new child node on the client side
    // thus allowing us to grab the correct new node id
    const event = db.ref(`events/${userId}`).push();
    await event.set(newEvent(event.key, title, date, startTime, stopTime));
    return onSuccess(event);
  } catch (error) {
    return onError(error);
  }
}

export const subscribe = (userId, onValueChanged) => {
  const events = db.ref(`events/${userId}`);
  events.on("value", (snapshot) => onValueChanged(snapshot.val()));
  return () => events.off("value");
}

