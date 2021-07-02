import React, {useState, useEffect, useRef} from 'react';
import {
  View,
} from "react-native";

import SQLite from 'react-native-sqlite-storage';

import NavBar from "./NavBar";
import ListViewForTodolist from "./ListViewForTodolist";
import InputComponent from "./InputComponent";

const DB_PATH = 'Test2.db';     // DB path 정의
const DB_NAME = 'todolist';     // DB 이름 정의

const db = SQLite.openDatabase({  // DB open
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


  const flatListRef = useRef();                                   // flatlist의 Ref, 스크롤 하단으로 이동하는 메소드 사용을 위해 정의


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
        "INSERT INTO " + DB_NAME + " (task) VALUES (?)",
        [text],
        (tx, results) => {

          if (results.rowsAffected > 0) {   // DB 저장 성공 시
            setUpdate(true);     // 데이터 업데이트
            onChangeText('');    // 텍스트 입력 초기화
          }

        }
      );
    });
  }


  const _updateData = async () => {
    /*
    수정중인 데이터를 DB에 업데이트
     */

    db.transaction(function (tx) {

      tx.executeSql(
        "UPDATE " + DB_NAME + " SET task = ? WHERE id = ?;",
        [text, revisedIndex],
        (tx, results) => {

          if (results.rowsAffected > 0) {   // DB 저장 성공시
            setUpdate(true);    // 데이터 업데이트
            onChangeText('');   // 텍스트 입력 초기화
            setRevise(false);   // 수정 모드 해제
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

          if (results.rowsAffected > 0) {   // DB 저장 성공시
            setUpdate(true);    // 데이터 업데이트
            onChangeText('');   // 텍스트 입력 초기화
            setRevise(false);   // 수정 모드 해제
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
        "UPDATE " + DB_NAME + " SET done = ? WHERE id = ?;",
        [done?0:1, id],
        (tx, results) => {

          if (results.rowsAffected > 0) {   // DB 저장 성공시
            setUpdate(true);    // 데이터 업데이트
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

            if (results.rows.length > 0) {  // DB에서 데이터를 1줄 이상 읽어온 경우

              const allData = []
              const show = []

              // 화면에 표실하는 done 상태에 따라 allData, show 구성
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

              setData(allData);   // 모든 데이터 저장
              setShowData(show);  // 화면에 표시하는 데이터 저장

            } else {    // DB에서 읽어온 데이터가 없는 경우

              setData([]);  // 모든 데이터에 빈 array 저장
              setShowData([]);  // 화면에 표시하는 데이터에 빈 array 저장

            }

            setUpdate(false);  // 데이터 업데이트 완료

          }
        );
      });
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

export default TodoListSQLite;
