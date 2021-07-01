import React, { useState } from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

const TopBar = () => {
  return (
    <View style={styles.topBar}>
      <View style={{justifyContent: "center", flex: 1}}>
        <Text style={{fontSize: 30, fontWeight: "bold", textAlign: "center", alignItems: "center"}}>
          TODO-LIST
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: "#E6E6FA",
    width: "100%",
    borderBottomWidth: 2,
    borderBottomColor: "#444444",
    height: 60,
  },
});



export default TopBar;
