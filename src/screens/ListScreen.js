import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, SectionList, TextInput, Text } from "react-native";
import { Checkbox, IconButton, List, Menu, Button, Portal, Modal } from "react-native-paper";
import { CommonActions } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import Screen from "../components/Screen";

import * as Authentication from "../../api/auth";
import * as Tasks from "../../api/tasks";
import colors from "../constants/colors";

export default ({ navigation }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState({});
  const [sectionedTasks, setSectionedTasks] = useState([]);
  const [userId, setUserId] = useState(Authentication.getCurrentUserId());
  const newTaskRef = useRef();
  const [deadline, setDeadline] = useState("");
  const [modalData, setModalData] = useState([false, ""]); //[isModalVisible, taskId]
  const [visibleDate, setVisibleDate] = useState(false); // for date picker modal

  useEffect(() => {
    return Tasks.subscribe(userId, setTasks);
  }, []);

  useEffect(() => {
    if (tasks) {
      const sortedTasks = [];

      const tasksArray = Object.values(tasks);
      const completedTasks = tasksArray.filter((task) => task.completed);
      const pendingTasks = tasksArray.filter((task) => !task.completed);

      if (pendingTasks.length > 0) sortedTasks.push({ title: "Pending", data: pendingTasks });
      if (completedTasks.length > 0) sortedTasks.push({ title: "Completed", data: completedTasks });

      setSectionedTasks(sortedTasks);
    }
  }, [tasks]);

  const handleCreateTask = () => {
    const subject = newTask;
    setNewTask("");
    newTaskRef.current.clear();

    return Tasks.createTask(
      { userId, subject },
      () => {},
      console.error
    );
  }

  const handleCompleteTask = (taskId) => Tasks.completeTask(
    { userId: Authentication.getCurrentUserId(), taskId }, 
    () => {}, 
    console.error
  );

  const handleUncompleteTask = (taskId) => Tasks.uncompleteTask(
    { userId: Authentication.getCurrentUserId(), taskId }, 
    () => {}, 
    console.error
  );

  const handleDeleteTask = (taskId) => Tasks.deleteTask(
    { userId: Authentication.getCurrentUserId(), taskId },
    () => {},
    console.error
  );

  const toggleModalVisibility = () => {
    setModalData((modalData) => ([!modalData[0], modalData[1]]));
  };

  const toggleModalVisibilityAndSetItemId = (taskId) => {
    setModalData((modalData) => ([!modalData[0], taskId]));
  }

  const handleAddInfo = () => {
    setModalData((modalData) => ([!modalData[0], modalData[1]]));
    const taskId = modalData[1];

    return Tasks.setAddInfo(
      deadline, 
      { userId: Authentication.getCurrentUserId(), taskId },
      () => {},
      console.error
    );
  };

  const displayDeadline = (deadline) => {
    if (deadline.includes("0000-00-00")) {
      return "";
    } 
    return "Deadline:" + deadline;
  }

  const renderList = ({ item, index, section, separators }) => {
    return (
      <View style={styles.taskContainer}>
        <List.Item
          title={item.subject}
          description={ displayDeadline(item.deadline) }
          left={(props) => <Checkbox {...props} status={item.completed ? "checked" : "unchecked"} />}
          right={(props) => 
            <View style={[{flexDirection: 'row' }]}>
              <IconButton {...props} icon="calendar-clock" onPress={() => toggleModalVisibilityAndSetItemId(item.id)} />
              <Portal>
                <Modal animationType="slide" 
                    transparent visible={modalData[0]} 
                    presentationStyle="overFullScreen" 
                    onDismiss={toggleModalVisibility}>
                      <View style={styles.viewWrapper}>
                        <View style={styles.modalView}>
                          <Text style={styles.subtitle}>Deadline of task</Text>
                          <Text style={styles.addInfoInput}>{deadline}</Text>

                          <Button
                              color= {colors.secondaryDark}
                              style={{ marginTop: 20, borderRadius: 10 }}
                              contentStyle={{ paddingVertical: 5 }}
                              cancelTextIOS= "Close"
                              onPress={() => setVisibleDate(true)}
                          >Show Date Picker</Button>
                          <DateTimePickerModal
                            isVisible={visibleDate}
                            mode="date"
                            onConfirm={(value) => setDeadline(value.toISOString().substring(0,10))}
                            onCancel={() => setVisibleDate(false)}
                          />

                          <Button
                              mode="contained"
                              color= {colors.primary}
                              style={{ marginTop: 20, borderRadius: 10 }}
                              contentStyle={{ paddingVertical: 5 }}
                              onPress={handleAddInfo}
                          >Set</Button>
                        </View>
                    </View>
                </Modal> 
              </Portal>

              <IconButton {...props} icon="close" onPress={() => handleDeleteTask(item.id)} />
            </View>
          }
          titleStyle={item.completed ? styles.completedTaskSubject : {}}
          onPress={() => item.completed ? handleUncompleteTask(item.id) : handleCompleteTask(item.id)}
        />
      </View>
    )
  }

  return (
    <Screen style={{flex: 1}}>
      <SectionList
        sections={sectionedTasks}
        keyExtractor={(item, index) => item + index}
        renderItem={renderList}
        renderSectionHeader={({ section: { title }}) => <List.Subheader>{title} tasks</List.Subheader>}
        ListHeaderComponent={
          <View style={styles.header}>

            <View style={styles.addTaskContainer}>
              <IconButton icon="plus" color={colors.button} style={{ margin: 0 }} />

              <TextInput
                ref={newTaskRef}
                style={styles.textInput}
                placeholder={`Any task to complete, ${Authentication.getCurrentUserName()}?`}
                onChangeText={setNewTask}
                onSubmitEditing={handleCreateTask}
              />
            </View>
          </View>
        }
      />
    <View style={{paddingTop: 25, flexDirection: "row", alignItems: "center"}}>
      <Button
        style ={{paddingHorizontal: 50}}
        icon="format-list-bulleted" labelStyle={{ fontSize: 30 }} color={colors.button}>
      </Button> 
      <Button
        icon="calendar" labelStyle={{ fontSize: 30 }} color={colors.button} onPress={() => navigation.navigate("Schedule")}>
      </Button>
      <Button
        style ={{paddingHorizontal: 65}}
        icon="account-circle" labelStyle={{ fontSize: 30 }} color={colors.button} onPress={() => navigation.navigate("Profile")}>
      </Button>
    </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 40,
    paddingBottom: 10
  },

  task: {
    borderRadius: 10
  },

  taskContainer: {
    borderRadius: 10,
    overflow: "hidden"
  },

  completedTaskSubject: {
    textDecorationLine: "line-through",
    color: "grey"
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
    height: 400,
    width: 350,
    backgroundColor: "#fff",
    borderRadius: 7,
  },

  subtitle: {
    fontSize: 17,
    paddingTop: 50,
    paddingBottom: 0,
    fontWeight: "bold"
  },

  textInput: {
    fontSize: 17,
    flex: 1
  },

  addInfoInput: {
    fontSize: 17,
    paddingTop: 20,
    paddingBottom: 30,
  },
  
  addTaskContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(1,1,1,0.05)",
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderRadius: 13,
  },
});
