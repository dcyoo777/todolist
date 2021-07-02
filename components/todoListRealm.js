import React, {useState, useEffect, useRef} from 'react';
import {
  View,
} from "react-native";

import Realm from 'realm';

import NavBar from "./NavBar";
import ListViewForTodolist from "./ListViewForTodolist";
import InputComponent from "./InputComponent";

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


  const _deleteData = async (id)=> {
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


  const _changeDone = async (id) => {
    Realm.open({
      path: DB_PATH,
      schema: [TaskSchema],
    }).then(realm => {
      const res = realm.objects("Task");

      const reviseData = res.find(data => data.id === id)

      realm.write(() => {
        reviseData.done = !reviseData.done;
      });

      setUpdate(true);
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


export default TodoListRealm;
