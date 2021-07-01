import React from 'react';
import { Text, TouchableOpacity, View } from "react-native";


function NavBar(props){
  return(
    <View style={{flexDirection: 'row', height: 40, borderBottomWidth: 1, borderBottomColor: "#aaaaaa"}}>

      <TouchableOpacity
        style={{flex: 1, backgroundColor: props.nav==='all'?'#C6C6DA':'#E6E6FA', justifyContent: "center"}}
        onPress={()=>{
          props.setNav('all');
          props.setUpdate(true);
        }}
      >
        <Text style={{textAlign: "center", alignItems: "center"}}>
          ALL
        </Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={{flex: 1, backgroundColor: props.nav==='todo'?'#C6C6DA':'#E6E6FA', justifyContent: "center"}}
        onPress={()=>{
          props.setNav('todo');
          props.setUpdate(true);
        }}
      >
        <Text style={{textAlign: "center", alignItems: "center"}}>
          TODO
        </Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={{flex: 1, backgroundColor: props.nav==='done'?'#C6C6DA':'#E6E6FA', justifyContent: "center"}}
        onPress={()=>{
          props.setNav('done');
          props.setUpdate(true);
        }}
      >
        <Text style={{textAlign: "center", alignItems: "center"}}>
          DONE
        </Text>
      </TouchableOpacity>

    </View>
  )
}

export default NavBar;
