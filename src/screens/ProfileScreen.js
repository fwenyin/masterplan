import React, { useEffect, useState, useRef } from "react";
import { Pressable, StyleSheet, Keyboard, View, TextInput, Alert, TouchableOpacity } from "react-native";
import { Button, Portal, Modal, IconButton, Card, Avatar, Title, Caption, Text, TouchableRipple } from "react-native-paper";
import DropDownPicker from 'react-native-dropdown-picker';
import { CommonActions } from "@react-navigation/native";

import Screen from "../components/Screen";

import colors from "../constants/colors";

import * as Authentication from "../../api/auth";
import * as Profile from "../../api/profile";

export default ({ navigation }) => {
  const [userId, setUserId] = useState(Authentication.getCurrentUserId());
  const [isModalVisible, setModalVisibility] = useState(false);
  const [profile, setProfile] = useState(null);
  const [cleanedProfile, setCleanedProfile] = useState({});
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState(null);
  const [items, setItems] = useState([
    {label: 'Morning', value: 'morning'},
    {label: 'Afternoon', value: 'afternoon'},
    {label: 'Night', value: 'night'},
  ]);

  useEffect(() => {
    return Profile.subscribe(userId, setProfile);
  }, []);

  useEffect(() => {
    if (profile) {
      const object = {};
      const profileObject = Object.values(profile)[0];
      object[profileObject.id] = profileObject.subject;
      setCleanedProfile(object);
    }
  }, [profile]);

  const handleLogout = () => {
    Authentication.signOut(
      () => navigation.dispatch(CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }]
      })),
      console.error
    );
  }

  const handleEditProfile = () => {
    setModalVisibility(false);
    if (profile) {
      Profile.deleteProfile(
      { userId: Authentication.getCurrentUserId() }, Object.keys(cleanedProfile)[0] ,
      () => {},
      console.error
      );
    }
    return Profile.createProfile(
      { userId, subject },
      () => {},
      console.error
    );
  }

  return(
    <Screen>
      <View style={styles.userInfoSection}>
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <Avatar.Image
            source={require('../../assets/bear.png')}
            size={100}
          />
          <View style={{marginLeft: 20}}>
            <Title style={[styles.title, {
              marginTop:15,
              marginBottom: 5,
            }]}>{Authentication.getCurrentUserName()}</Title>
            <Caption style={styles.caption}>{Authentication.getCurrentEmail()}</Caption>
          </View>
        </View>
        <Text style={styles.heading}>Most productive period: {Object.values(cleanedProfile)[0]}</Text>
        <Portal>
          <Modal
          style={{ alignItems: "center" }}
            animationType="slide"
            transparent
            visible={isModalVisible}
            presentationStyle="overFullScreen"
            onDismiss={() => setModalVisibility(false)}
          >
            <View style={styles.modalView}>
              <Text style={styles.title}>Study Habits</Text>
              <Text style={styles.subtitle}>When are you most productive?</Text>
                <DropDownPicker 
                containerStyle={{
                  alignItems: "center", justifyContent: "center", width: 250
                }}
                open={open}
                value={subject}
                items={items}
                setOpen={setOpen}
                setValue={setSubject}
                setItems={setItems}
                />

              <Button
                mode="contained"
                style={{ marginTop: 20, marginBottom: 20, borderRadius: 10 }}
                contentStyle={{ paddingVertical: 5 }}
                onPress={handleEditProfile}
              >
                Save
              </Button>
            </View>
          </Modal>
        </Portal>
        <Button
          icon="plus"
          mode="contained"
          onPress={() => setModalVisibility(true)}
        >
          Edit Study Habits
        </Button>
        <Button
            mode="contained"
            style={{ marginTop: 20, marginBottom: 20, borderRadius: 10 }}
            contentStyle={{ paddingVertical: 5 }}
            onPress={handleLogout}
 >
            Logout
          </Button>
      </View>
      <View style={{paddingTop: 360, flexDirection: "row", alignItems: "center"}}>
        <Button
          style ={{paddingHorizontal: 50}}
          icon="format-list-bulleted" labelStyle={{ fontSize: 30 }} color={colors.button} onPress={() => navigation.navigate("List")}>
        </Button> 
        <Button
          icon="calendar" labelStyle={{ fontSize: 30 }} color={colors.button} onPress={() => navigation.navigate("Schedule")}>
        </Button>
        <Button
          style ={{paddingHorizontal: 65}}
          icon="account-circle" labelStyle={{ fontSize: 30 }} color={colors.button}>
        </Button>
      </View>
    </Screen>

  );
}

const styles = StyleSheet.create({
  modalView: {
    alignItems: "center",
    justifyContent: "center",
    height: 400,
    width: 350,
    backgroundColor: "#fff",
    borderRadius: 7,
  },

  heading: {
    fontSize: 16,
    paddingTop: 70,
    paddingBottom: 20,
  },

  title: {
    fontSize: 25,
    fontWeight: "bold",
    paddingTop: 30
  },

  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
    marginTop: 45
  },

  subtitle: {
    fontSize: 17,
    paddingTop: 50,
    paddingBottom: 0
  },

  textInput: {
    fontSize: 17,
    flex: 1
  },

  viewWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  }
});
