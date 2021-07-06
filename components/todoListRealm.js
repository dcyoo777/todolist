import React, {useState, useEffect, useRef} from 'react';
import {
  View,
} from "react-native";

import Realm from 'realm';

import NavBar from "./NavBar";
import ListViewForTodolist from "./ListViewForTodolist";
import InputComponent from "./InputComponent";

// DB의 path 정의
const DB_PATH = "Test3.realm";
let TaskSchemaVersion = 1;

// Task 스키마 정의
const TaskSchema = {
  name: "Task",
  properties: {
    id: "int",
    task: "string",
    done: "bool",
  },
  primaryKey: "id",
};

const realm = new Realm({
  path: DB_PATH, // Realm 파일의 이름
  schema: [TaskSchema], // 사용할 Object Model
  schemaVersion: TaskSchemaVersion,
});


const TodoListRealm = () => {

  /*
  Realm을 사용한 TODO LIST
   */

  const [text, onChangeText] = useState('');            // 입력 창의 text
  const [data, setData] = useState([]);                 // 읽어온 모든 데이터를 저장
  const [showData, setShowData] = useState([]);         // 현재 네비게이션에서 보여주는 데이터를 저장
  const [update, setUpdate] = useState(true);           // 데이터베이스 업데이트 여부
  const [nav, setNav] = useState('all');                // 현재 네비게이션 정보
  const [revise, setRevise] = useState(false);          // 수정 상태인지 여부
  const [revisedIndex, setRevisedIndex] = useState(0);  // 수정 중인 데이터의 id


  const flatListRef = useRef();                                   // flatlist의 Ref, 스크롤 하단으로 이동하는 메소드 사용을 위해 정의


  const onChangeData = () => {
    setUpdate(true)
  }


  useEffect(() => {
    realm.addListener("change", onChangeData);
  }, [])


  useEffect(() => {
    _retrieveData()
  }, [update])


  const _insertData = () => {
    /*
    DB에 새로운 Task 추가
     */

    const res = realm.objects("Task");

    let nextId = 0;
    if (res.length > 0){  // 마지막으로 저장된 Task의 id에 1을 더한 값을 새로운 Task의 id로 정함
      nextId = res[res.length - 1].id + 1;
    }

    realm.write(() => {
      realm.create("Task", {
        id: nextId,
        task: text,
        done: false,
      });
    });

    onChangeText('');   // 텍스트 입력 초기화

  }



  const _updateData = () => {
    /*
    수정중인 데이터를 DB에 업데이트
     */

    const res = realm.objects("Task");

    // 전체 Task object array(res)에서 id가 revisedIndex인 object를 찾아 저장
    const reviseData = res.find(data => data.id === revisedIndex)

    realm.write(() => {
      reviseData.task = text;
    });

    onChangeText('');   // 텍스트 입력 초기화
    setRevise(false);   // 수정 모드 해제


  }


  const _deleteData = (id)=> {
    /*
    입력받은 id의 데이터를 삭제
     */

    const res = realm.objects("Task");

    // 전체 Task object array(res)에서 id가 parameter id와 같은 object를 찾아 저장
    const deleteData = res.find(data => data.id === id)

    realm.write(() => {
      realm.delete(deleteData);
    });

    onChangeText('');   // 텍스트 입력 초기화
    setRevise(false);   // 수정 모드 해제


  }


  const _changeDone = (id) => {
    /*
    입력받은 id의 데이터의 done을 변경
     */

    const res = realm.objects("Task");

    // 전체 Task object array(res)에서 id가 parameter id와 같은 object를 찾아 저장
    const reviseData = res.find(data => data.id === id)

    realm.write(() => {
      reviseData.done = !reviseData.done;
    });


  }


  const _retrieveData = () => {
    /*
    DB에서 정보를 업데이트
     */

    if(update){
      const allData = realm.objects("Task");

      // 화면에 보여주는 done의 값에 따라 데이터를 필터링하여 저장
      let show;

      console.log(nav)

      if (nav === 'all') {
        show = allData;
      } else if (nav === 'todo') {
        show = allData.filtered("done==false");
      } else if (nav === 'done') {
        show = allData.filtered("done==true");
      }

      /*
      * 하단에서 읽어온 데이터의 값을 복사하여 새로운 object에 저장한다.
      * 아래와 같은 과정을 거치지 않고 읽어온 object를 그대로 화면 구성을 위한 데이터로 사용하면
      * DB에서 Task가 삭제되는 경우, 화면을 구성하는 컴포넌트가 데이터를 잃어 오류를 일으킨다.
      * */

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

      setData(a);               // 모든 데이터 저장
      setShowData(b);           // 화면에 보이는 데이터 저장
      setUpdate(false);

      console.log(showData);
    }

  }


  return (
    <View style={{flex: 1}}>

      <NavBar setUpdate={setUpdate} nav={nav} setNav={setNav} />

      <ListViewForTodolist
        db={"Realm"}
        showData={showData}
        setRevisedIndex={setRevisedIndex}
        setText={onChangeText}
        setRevise={setRevise}
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


export default TodoListRealm;
