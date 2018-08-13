import React from 'react';
import { StyleSheet, Text, View, Platform, ListView, Keyboard } from 'react-native';

import Header from './components/Header';
import Footer from './components/Footer';
import Row from './components/Row';

const filterItems = (filter, items) => {
  return items.filter(item => {
    if (filter === 'ALL') return true;
    if (filter === "COMPLETED") return item.complete;
    if (filter === "ACTIVE") return !item.complete;
  })
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      allComplete: false,
      value: "",
      filter: "ALL",
      items: [],
      dataSource: ds.cloneWithRows([])
    }
  }

  setSource = (items, itemsDatasource, otherState = {}) => {
    this.setState({
      items,
      dataSource: this.state.dataSource.cloneWithRows(itemsDatasource),
      ...otherState
    })
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
    
    this.setSource(newItems, newItems, { value: "" })
  }

  handleToggleAllComplete = () => {
    const complete = !this.state.allComplete
    const newItems = this.state.items.map(item => ({
      ...item,
      complete
    }))
    // console.table(newItems)

    this.setSource(newItems, filterItems(this.state.filter, newItems), { allComplete: complete })
  }

  handleToggleComplete = (key, complete) => {
    const newItems = this.state.items.map(item => {
      if (item.key !== key) return item
      return {
        ...item,
        complete
      }
    })
    this.setSource(newItems, filterItems(this.state.filter, newItems))
  }

  handleRemoveItem = (key) => {
    const newItems = this.state.items.filter(item => {
      return item.key !== key
    })
    this.setSource(newItems, filterItems(this.state.filter, newItems));
  }

  handleFilter = (filter) => {
    this.setSource(this.state.items, filterItems(filter, this.state.items), { filter })
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          value={this.state.value}
          onAddItem={this.handleAddItem}
          onChange={(value) => this.setState({ value })}
          onToggleAllComplete={this.handleToggleAllComplete}
         />
        <View style={styles.content}>
          <ListView
            style={styles.list} 
            enableEmptySections
            dataSource={this.state.dataSource}
            onScroll={() => Keyboard.dismiss()}
            renderRow={({ key, ...value}) => {
              return (
                <Row 
                  key={key}
                  onRemove={() => this.handleRemoveItem(key)}
                  onComplete={(complete) => this.handleToggleComplete(key, complete)}
                  {...value}
                />
              )
            }}
            renderSeperator={(sectionId, rowId) => {
              return <View key={rowId} style={styles.separator} />
            }}
          />
        </View>
        <Footer
            onFilter={this.handleFilter}
          filter={this.state.filter}
          count={filterItems("ACTIVE", this.state.items).length}  
        />
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
  },
  list: {
    backgroundColor: '#FFF'
  },
  separator: {
    borderWidth: 1,
    borderColor: "#F5F5F5"
}
})
