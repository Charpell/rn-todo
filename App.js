import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';

import Header from './components/Header';
import Footer from './components/Footer';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      items: []
    }
  }

  handleAddItem = () => {
    if (!this.state.value) return

    const newItems = [
      ...this.state.items,
      {
        key: Date.now(),
        text: this.state.value,
        complete: false
      }
    ]
    
    this.setState({
      items: newItems,
      value: ""
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          value={this.state.value}
          onAddItem={this.handleAddItem}
          onChange={(value) => this.setState({ value })}
         />
        <View style={styles.content}>

        </View>
        <Footer />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    ...Platform.select({
      ios: {
        paddingTop: 30,
      }
    })
    
  },
  content: {
    flex: 1
  }
})
