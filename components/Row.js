import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'

export default class Row extends Component {
  render() {
    return (
      <View style={styles.container}>|
        <Text style={styles.text}>{this.props.text}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: "flex-start",
    justifyContent: "space-between"
  },
  text: {
    fontSize: 24,
    color: "#4d4d4d",
  }
})