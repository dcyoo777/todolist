import React, {useState, useEffect, useRef} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import Swipeable from "react-native-gesture-handler/Swipeable";
import Realm from 'realm';

import NavBar from "./NavBar";
import { renderAndEnforceStrictMode } from "react-native/Libraries/Utilities/ReactNativeTestTools";

const TaskSchema = {
  name: "Task",
  properties: {
    id: "int",
    task: "string",
    done: "bool",
  },
  primaryKey: "id",
};

const DB_PATH = "Test3";

// const realm = new Realm({
//   path: "Test3", // Realm 파일의 이름
//   schema: [TaskSchema], // 사용할 Object Model
// });


const TodoListRealm = () => {

  /*
  SQLite 를 사용한 TODO LIST
   */

  const [text, onChangeText] = useState('');            // 입력 창의 text
  const [data, setData] = useState([]);                 // 읽어온 모든 데이터를 저장
  const [showData, setShowData] = useState([]);         // 현재 네비게이션에서 보여주는 데이터를 저장
  const [update, setUpdate] = useState(true);           // DB에 변화가 있어 데이터를 다시 읽어오도록 하는 변수, true 일 경우 다시 읽어옴
  const [nav, setNav] = useState('all');                // 현재 네비게이션 정보
  const [revise, setRevise] = useState(false);          // 수정 상태인지 여부
  const [revisedIndex, setRevisedIndex] = useState(0);  // 수정 중인 데이터의 id

  const flatListRef = useRef();

  useEffect(() => {
    /*
    update 값이 바뀌면 데이터 업데이트 시도
     */
    _retrieveData();

  }, [update])


  const _insertData = () => {
    /*
    DB에 새로운 데이터 추가
     */
    Realm.open({
      path: DB_PATH,
      schema: [TaskSchema],
    }).then(realm => {

      const res = realm.objects("Task");

      let nextId = 0;
      if (res.length > 0){
        nextId = res[res.length - 1].id + 1;
      }

      realm.write(async() => {
        console.log(81)
        await realm.create("Task", {
          id: nextId,
          task: text,
          done: false,
        });

      });

      setUpdate(true);
      onChangeText('');

    }).catch(e => console.log(e));

  }


  const _reviseData = () => {
    /*
    수정중인 데이터를 DB에 업데이트
     */
    Realm.open({
      path: DB_PATH,
      schema: [TaskSchema],
    }).then(realm => {

      const res = realm.objects("Task");

      const reviseData = res.find(data => data.id === revisedIndex)

      realm.write(() => {
        reviseData.task = text;
      });

      setUpdate(true);
      onChangeText('');
      setRevise(false);

    }).catch(e => console.log(e));

  }


  const _deleteData = async ({id})=> {
    /*
    입력받은 id의 행을 DB에서 제거
     */
    Realm.open({
      path: DB_PATH,
      schema: [TaskSchema],
    }).then(realm => {

      const res = realm.objects("Task");

      const deleteData = res.find(data => data.id === id)

      realm.write(() => {
        realm.delete(deleteData);
      });

      setUpdate(true);
      onChangeText('');
      setRevise(false);
    }).catch(e => console.log(e));
  }


  const _retrieveData = async () => {
    /*
    update가 true인 경우 DB에서 정보를 업데이트
     */

    if(update){
      Realm.open({
        path: DB_PATH,
        schema: [TaskSchema],
      }).then(realm => {
        const allData = realm.objects("Task");
        let show = allData;
        if (nav === 'todo') {
          show = allData.filtered("done=false");
        } else if (nav === 'done') {
          show = allData.filtered("done=true");
        }

        const a = allData.map((data) => {
          return {
            id: data.id,
            task: data.task,
            done: data.done,
          }
        })

        const b = show.map((data) => {
          return {
            id: data.id,
            task: data.task,
            done: data.done,
          }
        })

        setData(a);
        setShowData(b);
        setUpdate(false);
      }).catch(e => console.log(e));

    }
  }


  let row: Array<any> = [];         // listComponent의 ref를 저장하는 Array


  const listComponent = ({item}) => (   // 하나의 task를 표시하는 view
    <Swipeable
      key={item.id}
      ref={ref => row[item.id] = ref}
      renderRightActions={()=>(
        <View style={[styles.deleteButton, {backgroundColor: "#FFA07A",}]}>
          <Text style={{alignItems: "center", textAlign: "center"}}>삭제</Text>
        </View>
      )}
      renderLeftActions={()=>(
        <View style={[styles.deleteButton, {backgroundColor: "#7AA0FF",}]}>
          <Text style={{alignItems: "center", textAlign: "center"}}>수정</Text>
        </View>
      )}
      onSwipeableOpen={()=>{
        row[item.id].close();
      }}
      onSwipeableRightOpen={()=>{
        _deleteData({id: item.id})
      }}
      onSwipeableLeftOpen={()=>{
        setRevisedIndex(item.id)
        onChangeText(item.task)
        setRevise(true)
      }}
    >

      <TouchableOpacity
        value={item.done}
        onPress={() => {

          Realm.open({
            path: DB_PATH,
            schema: [TaskSchema],
          }).then(realm => {
            const res = realm.objects("Task");

            const reviseData = res.find(data => data.id === item.id)

            realm.write(() => {
              reviseData.done = !reviseData.done;
            });

            setUpdate(true);
          }).catch(e => console.log(e));
        }}
        style={[styles.listContainer, item.done ? styles.selectedList : styles.unselectedList]}
      >

        <View style={{
          width: "90%",
          justifyContent: "center",
          justifyItems: "center",
        }}>
          <Text style={[styles.todoContent, {textDecorationLine: item.done?'line-through':'none'}]}>
            {item.task}
          </Text>
        </View>

      </TouchableOpacity>

    </Swipeable>
  )


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
            { data.length!==0 && flatListRef.current.scrollToEnd(); }
          }}
          onPressIn={()=>{
            { data.length!==0 && flatListRef.current.scrollToEnd(); }
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
                  _reviseData()
                  :
                  _insertData()
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

export default TodoListRealm;
