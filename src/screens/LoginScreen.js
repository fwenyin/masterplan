import React, { useState, useRef } from "react";
import { Pressable, StyleSheet, Text, Keyboard, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { CommonActions } from "@react-navigation/native";

import Screen from "../components/Screen";
import Brand from "../components/Brand";

import colors from "../constants/colors";

import * as Authentication from "../../api/auth";
import { color } from "react-native-elements/dist/helpers";

export default ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const passwordTextInput = useRef();

  const handleLogin = () => {
    Keyboard.dismiss();
    setIsLoginLoading(true);

    Authentication.signIn(
      { email, password },
      (user) => navigation.dispatch(CommonActions.reset({
        index: 0,
        routes: [{
          name: "List",
          params: { name: user.displayName }
        }]
      })),
      (error) => {
        setIsLoginLoading(false);
        return console.error(error);
      }
    );
  }

  return (
    <Screen scrollable>
      <View style={{ alignItems: 'center', paddingTop: 60 }}>
        <Brand />
      </View>

      <Text style={styles.title}>Let's log in to your account!</Text>

      <TextInput theme={{ colors: {primary: colors.secondaryDark,underlineColor:'transparent'}}}
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
        color= {colors.primary}
        style={{ marginTop: 20, borderRadius: 10 }}
        contentStyle={{ paddingVertical: 5 }}
        onPress={handleLogin}
        loading={isLoginLoading}
        disabled={isLoginLoading}
      >Log in</Button>

      <Text style={styles.subtitle}>Don't have an account?</Text>

      <Button
        mode="contained"
        color= {colors.button}
        style={{ marginTop: 20, borderRadius: 10 }}
        contentStyle={{ paddingVertical: 5 }}
        onPress={() => navigation.navigate("Register")}
      >Create an account</Button>
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
    fontSize: 17,
    paddingTop: 70,
    paddingBottom: 0
  }
});