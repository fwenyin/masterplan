import React, { useState, useRef } from "react";
import { Pressable, StyleSheet, Text, Keyboard, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { CommonActions } from "@react-navigation/native";

import Screen from "../components/Screen";
import Brand from "../components/Brand";

import colors from "../constants/colors";

import * as Authentication from "../../api/auth";

export default ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const emailTextInput = useRef();
  const passwordTextInput = useRef();

  const handleRegister = () => {
    Keyboard.dismiss();
    setIsRegisterLoading(true);

    Authentication.createAccount(
      { name: username, email, password },
      (user) => navigation.dispatch(CommonActions.reset({
        index: 0,
        routes: [{
          name: "List",
          params: { name: user.displayName }
        }]
      })),
      (error) => {
        setIsRegisterLoading(false);
        return console.error(error);
      }
    );
  }

  return (
    <Screen scrollable>
      <View style={{ alignItems: 'center', paddingTop: 20 }}>
        <Brand />
      </View>

      <Text style={styles.title}>Sign up to take charge of your time.</Text>
      <Text style={styles.subtitle}>Let's create your account!</Text>

      <TextInput theme={{ colors: {primary: colors.secondaryDark,underlineColor:'transparent'}}}
        mode="outlined"
        label="Your name"
        style={{ marginTop: 10 }}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="words"
        returnKeyType="next"
        onSubmitEditing={() => emailTextInput.current.focus()}
        blurOnSubmit={false}
        left={<TextInput.Icon name="account" color={username ? colors.primary : colors.secondaryLight} />}
      />

      <TextInput theme={{ colors: {primary: colors.secondaryDark,underlineColor:'transparent'}}}
        ref={emailTextInput}
        mode="outlined"
        label="Email address"
        keyboardType="email-address"
        style={{ marginTop: 10 }}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        returnKeyType="next"
        onSubmitEditing={() => passwordTextInput.current.focus()}
        blurOnSubmit={false}
        left={<TextInput.Icon name="at" color={email ? colors.primary : colors.secondaryLight} />}
      />

      <TextInput theme={{ colors: {primary: colors.secondaryDark,underlineColor:'transparent'}}}
        ref={passwordTextInput}
        mode="outlined"
        label="Password"
        style={{ marginTop: 10 }}
        value={password}
        onChangeText={setPassword}
        left={<TextInput.Icon name="form-textbox-password" color={password ? colors.primary : colors.secondaryLight} />}
        secureTextEntry={!isPasswordVisible}
        autoCapitalize="none"
        right={<TextInput.Icon name={isPasswordVisible ? "eye-off" : "eye"} onPress={() => setIsPasswordVisible((state) => !state)} />}
      />

      <Button
        mode="contained"
        color={colors.button}
        style={{ marginTop: 100, borderRadius: 10 }}
        contentStyle={{ paddingVertical: 5 }}
        onPress={handleRegister}
        loading={isRegisterLoading}
        disabled={isRegisterLoading}
      >Create account</Button>

      <Button
        mode="contained"
        color={colors.primary}
        style={{ marginTop: 20, borderRadius: 10 }}
        contentStyle={{ paddingVertical: 5 }}
        onPress={() => navigation.goBack()}
        icon="arrow-left"
      >Log in instead</Button>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 30
  },

  subtitle: {
    fontSize: 18,
    paddingTop: 30,
    paddingBottom: 10
  },
});