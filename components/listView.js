import React, { useState } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
} from "react-native";
import CheckBox from '@react-native-community/checkbox';
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons'


const _storeData = async () => {
  try{
    await AsyncStorage.setItem(
      '@todoList',
      JSON.stringify(data),
    );
  } catch (error) {
  }
}

const _retrieveData = async () => {
  try{
    const value = await AsyncStorage.getItem('@todoList');
    if (value !== null){
      console.log(value)
    }
  } catch (error) {}
}


const ListView = ({id, text, selected}) => {
  // const [styleList, setStyleList] = useState(selected===true ? styles.selectedList : styles.unselectedList);

  return (
    <View key={id} style={[styles.listContainer, selected===true ? styles.selectedList : styles.unselectedList]}>
      <View style={{
        justifyContent: "center",
      }}>
        <CheckBox value={selected}
                  onValueChange={async () => {
                      let value = await AsyncStorage.getItem('@todoList');
                      if (value !== null){
                        const data = JSON.parse(value);
                        data[id]['selected'] = !data[id]['selected'];
                        await AsyncStorage.setItem('@todoList', JSON.stringify(data),);

                      }
                      // selected=!selected;
                      // setStyleList(selected===true ? styles.selectedList : styles.unselectedList);
                  }}
                  style={styles.checkbox}
                  boxType='square'
                  lineWidth={2.0}/>
      </View>
      <View style={{
        backgroundColor: "red",
        width: "60%",
        justifyContent: "center",
        justifyItems: "center",
      }}>
        <Text style={styles.todoContent}>
          {text}
        </Text>
      </View>
      <View style={{
        justifyContent: "center",
      }}>
        <TouchableOpacity onPress={async ( )=> {
          let value = await AsyncStorage.getItem('@todoList');
          if (value !== null){
            const data = JSON.parse(value);
            data.splice(id, 1);
            await AsyncStorage.setItem('@todoList', JSON.stringify(data),);
          }
        }}>
          {/*<Icon name='delete'/>*/}
          <Text>삭제</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  listContainer: {
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 8,
    marginTop: 8,
    padding: 10,
    borderRadius: 5,
    borderStyle: "solid",
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 0.4,
    borderColor: "#cccccc",
    shadowOffset:{
      width: 3,
      height: 3,
    },
    shadowRadius: 2,
    shadowOpacity: 0.3,

  },
  unselectedList: {
    backgroundColor: "ivory",
  },
  selectedList: {
    backgroundColor: "gainsboro",
  },
  todoContent: {
    fontSize: 16,
    flex: 1,
    padding: 5,
  },
  checkbox: {
    color: "#dddddd",
    alignItems: "center",
    height: 20,
    width: 20,
    margin: 10,
  }
});

export default ListView;
