import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
const AddComponent = (id) => {
  const [text, onChangeText] = useState('');

  return (
    <View style={[styles.listContainer, styles.addList]}>
      <TextInput
        style={styles.addText}
        onChangeText={onChangeText}
        value={text}
        multiline={true}
     />
      <View style={{
        justifyContent: "center",
      }}>
        <TouchableOpacity>
          <Text style={{margin: 6, fontSize: 16}}>등록</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 24,
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
  addText:{
    padding: 5,
    width: "85%",
    backgroundColor: "white",
    borderColor: "#cccccc",
    borderWidth: 0.4,
  },
  addList:{
    backgroundColor: "azure",
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
    alignItems: "center",
    flex: 1,
    height: 20,
    width: 20,
    margin: 10,
  }
});

export default AddComponent;
