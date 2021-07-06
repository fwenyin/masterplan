import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Agenda} from 'react-native-calendars';
import {Card, Avatar, Text} from 'react-native-paper';

import Screen from "../components/Screen";

import * as Authentication from "../../api/auth";
import colors from "../constants/colors";
import * as Events from "../../api/events";

export default ({ navigation }) => {
  const [events, setEvents] = useState({});
  const [userId, setUserId] = useState(Authentication.getCurrentUserId());
  const [sortedEvents, setSortedEvents] = useState([]);
  const [items, setItems] = useState({}); // events for each day

  useEffect(() => {
    return Events.subscribe(userId, setEvents);
  }, []);

  useEffect(() => {
    if (events) {
      const eventsArray = Object.values(events);
      const sorted = eventsArray.sort((e1, e2) => 
          (e1.startTime.split(':')[0] + e1.startTime.split(':')[1]) - (e2.startTime.split(':')[0] + e2.startTime.split(':')[1]));

      for (let i = 0; i < sorted.length; i++) {
        if (!items[sorted[i].date]) {
          items[sorted[i].date] = [];
        }
        items[sorted[i].date].push({
          time: "Time: " + sorted[i].startTime + ' - ' + sorted[i].stopTime,
          title: sorted[i].title,
          height: 80,
        });
      }
    }
  }, [events]);

  const renderEvent = (item) => {

    return (
      <TouchableOpacity style={{marginRight: 10, marginTop: 17}}>
        <Card>
          <Card.Content>
            <View>
              <Text style={styles.title}>{item.time}</Text>
              <Text style={styles.subtitle}>{item.title}</Text>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
      <View style={{flex: 1}}>
        <Agenda 
          theme={{backgroundColor: '#F5DEB3'}}
          items={items}
          selected={new Date()}
          renderItem={renderEvent}
          renderEmptyData={() => 
              <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
                <Text style={{ textAlign: "center" }}>No events for today</Text>
              </View>}
        />
      </View>
  );
}


const styles = StyleSheet.create({
  title: {
    fontSize: 17,
    paddingTop: 30
  },

  subtitle: {
    fontSize: 15,
    paddingTop: 20,
    paddingBottom: 10,
  },

  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },

  agenda: {
    backgroundColor: '#F5DEB3'
  },

  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  }
});
