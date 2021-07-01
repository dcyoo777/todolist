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
import SQLite from 'react-native-sqlite-storage';

import NavBar from "./NavBar";

const DB_PATH = 'Test2.db';
const DB_NAME = 'todolist';

const db = SQLite.openDatabase({
  name: DB_PATH,
});

const TodoListSQLite = () => {

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
    처음에 데이터베이스가 있는지를 확인하여 없다면 새로운 테이블을 생성
     */

    db.transaction(function (tx) {
      tx.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='todolist'",
        [],
        function (tx, res) {
          if (res.rows.length == 0) {
            tx.executeSql("DROP TABLE IF EXISTS todolist", []);
            tx.executeSql(
              "CREATE TABLE IF NOT EXISTS todolist(id INTEGER PRIMARY KEY AUTOINCREMENT, task VARCHAR(100), done INTEGER DEFAULT 0);",
              []
            );
          }
        }
      );
    })

    setUpdate(true);

  }, [])


  useEffect(() => {
    /*
    update 값이 바뀌면 데이터 업데이트 시도
     */
    _retrieveData();

  }, [update])


  const _insertData = async () => {
    /*
    DB에 새로운 데이터 추가
     */
    db.transaction(function (tx) {
      tx.executeSql(
        "INSERT INTO todolist (task) VALUES (?)",
        [text],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            setUpdate(true);
          } else {

          }
          onChangeText('');
        }
      );
    });
  }


  const _reviseData = async () => {
    /*
    수정중인 데이터를 DB에 업데이트
     */
    db.transaction(function (tx) {
      tx.executeSql(
        'UPDATE todolist SET task = ? WHERE id = ?;',
        [text, revisedIndex],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            setUpdate(true);
            onChangeText('');
            setRevise(false);
          } else {

          }
        }
      );
    });
  }


  const _deleteData = async({id})=> {
    /*
    입력받은 id의 행을 DB에서 제거
     */
    db.transaction(function (tx) {
      tx.executeSql(
        "DELETE FROM " + DB_NAME + " WHERE id = ?",
        [id],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            setUpdate(true);
            onChangeText('');
            setRevise(false);
          } else {

          }
        }
      );
    });
  }


  const _retrieveData = async () => {
    /*
    update가 true인 경우 DB에서 정보를 업데이트
     */
    if(update){
      db.transaction(function (tx) {
        tx.executeSql(
          "SELECT * FROM " + DB_NAME,
          [],
          (tx, results) => {

            if (results.rows.length > 0) {

              const allData = []
              const show = []

              for (let i = 0; i < results.rows.length; ++i){
                allData.push(results.rows.item(i));
                if (nav === 'all'){
                  show.push(results.rows.item(i));
                } else if (nav === 'todo' && results.rows.item(i).done === 0) {
                  show.push(results.rows.item(i))
                } else if (nav === 'done' && results.rows.item(i).done === 1) {
                  show.push(results.rows.item(i))
                }
              }

              setData(allData);
              setShowData(show);
            } else {
              setData([]);
              setShowData([]);
            }
            setUpdate(false);
          }
        );
      });
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
          db.transaction(function (tx) {
            tx.executeSql(
              'UPDATE todolist SET done = ? WHERE id = ?;',
              [item.done===1?0:1, item.id],
              (tx, results) => {
                if (results.rowsAffected > 0) {
                  setUpdate(true);
                } else {

                }
              }
            );
          });
        }}
        style={[styles.listContainer, item.done===1 ? styles.selectedList : styles.unselectedList]}
      >

        <View style={{
          width: "90%",
          justifyContent: "center",
          justifyItems: "center",
        }}>
          <Text style={[styles.todoContent, {textDecorationLine: item.done===1?'line-through':'none'}]}>
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
              console.log(12)
              {
                revise?
                  _reviseData(revisedIndex)
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

export default TodoListSQLite;
