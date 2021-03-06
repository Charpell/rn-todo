import React from 'react';
import { StyleSheet, Text, View, Platform, ListView, Keyboard, AsyncStorage, ActivityIndicator } from 'react-native';

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
      loading: true,
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
    AsyncStorage.setItem("items", JSON.stringify(items))
  }

  componentWillMount() {
    AsyncStorage.getItem("items").then(json => {
      try {
        const items = JSON.parse(json);
        this.setSource(items, items, { loading: false });
      } catch(e) {
        this.setState({
          loading: false
        })
      }
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

  handleClearComplete = () => {
    const newItems = filterItems("ACTIVE", this.state.items)
    this.setSource(newItems, filterItems(this.state.filter, newItems));
  }

  handleToggleEditing = (key, editing) => {
    const newItems = this.state.items.map((item) => {
      if (item.key !== key) return item;
      return {
        ...item,
        editing
      }
    })
    this.setSource(newItems, filterItems(this.state.filter, newItems));
  }

  handleUpdateText = (key, text) => {
    const newItems = this.state.items.map((item) => {
      if (item.key !== key) return item;
      return {
        ...item,
        text
      }
    })
    this.setSource(newItems, filterItems(this.state.filter, newItems));
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
                  onUpdate={(text) => this.handleUpdateText(key, text)}
                  onToggleEdit={(editing) => this.handleToggleEditing(key, editing)}
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
          onClearComplete={this.handleClearComplete}
        />
        { this.state.loading && <View style={styles.loading}>
          <ActivityIndicator 
            animating
            size="large"
          />
        </View> }
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
  loading: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,.2)"
  },
  list: {
    backgroundColor: '#FFF'
  },
  separator: {
    borderWidth: 1,
    borderColor: "#F5F5F5"
}
})
