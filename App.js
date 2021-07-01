import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  View,
} from 'react-native';

import TopBar from "./components/header";
import TodoList from "./components/todoList2";


const App = () => {


  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{flex:12, height: "94%", backgroundColor: "#efefef"}}
      >
        <TopBar/>
        <TodoList/>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wholeBody: {
    flex: 1,
    flexDirection: "column",
  }
});

export default App;
