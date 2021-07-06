import React, { useEffect, useState, useRef } from "react";
import { Pressable, StyleSheet, Keyboard, View, TextInput, Alert, TouchableOpacity } from "react-native";
import { Button, Portal, Modal, IconButton, Card, Text } from "react-native-paper";
import { TimePickerModal } from 'react-native-paper-dates';
//import DateTimePicker from '@react-native-community/datetimepicker';
import { CommonActions } from "@react-navigation/native";
import {Agenda} from 'react-native-calendars';

import Screen from "../components/Screen";

import colors from "../constants/colors";

import * as Authentication from "../../api/auth";
import * as Events from "../../api/events";

export default ({ navigation }) => {
  const [userId, setUserId] = useState(Authentication.getCurrentUserId());
  const [isModalVisible, setModalVisibility] =useState(false); 
  const [visibleStart, setVisibleStart] = useState(false); // for time picker modal
  const [visibleStop, setVisibleStop] = useState(false); // for time picker modal
  const [NUSModsLink, setNUSModsLink] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [stopTime, setStopTime] = useState("");
  const newEventRef = useRef();
  const [events, setEvents] = useState({});
  const [items, setItems] = useState({}); // events for each day

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
          title: sorted[i].title,
          height: 80,
        });
      }
      setItems(sortedEvents);
    }
  }, [events]);

  const renderEvent = (item) => {
    return (
      <TouchableOpacity style={{marginRight: 10, marginTop: 17}}>
        <Card>
          <Card.Content>
            <View>
              <Text style={styles.time}>{item.time}</Text>
              <Text style={styles.description}>{item.title}</Text>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  const handleSync = () => {
    // figure how to add link into database? and also change the timetable according to link
    const link = NUSModsLink;
    if (!link.includes("https://nusmods.com/timetable")) // is this needed?
      return alert("invalid link");
    const modules = link.split('?')[1].split('&');
    // BT2102=LAB:8,LEC:1&CS2030=LAB:10G,REC:01,LEC:1&EC1301=TUT:E23,LEC:1&IS2101=SEC:G08
    for (i = 0; i < modules.length; i++) {
        const moduleCode = modules[i].split('=')[0];
        const lessonSlots = modules[i].split('=')[1].split(','); //array of eg.LAB:10G
        const moduleFromApi = getModuleFromApi(moduleCode);
        for (i = 0; i < lessonSlots.length; i++) {
          for (j = 0; j < moduleFromApi.length; j++) {
            if (lessonSlots[i].split(':')[0].equalsIgnoreCase(moduleFromApi[j].lessonType.substring(0,2)) 
            && lessonSlots[i].split(':')[1] === moduleFromApi[j].classNo) 
              /* setdata in database(?)
              * moduleCode + moduleFromApi[j].lessonType (description)
              * moduleFromApi[j].startTime
              * moduleFromApi[j].endTime
              * moduleFromApi[j].weeks
              * moduleFromApi[j].day
              */
              return Schedule.createSchedule(
                { userId, week, day, startTime, endTime, description },
                () => {},
                console.error
              );
          }
            
        }
    }
  }

  const getModuleFromApi = async (moduleCode) => {
    try {
      let moduleCode = moduleCode;
      let response = await fetch(
        'https://api.nusmods.com/v2/2021-2022/modules/${moduleCode}.json'
      );
      let json = await response.json();
      return json.semesterData.timetable;
    } catch (error) {
       console.error(error);
    }
  }

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

    return Events.createEvent({userId, title, date, startTime, stopTime},
      () => {},
      console.error);
  }

  return (
    <Screen style={[styles.container, { flexDirection: "column" }]}>
      <View style={{ flex: 1 }}>
        <View style={styles.linkContainer}>
          <TextInput
            style={styles.textInput}
            placeholder={`Input your NUSMods link to sync your timetable!`}
            onChangeText={setNUSModsLink}
            onSubmitEditing={handleSync}
          />
        </View>
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
              <Text style={styles.noEventsText}>No events for today</Text>
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
                <TextInput
                  style={styles.addInfoInput}
                  placeholder={"YYYY-MM-DD"}
                  onChangeText={(value) => setDate(value)}
                />
                <Text style={styles.subtitle}>Time</Text>
                <TimePickerModal
                  visible={visibleStart}
                  onDismiss={() => setVisibleStart(false)}
                  onConfirm={(value) => handleStartTime(value)}
                  cancelLabel="Close"
                  confirmLabel="Select"
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
                  confirmLabel="Select"
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
            style ={{paddingHorizontal: 100}}
            icon="format-list-bulleted" labelStyle={{ fontSize: 30 }} color={colors.button} onPress={() => navigation.navigate("List")}>
          </Button> 
          <Button
            icon="calendar" labelStyle={{ fontSize: 30 }} color={colors.button}>
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
    height: 500,
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
  }
});
