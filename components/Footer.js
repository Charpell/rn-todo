import React, { Component } from 'react'
import { Text, View , TouchableOpacity, StyleSheet} from 'react-native'

export default class Footer extends Component {
  render() {
    const { filter } = this.props;
    return (
      <View>
        <View style={styles.container}>
          <TouchableOpacity style={ filter === 'ALL' && styles.selected } onPress={() => this.props.onFilter("ALL")}>
            <Text>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ filter === 'ACTIVE' && styles.selected } onPress={() => this.props.onFilter("ACTIVE")}>
            <Text>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ filter === 'COMPLETED' && styles.selected } onPress={() => this.props.onFilter("COMPLETED")}>
            <Text>Completed</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-around',
  },
  selected: {
    backgroundColor: "rgba(175, 47, 47, .2)"
  }
})