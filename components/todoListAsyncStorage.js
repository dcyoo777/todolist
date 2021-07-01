import React, {useState, useRef} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import AsyncStorage from '@react-native-async-storage/async-storage';
import Swipeable from "react-native-gesture-handler/Swipeable";
import NavBar from "./NavBar";


const TodoListAsyncStorage = () => {
  const [text, onChangeText] = useState('');
  const [data, setData] = useState([]);
  const [showData, setShowData] = useState([]);
  const [update, setUpdate] = useState(true);
  const [nav, setNav] = useState('all');
  const [revise, setRevise] = useState(false);
  const [revisedIndex, setRevisedIndex] = useState(0);
  const flatListRef = useRef();

  const _insertData = async (newData) => {
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

  const _reviseData = async (revisedData) => {
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
            } else if (nav === 'todo' && !data['selected']) {
              show.push(data)
            } else if (nav === 'done' && data['selected']) {
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

  const DeleteButton = () => (
    <View style={[styles.deleteButton, {backgroundColor: "#FFA07A",}]}>
      <Text style={{alignItems: "center", textAlign: "center"}}>삭제</Text>
    </View>
  )

  const ReviseButton = () => (
    <View style={[styles.deleteButton, {backgroundColor: "#7AA0FF",}]}>
      <Text style={{alignItems: "center", textAlign: "center"}}>수정</Text>
    </View>
  )

  const DeleteItem = async({id})=> {
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

  let row: Array<any> = [];

  const listComponent = ({item}) => (
    <Swipeable
      key={item.id}
      ref={ref => row[item.id] = ref}
      renderRightActions={()=>(
        DeleteButton()
      )}
      renderLeftActions={()=>(
        ReviseButton()
      )}
      onSwipeableOpen={()=>{
        row[item.id].close();
      }}
      onSwipeableRightOpen={()=>{
        DeleteItem({id: item.id})
      }}
      onSwipeableLeftOpen={()=>{
        setRevisedIndex(item.id)
        onChangeText(item.text)
        setRevise(true)
      }}

    >
      <TouchableOpacity
        value={item.selected}
        onPress={async() => {
          let value = await AsyncStorage.getItem('@todoList');
          if (value !== null){
            const data = JSON.parse(value);
            data[item.id]['selected'] = !data[item.id]['selected'];
            await AsyncStorage.setItem('@todoList', JSON.stringify(data),);
            setUpdate(true);
          }
        }}
        style={[styles.listContainer, item.selected===true ? styles.selectedList : styles.unselectedList]}
      >
        <View style={{
          width: "90%",
          justifyContent: "center",
          justifyItems: "center",
        }}>
          <Text style={[styles.todoContent, {textDecorationLine: item.selected===true?'line-through':'none'}]}>
            {item.text}
          </Text>
        </View>
      </TouchableOpacity>


    </Swipeable>
  )

  _retrieveData();

  return (
    <View style={{flex: 11}}>

      <NavBar nav={nav} setNav={setNav} setUpdate={setUpdate}/>

      <FlatList
        ref={flatListRef}
        data={showData}
        onContentSizeChange={()=>{
          flatListRef.current.scrollToEnd();
        }}
        renderItem={listComponent}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={{justifyContent: "center", flex: 1}}>
            <Text style={{alignItems: "center", textAlign: "center", fontSize: 40}}>Nothing!</Text>
          </View>
        }
      />

      <View style={styles.addList}>
        <TextInput
          style={styles.addText}
          onChangeText={onChangeText}
          onFocus={()=>{
            {
              data.length===0 && flatListRef.current.scrollToEnd();
            }
          }}
          onPressIn={()=>{
            {
              data.length===0 && flatListRef.current.scrollToEnd();
            }
          }}
          value={text}
          multiline={true}
        />

        <View style={{
          justifyContent: "center",
        }}>
          <TouchableOpacity onPress={async ()=>{
            if (text.length>0){
              {
                revise?
                  _reviseData({id: revisedIndex, text: text, selected: data[revisedIndex]['selected']})
                  :
                  _insertData({id: data.length, text: text, selected: false})
              }
            }
            onChangeText('');
          }}>
            <Text style={{margin: 8, fontSize: 16}}>
              {revise?"수정":"등록"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>


    </View>
  )
}

const styles = StyleSheet.create({
  listContainer: {
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 4,
    marginTop: 4,
    padding: 10,
    paddingLeft: 30,
    borderRadius: 10,
    borderStyle: "solid",
    flexDirection: "row",
    justifyContent: "space-between",
    borderLeftWidth: 16,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomColor: "#dddddd",
    borderRightColor: "#dddddd",
  },
  addText:{
    padding: 5,
    width: "90%",
    backgroundColor: "white",
    borderColor: "#cccccc",
    borderWidth: 0.4,
    color: "black",
  },
  addList:{
    flexDirection: "row",
    backgroundColor: "#E6E6FA",
    marginTop: 8,
    marginBottom: 30,
    padding: 10,
    borderLeftWidth: 0,
  },
  unselectedList: {
    borderLeftColor: "#B0C4DE",
    backgroundColor: "white",
  },
  selectedList: {
    borderLeftColor: "darkblue",
    backgroundColor: "#bbbbbb",
  },
  todoContent: {
    fontSize: 16,
    flex: 1,
    padding: 5,
  },
  deleteButton:{
    width: 100,
    borderRadius: 10,
    margin: 4,
    marginLeft: 8,
    marginRight: 8,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomColor: "#dddddd",
    borderRightColor: "#dddddd",
    justifyContent: "center",
  }
});

export default TodoListAsyncStorage;
