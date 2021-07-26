import firebase from "./firebase";

const db = firebase.database();

const newProfile = (id, subject) => ({ id, subject });

export const createProfile = async ({ userId, subject }, onSuccess, onError) => {
  try {
    // push generates a new child node on the client side
    // thus allowing us to grab the correct new node id
    const profile = db.ref(`profile/${userId}`).push();
    await profile.set(newProfile(profile.key, subject));
    return onSuccess(profile);
  } catch (error) {
    return onError(error);
  }
}

export const deleteProfile = async ({ userId}, profileId, onSucess, onError) => {
  try {
    await db.ref(`profile/${userId}/${profileId}`).remove();
    return onSucess();
  } catch (error) {
    return onError(error);
  }
}

export const subscribe = (userId, onValueChanged) => {
  const profile = db.ref(`profile/${userId}`);
  profile.on("value", (snapshot) => onValueChanged(snapshot.val()));
  return () => profile.off("value");
}