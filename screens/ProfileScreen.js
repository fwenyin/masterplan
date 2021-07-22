import React, { useEffect, useState, useRef } from "react";
import { Pressable, StyleSheet, Keyboard, View, TextInput, Alert, TouchableOpacity } from "react-native";
import { Button, Portal, Modal, IconButton, Card, Text } from "react-native-paper";

import Screen from "../components/Screen";

import colors from "../constants/colors";

import * as Authentication from "../../api/auth";

export default ({ navigation }) => {
  const [userId, setUserId] = useState(Authentication.getCurrentUserId());
  const [isModalVisible, setModalVisibility] =useState(false);  




  return(
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
          <Text style={styles.title}>Edit Profile</Text>
          <Text style={styles.subtitle}>When are you most productive?</Text>
          <TextInput
            ref={newEventRef}
            style={styles.addInfoInput}
            placeholder={"Description of event"}
            onChangeText={(value) => setTitle(value)}
          />

          <TimePickerModal
            visible={visibleStart}
            onDismiss={() => setVisibleStart(false)}
            onConfirm={(value) => handleStartTime(valiue)}
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
          <Button
            mode="contained"
            style={{ marginTop: 20, marginBottom: 20, borderRadius: 10 }}
            contentStyle={{ paddingVertical: 5 }}
            onPress={handleAddEvent}
          >
            Save
          </Button>
        </View>
      </View>
    </Modal>
  </Portal>
  );
}