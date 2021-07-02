import React, { useState, useEffect, useRef } from "react";
import {
  View,
} from "react-native";

import AsyncStorage from '@react-native-async-storage/async-storage';
import NavBar from "./NavBar";
import ListViewForTodolist from "./ListViewForTodolist";
import InputComponent from "./InputComponent";


const TodoListAsyncStorage = () => {

  const [text, onChangeText] = useState('');
  const [data, setData] = useState([]);
  const [showData, setShowData] = useState([]);
  const [update, setUpdate] = useState(true);
  const [nav, setNav] = useState('all');
  const [revise, setRevise] = useState(false);
  const [revisedIndex, setRevisedIndex] = useState(0);

  const flatListRef = useRef();

  useEffect(()=>{
    _retrieveData()
  }, [update])

  const _insertData = async () => {
    const newData = {
      id: data.length,
      task: text,
      done: false
    };

    try{
      console.log(data.concat(newData));
      await AsyncStorage.setItem(
        '@todoList',
        JSON.stringify(data.concat(newData)),
      );
      setUpdate(true);
    } catch (error) {
    }
  }

  const _updateData = async () => {

    const revisedData = {
      id: revisedIndex,
      task: text,
      done: data[revisedIndex]['done'],
    }

    try{

      await AsyncStorage.setItem(
        '@todoList',
        JSON.stringify(data.slice(0, revisedData.id).concat(revisedData).concat(data.slice(revisedData.id+1,data.length))),
      );

      setUpdate(true);
      setRevisedIndex(0);
      setRevise(false);

    } catch (error) {
    }
  }


  const _deleteData = async(id)=> {
    let value = await AsyncStorage.getItem('@todoList');
    if (value !== null){
      const data = JSON.parse(value);
      data.splice(id, 1);
      data.forEach((item, index)=>{
        data[index]['id'] = index;
      })
      await AsyncStorage.setItem('@todoList', JSON.stringify(data),);
      setUpdate(true);
      onChangeText('');
      setRevise(false);
    }
  }

  const _changeDone = async(id)=> {
    let value = await AsyncStorage.getItem('@todoList');
    if (value !== null){
      const data = JSON.parse(value);
      data[id]['done'] = !data[id]['done'];
      await AsyncStorage.setItem('@todoList', JSON.stringify(data),);
      setUpdate(true);
    }
  }


  const _retrieveData = async () => {
    if(update){
      try{
        const value = await AsyncStorage.getItem('@todoList');
        if (value !== null){

          const allData = JSON.parse(value);
          const show = []

          allData.forEach((data)=>{
            if (nav === 'all'){
              show.push(data);
            } else if (nav === 'todo' && !data['done']) {
              show.push(data)
            } else if (nav === 'done' && data['done']) {
              show.push(data)
            }
          })

          setData(allData);
          setShowData(show);

          setUpdate(false);

        }
      } catch (error) {}
    }
  }

  return (
    <View style={{flex: 1}}>

      <NavBar nav={nav} setNav={setNav} setUpdate={setUpdate}/>

      <ListViewForTodolist
        showData={showData}
        setRevisedIndex={setRevisedIndex}
        setText={onChangeText}
        setRevise={setRevise}
        setUpdate={setUpdate}
        flatListRef={flatListRef}
        _deleteData={_deleteData}
        _changeDone={_changeDone}
      />

      <InputComponent
        setText={onChangeText}
        flatListRef={flatListRef}
        data={data}
        text={text}
        revise={revise}
        _updateData={_updateData}
        _insertData={_insertData}
      />

    </View>
  )
}


export default TodoListAsyncStorage;
