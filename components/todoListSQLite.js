import React, {useState, useEffect, useRef} from 'react';
import {
  View,
} from "react-native";

import SQLite from 'react-native-sqlite-storage';

import NavBar from "./NavBar";
import ListViewForTodolist from "./ListViewForTodolist";
import InputComponent from "./InputComponent";

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


  const _deleteData = async(id)=> {
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


  const _changeDone = async (id, done) => {
    /*
    수정중인 데이터를 DB에 업데이트
     */
    db.transaction(function (tx) {
      tx.executeSql(
        'UPDATE todolist SET done = ? WHERE id = ?;',
        [done?0:1, id],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            setUpdate(true);
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


  return (
    <View style={{flex: 11}}>

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
        _reviseData={_reviseData}
        _insertData={_insertData}
      />

    </View>
  )
}


export default TodoListSQLite;
