import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import React from "react";


const InputComponent = (props) => {

  return (
    <View style={[styles.addList, !props.revise?styles.insert:styles.revise]}>
      <TextInput
        style={styles.addText}
        onChangeText={props.setText}
        onFocus={()=>{
          {
            props.data.length!==0 && props.flatListRef.current.scrollToEnd();
          }
        }}
        onPressIn={()=>{
          {
            props.data.length!==0 && props.flatListRef.current.scrollToEnd();
          }
        }}
        value={props.text}
        multiline={true}
      />

      <View style={{
        justifyContent: "center",
      }}>
        <TouchableOpacity onPress={async ()=>{
          if (props.text.length>0){
            {
              props.revise?
                props._reviseData()
                :
                props._insertData()
            }
          }
          props.setText('');
        }}>
          <Text style={{margin: 8, fontSize: 16}}>
            {props.revise?"수정":"등록"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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
    marginTop: 8,
    marginBottom: 30,
    padding: 10,
    borderLeftWidth: 0,
  },
  insert:{
    backgroundColor: "#E6E6FA",
  },
  revise:{
    backgroundColor: "#FAE6E6",
  },

});

export default InputComponent;
