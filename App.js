import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  KeyboardAvoidingView,
  View, TouchableOpacity,
} from "react-native";

import TopBar from "./components/header";
import TodoListAsyncStorage from "./components/todoListAsyncStorage";
import TodoListSQLite from "./components/todoListSQLite";
import TodoListRealm from "./components/todoListRealm";


const App = () => {

  const [DB, setDB] = useState('AsyncStorage');
  const [todo, setTodo] = useState(<TodoListAsyncStorage />);

  useEffect(()=>{

    if(DB==='AsyncStorage'){
      setTodo(<TodoListAsyncStorage/>)
    } else if (DB==='SQLite'){
      setTodo(<TodoListSQLite/>)
    } else if (DB==='Realm'){
      setTodo(<TodoListRealm/>)
    }

  }, [DB])

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{flex:12, height: "94%", backgroundColor: "#efefef"}}
      >

        <TopBar/>

        <View style={{flexDirection: 'row', height: 40, borderBottomWidth: 1, borderBottomColor: "#aaaaaa"}}>

          <TouchableOpacity
            style={{flex: 1, backgroundColor: DB==='AsyncStorage'?'#C6C6DA':'#E6E6FA', justifyContent: "center"}}
            onPress={()=>{
              setDB('AsyncStorage');
            }}
          >
            <Text style={{textAlign: "center", alignItems: "center"}}>
              Async Storage
            </Text>
          </TouchableOpacity>


          <TouchableOpacity
            style={{flex: 1, backgroundColor: DB==='SQLite'?'#C6C6DA':'#E6E6FA', justifyContent: "center"}}
            onPress={()=>{
              setDB('SQLite');
            }}
          >
            <Text style={{textAlign: "center", alignItems: "center"}}>
              SQLite
            </Text>
          </TouchableOpacity>


          <TouchableOpacity
            style={{flex: 1, backgroundColor: DB==='Realm'?'#C6C6DA':'#E6E6FA', justifyContent: "center"}}
            onPress={()=>{
              setDB('Realm');
            }}
          >
            <Text style={{textAlign: "center", alignItems: "center"}}>
              Realm
            </Text>
          </TouchableOpacity>

        </View>

        {todo}

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


export default App;
