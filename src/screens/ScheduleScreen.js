import React, { useEffect, useState, useRef } from "react";
import { Pressable, StyleSheet, Keyboard, View, TextInput, Alert, TouchableOpacity } from "react-native";
import { Button, Portal, Modal, IconButton, Card, Text, Switch } from "react-native-paper";
import { TimePickerModal } from 'react-native-paper-dates';
import {Agenda} from 'react-native-calendars';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import Screen from "../components/Screen";

import colors from "../constants/colors";

import * as Authentication from "../../api/auth";
import * as Events from "../../api/events";
import * as Profile from "../../api/profile";

export default ({ navigation }) => {
  const [userId, setUserId] = useState(Authentication.getCurrentUserId());
  const [isModalVisible, setModalVisibility] = useState(false); // for events
  const [visibleStart, setVisibleStart] = useState(false); // for time picker modal
  const [visibleStop, setVisibleStop] = useState(false); // for time picker modal
  const [visibleDate, setVisibleDate] = useState(false); // for date picker modal
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [stopTime, setStopTime] = useState("");
  const newEventRef = useRef();
  const [events, setEvents] = useState({});
  const [items, setItems] = useState({}); // events for each day
  const [isSwitchOn, setIsSwitchOn] = useState(false); // recomendation switch
  const [profile, setProfile] = useState(null);
  const [cleanedProfile, setCleanedProfile] = useState({});

  useEffect(() => {
    return Events.subscribe(userId, setEvents);
  }, []);

  useEffect(() => {
    if (events) {
      const sortedEvents = {};
      const eventsArray = Object.values(events);
      const sorted = eventsArray.sort((e1, e2) => 
          (e1.startTime.split(':')[0] + e1.startTime.split(':')[1]) - (e2.startTime.split(':')[0] + e2.startTime.split(':')[1]));

      for (let i = 0; i < sorted.length; i++) {
        if (!sortedEvents[sorted[i].date]) {
          sortedEvents[sorted[i].date] = [];
        }
        sortedEvents[sorted[i].date].push({
          time: "Time: " + sorted[i].startTime + ' - ' + sorted[i].stopTime,
          startTime: parseInt(sorted[i].startTime.split(':')[0] + sorted[i].startTime.split(':')[1]),
          stopTime: parseInt(sorted[i].stopTime.split(':')[0] + sorted[i].stopTime.split(':')[1]),
          title: sorted[i].title,
          id: sorted[i].id,
          fromLink: sorted[i].fromLink,
          height: 80,
        });
      }
      setItems(sortedEvents);
    }
  }, [events]);

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

  const renderEvent = (item) => {
    return (
      <TouchableOpacity style={{marginRight: 10, marginTop: 17}}>
        <Card>
          <Card.Content>
            <View style={[{flexDirection: 'row' }]}>
              <View>
                <Text style={styles.time}>{item.time}</Text>
                <Text style={styles.description}>{item.title}</Text>
              </View>
              <View style={{position: 'absolute', right: 0}}>
                <IconButton icon="close" onPress={() => handleDeleteEvent(item.id)} />
              </View>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  const datediff = (first, second) => {
    return Math.round((second-first)/(1000*60*60*24));
  }

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  
  const recommendSchedule = (date) => {
    addRecommendation(addDays(new Date(Date.now()), 1));
    if (datediff(new Date(date), new Date(Date.now())) <= 2) {
      return addRecommendation(addDays(new Date(date), -1));
    }
    if (datediff(new Date(date), new Date(Date.now())) <= 7) {
      addRecommendation(addDays(new Date(Date.now()), 2));
      return addRecommendation(addDays(new Date(date), -1));
    }
    if (datediff(new Date(date), new Date(Date.now())) <= 30) {
      addRecommendation(addDays(new Date(Date.now()), 8));
      return addRecommendation(addDays(new Date(date), -1));
    }
    if (datediff(new Date(date), new Date(Date.now())) <= 90) {
      addRecommendation(addDays(new Date(Date.now()),15));
      return addRecommendation(addDays(new Date(date), -1));
    }
    if (datediff(new Date(date), new Date(Date.now())) <= 180) {
      addRecommendation(addDays(new Date(Date.now()), 31));
      return addRecommendation(addDays(new Date(date), -1));
    }
    return addRecommendation(addDays(new Date(date), -1));
  }

  const addRecommendation = (date) => {
    const dict = {
      'morning': {
        startTime: 1000,
        stopTime: 1200
      },
      'afternoon': {
        startTime: 1400,
        stopTime: 1800
      },
      'night': {
        startTime: 1930,
        stopTime: 2330
      }
    };
    const dateString = date.toISOString().substring(0,10);
    const start = dict[Object.values(cleanedProfile)[0]].startTime;
    const stop = dict[Object.values(cleanedProfile)[0]].stopTime;
    const list = [];
    const itemsOnDate = items[dateString];
    const description = "study session for " + title;
    if (itemsOnDate) {
      for (let i = 0; i < itemsOnDate.length; i++) {
        if (start < itemsOnDate[i].startTime < stop || start < itemsOnDate[i].stopTime < stop) {
          list.push(itemsOnDate[i]);
        }
      }
    }
    if (list.length === 0) {
      alert("study session created on: " + dateString);
      return Events.createStudy(false, {userId}, description, dateString, 
        start.toString().substring(0,2) + ":" + start.toString().substring(2,4), 
        (start + 100).toString().substring(0,2) + ":" + start.toString().substring(2,4),
        () => {},
        console.error);
    }
    if (start + 100 < list[0].startTime) { 
      alert("study session created on: " + dateString);
      return Events.createStudy(false, {userId}, description, dateString, 
        start.toString().substring(0,2) + ":" + start.toString().substring(2,4), 
        (start + 100).toString().substring(0,2) + ":" + start.toString().substring(2,4),
        () => {},
        console.error);
    }
    if (stop - 100 > list[list.length-1].stopTime) {
      alert("study session created on: " + dateString);
      return Events.createStudy(false, {userId}, description, dateString, 
        (stop - 100).toString().substring(0,2) + ":" + stop.toString().substring(2,4), 
        (stop).toString().substring(0,2) + ":" + stop.toString().substring(2,4),
        () => {},
        console.error);
    }
    for (let i = 0; i < list.length-1; i++) {
      alert("study session created on: " + dateString);
      if (list[i].stopTime + 100 < list[i+1].startTime) {
        return Events.createStudy(false, {userId}, description, dateString, 
          list[i].stopTime.toString().substring(0,2) + ":" +list[i].stopTime.toString().substring(2,4), 
          (list[i].stopTime + 100).toString().substring(0,2) + ":" + list[i].stopTime.toString().substring(2,4),
          () => {},
          console.error);
      }
    }
    return;
  }

 
 const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  const toggleModalVisibility = () => {
    setModalVisibility((isModalVisible) => !isModalVisible);
  }

  const handleStartTime = (value) => {
    setStartTime((value.hours < 10 ? "0" + value.hours : value.hours) 
        + ':' + (value.minutes < 10 ? "0" + value.minutes : value.minutes));
  }

  const handleStopTime = (value) => {
    setStopTime((value.hours < 10 ? "0" + value.hours : value.hours) 
        + ':' + (value.minutes < 10 ? "0" + value.minutes : value.minutes));
  }

  const handleAddEvent = () => {
    setModalVisibility((isModalVisible) => !isModalVisible);
    newEventRef.current.clear();
    
    if (isSwitchOn) {
      recommendSchedule(date);
    }

    return Events.createEvent(false, {userId, title, date, startTime, stopTime},
      () => {},
      console.error);
  }

  const handleDeleteEvent = (eventId) => Events.deleteEvent(
    { userId: Authentication.getCurrentUserId(), eventId },
    () => {},
    console.error
  );

  return (
    <Screen style={[styles.container, { flexDirection: "column" }]}>
      <View style={{ flex: 1 }}>
        <Agenda
          theme={{backgroundColor: "#F5DEB3",
                  calendarBackground: "#F5DEB3", 
                  agendaKnobColor: colors.secondaryDark,
                  agendaDayTextColor: colors.primary, // day name
                  agendaDayNumColor: colors.primary, // day number
                  agendaTodayColor: colors.primary, // today in list
                  monthTextColor: colors.primary, // name in calendar
                  textSectionTitleColor: colors.secondaryDark,
                  selectedDayBackgroundColor: colors.secondaryDark,
                  dayTextColor: colors.secondaryDark,
                  dotColor: colors.secondaryDark,
                }}
          items={items}
          selected={new Date()}
          renderItem={renderEvent}
          renderEmptyData={() => (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <Text style={styles.noEventsText}>No events</Text>
            </View>
          )}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <Button
            styles={{paddingBottom: 100}}
            
            icon="plus"
            mode="contained"
            onPress={toggleModalVisibility}
          >
            Add Event
          </Button>
        </View>

        <Portal>
          <Modal
            animationType="slide"
            transparent
            visible={isModalVisible}
            presentationStyle="overFullScreen"
            onDismiss={toggleModalVisibility}
          >
            <View style={styles.viewWrapper}>
              <View style={styles.modalView}>
                <Text style={styles.title}>New Event</Text>
                <Text style={styles.subtitle}>Title</Text>
                <TextInput
                  ref={newEventRef}
                  style={styles.addInfoInput}
                  placeholder={"Description of event"}
                  onChangeText={(value) => setTitle(value)}
                />
                <Text style={styles.subtitle}>Date</Text>


                <Text style={styles.addInfoInput}>{date}</Text>
                <Button
                    color= {colors.secondaryDark}
                    style={styles.addInfoInput}
                    cancelTextIOS= "Close"
                    onPress={() => setVisibleDate(true)}
                >Show Date Picker</Button>
                <DateTimePickerModal
                  isVisible={visibleDate}
                  mode="date"
                  onConfirm={(value) => setDate(value.toISOString().substring(0,10))}
                  onCancel={() => setVisibleDate(false)}
                />

                <Text style={styles.subtitle}>Time</Text>
                <TimePickerModal
                  visible={visibleStart}
                  onDismiss={() => setVisibleStart(false)}
                  onConfirm={(value) => handleStartTime(value)}
                  cancelLabel="Close"
                  animationType="fade" // optional, default is 'none'
                />
                <View style={styles.timeContainer}>
                  <Button
                    color={colors.secondaryDark}
                    onPress={() => setVisibleStart(true)}
                  >
                    Pick start time
                  </Button>
                  <Text style={styles.timeInput}>{startTime}</Text>
                </View>
                <TimePickerModal
                  visible={visibleStop}
                  onDismiss={() => setVisibleStop(false)}
                  onConfirm={(value) => handleStopTime(value)}
                  cancelLabel="Close"
                  animationType="fade"
                />
                <View style={styles.timeContainer}>
                  <Button
                    color={colors.secondaryDark}
                    onPress={() => setVisibleStop(true)}
                  >
                    {"Pick stop time "}
                  </Button>
                  <Text style={styles.timeInput}>{stopTime}</Text>
                </View>
                <View style={styles.switchContainer}>
                  <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
                  <Text style={{paddingTop:7, fontSize: 17}}>Exam? Get study plan!</Text>
                </View>
                <Button
                  mode="contained"
                  style={{ marginTop: 20, marginBottom: 20, borderRadius: 10 }}
                  contentStyle={{ paddingVertical: 5 }}
                  onPress={handleAddEvent}
                >
                  Add
                </Button>
              </View>
            </View>
          </Modal>
        </Portal>
        <View style={{paddingTop: 25, flexDirection: "row", alignItems: "center"}}>
          <Button
            style ={{paddingHorizontal: 50}}
            icon="format-list-bulleted" labelStyle={{ fontSize: 30 }} color={colors.button} onPress={() => navigation.navigate("List")}>
          </Button> 
          <Button
            icon="calendar" labelStyle={{ fontSize: 30 }} color={colors.button}>
          </Button>
          <Button
            style ={{paddingHorizontal: 65}}
            icon="account-circle" labelStyle={{ fontSize: 30 }} color={colors.button} onPress={() => navigation.navigate("Profile")}>
           </Button>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    paddingTop: 40,
    paddingBottom: 10
  },

  linkContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(1,1,1,0.05)",
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderRadius: 13,
  },

  timeContainer : {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(1,1,1,0.05)",
    width: 250,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },

  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 250,
    paddingTop: 30,
    paddingVertical: 15,
  },

  viewWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },

  modalView: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    height: 650,
    width: 400,
    backgroundColor: "#fff",
    borderRadius: 7,
  },

  title: {
    fontSize: 25,
    fontWeight: "bold",
    paddingTop: 30
  },

  subtitle: {
    fontSize: 17,
    paddingTop: 30,
    paddingBottom: 10,
    fontWeight: "bold"
  },

  time: {
    fontSize: 17,
    paddingTop: 20,
    color: colors.secondaryDark
  },

  description: {
    fontSize: 15,
    paddingTop: 20,
    paddingBottom: 10,
  },

  textInput: {
    fontSize: 17,
    flex: 1
  },

  timeInput: {
    fontSize: 17,
    paddingTop: 7,
  },

  addInfoInput: {
    fontSize: 17,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "rgba(1,1,1,0.05)",
    paddingVertical: 5,
    width: 250,
    paddingHorizontal: 20,
  },

  noEventsText: {
    fontSize: 17,
    textAlign: "center",
    color: colors.secondaryDark,
    fontWeight: "bold"
  },
});
