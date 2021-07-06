import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useRef } from "react";
import Swipeable from "react-native-gesture-handler/Swipeable";


const ListViewForTodolist = (props) => {

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
      onSwipeableOpen={()=>{  // swip이 발생하면 해당 Swipeable을 바로 닫음
        if(row[item.id]){
          row[item.id].close();
        }
      }}
      onSwipeableRightOpen={()=>{   // 오른쪽으로 swip하는 경우 해당 데이터 삭제
        props._deleteData(item.id);
      }}
      onSwipeableLeftOpen={()=>{    // 왼쪽으로 swip하는 경우 해당 데이터 수정 모드 진입 및 해당 task를 텍스트 입력 창으로 가져옴
        props.setRevisedIndex(item.id);
        props.setText(item.task);
        props.setRevise(true);
      }}
    >

      <TouchableOpacity
        value={item.done}
        onPress={() => {
          props._changeDone(item.id, item.done);
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
    <FlatList
      ref={props.flatListRef}
      data={props.showData}
      onContentSizeChange={()=>{
        props.flatListRef.current.scrollToEnd();
      }}
      renderItem={listComponent}
      keyExtractor={item => item.id}
      ListEmptyComponent={
        <View style={{justifyContent: "center", flex: 1}}>
          <Text style={{alignItems: "center", textAlign: "center", fontSize: 40}}>Nothing!</Text>
        </View>
      }
    />
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

export default ListViewForTodolist;
