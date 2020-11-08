import React, { Component } from 'react'
import { Popup } from './popup'
import './App.css'

export default class AppTaskList extends Component {
  state = {
    tasks: {
      task1: [
        { name: 'Learn Angular', category: 'task1', bgcolor: 'yellow' },
        { name: 'React', category: 'task1', bgcolor: 'pink' }
      ],
      task2: [
        { name: 'Vue', category: 'task2', bgcolor: 'skyblue' }
      ]
    },
    currentCategory: '',
    showPopup: false,
    currentCardData: {}
  }

  togglePopup = (category, element) => {
    this.setState({
      showPopup: !this.state.showPopup,
      currentCategory: category,
      currentCardData: element
    })
  }

  onDragStart = (ev, element) => {
    console.log('drag start', element)
    ev.dataTransfer.setData('name', element.name)
    ev.dataTransfer.setData('cat', element.category)
  }

  onDragOver = (ev) => {
    ev.preventDefault()
  }

  onDrop = (ev, destinationCat, destinationObject) => {
    const sourceName = ev.dataTransfer.getData('name')
    const soruceCat = ev.dataTransfer.getData('cat')

    if (soruceCat === destinationCat) {
      const sourceIndex = this.findArrayIndex(this.state.tasks[soruceCat], 'name', sourceName)
      const destinationIndex = this.findArrayIndex(this.state.tasks[soruceCat], 'name', destinationObject.name)
      const sourceList = this.swap([...this.state.tasks[soruceCat]], sourceIndex, destinationIndex)
      this.setState({
        ...this.state,
        tasks: {
          ...this.state.tasks,
          [soruceCat]: [...sourceList]
        }
      })
    } else {
      const addObject = this.state.tasks[soruceCat].find((task) => task.name === sourceName)
      const sourceList = this.removeByAttr([...this.state.tasks[soruceCat]], 'name', sourceName)
      const destinationList = this.addByAttr(
        soruceCat === destinationCat ? [...sourceList] : [...this.state.tasks[destinationCat]],
        'name',
        destinationObject,
        { ...addObject, category: destinationCat }
      )

      this.setState({
        ...this.state,
        tasks: {
          ...this.state.tasks,
          [soruceCat]: [...sourceList],
          [destinationCat]: [...destinationList]
        }
      })
    }
    ev.stopPropagation()
  }

  deleteCard = (catagory, data) => {
    const sourceList = this.removeByAttr([...this.state.tasks[catagory]], 'name', data.name)
    this.setState({
      ...this.state,
      tasks: {
        ...this.state.tasks,
        [catagory]: [...sourceList]
      },
      showPopup: !this.state.showPopup
    })
  }

  addCard = (category, data) => {
    const alreadyInserted = this.findArrayIndex([...this.state.tasks[category]], 'name', data.name)
    if (alreadyInserted === -1) {
      const destinationList = this.addByAttr(
        [...this.state.tasks[category]],
        'name', '',
        { ...data, category: category }
      )
      this.setState({
        ...this.state,
        tasks: {
          ...this.state.tasks,
          [category]: [...destinationList]
        },
        showPopup: !this.state.showPopup
      })
    }
  }

  updateCard = (category, data, oldName) => {
    const index = this.findArrayIndex([...this.state.tasks[category]], 'name', oldName)
    const sourceList = [...this.state.tasks[category]]
    sourceList[index] = data
    this.setState({
      ...this.state,
      tasks: {
        ...this.state.tasks,
        [category]: [...sourceList]
      },
      showPopup: !this.state.showPopup
    })
  }

  removeByAttr = (arr, attr, value) => {
    const index = this.findArrayIndex(arr, attr, value)
    if (index !== -1) arr.splice(index, 1)
    return arr
  }

  findArrayIndex = (arr, attr, value) => {
    const index = arr.findIndex(function (o) {
      return o[attr] === value
    })
    return index
  }

  swap = (arr, x, y) => {
    const swap = arr[y]
    arr[y] = arr[x]
    arr[x] = swap
    return arr
  }

  addByAttr = (arr, attr, value, addSourceValue) => {
    const index = this.findArrayIndex(arr, attr, value)
    if (index !== -1) {
      arr.splice(index, 0, addSourceValue)
    } else {
      arr.splice(arr.length, 0, addSourceValue)
    }

    return arr
  }

  addList = () => {
    let lastTask
    Object.keys(this.state.tasks).forEach((category, i) => { lastTask = category.replace(/[^0-9]/g, '') })
    this.setState({
      ...this.state,
      tasks: {
        ...this.state.tasks,
        [`task${parseInt(lastTask || 0) + 1}`]: []
      }
    })
  }

  deleteList = (category) => {
    const tasks = { ...this.state.tasks }
    delete tasks[category]
    this.setState({
      ...this.state,
      tasks
    })
  }

  render () {
    const tasks = { }
    Object.keys(this.state.tasks).forEach((category, i) => {
      tasks[category] = []
      this.state.tasks[category].forEach((card) => {
        tasks[category].push(
          <div
            key={card.name}
            onDragStart={(e) => this.onDragStart(e, card)}
            onDrop={(e) => { this.onDrop(e, category, card) }}
            draggable
            className="draggable"
            onClick={(e) => this.togglePopup(category, card)}
          >
            {card.name}
          </div>
        )
      })
    })

    const categoryList = []
    Object.keys(this.state.tasks).forEach((category, i) => {
      categoryList.push(
         <div className="list" onDragOver={(e) => this.onDragOver(e)} onDrop={(e) => { this.onDrop(e, category) }}>
             <span className="task-header">{category}</span> {tasks[category]}
             <button onClick={(e) => this.togglePopup(category, {})}>Add card</button>
             <button onClick={(e) => this.deleteList(category)}>Delete List</button>
        </div>
      )
    })

    return (
      <div className="container-drag">
         {categoryList}
         <button onClick={this.addList}>Add list</button>
         {this.state.showPopup &&
           <Popup
            data={this.state.currentCardData}
            closePopup={this.togglePopup}
            deleteCard={this.deleteCard}
            addCard={this.addCard}
            updateCard={this.updateCard}
            category={this.state.currentCategory}
          />
        }
      </div>
    )
  }
}
