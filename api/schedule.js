import firebase from "./firebase";

const db = firebase.database();

const newNUSModsLink = (id, link, completed) => ({ id, link, completed });
const newSchedule = (id, week, day, startTime, endTime, description, completed) => ({ id, week, day, startTime, endTime, description, completed });


// shouldnt have link in database, just derive schedule
export const createNUSModsLink = async ({ userId, link }, onSuccess, onError) => {
  try {
    // push generates a new child node on the client side
    // thus allowing us to grab the correct new node id
    const NUSModslink = db.ref(`link/${userId}`).push();
    await NusModslink.set(newNUSModsLink(NusModslink.key, link, false));
    return onSuccess(NUSModslink);
  } catch (error) {
    return onError(error);
  }
}

// shld data be nested or not?
export const createSchedule = async ({ userId, week, day, startTime, endTime, description }, onSuccess, onError) => {
  try {
    // push generates a new child node on the client side
    // thus allowing us to grab the correct new node id
    const schedule = db.ref(`schedule/${userId}`).push();
    await schedule.set(newSchedule(schedule.key, week, day, startTime, endTime, description, false));
    return onSuccess(schedule);
  } catch (error) {
    return onError(error);
  }
}

