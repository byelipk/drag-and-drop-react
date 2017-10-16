import "./css/grid.css";

import React from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

var LISTS = [
  {
    name: "Todo list",
    id: 4,
    items: [
      { text: "blah 1", id: 1 },
      { text: "blah 2", id: 2 },
      { text: "blah 3", id: 3 },
      { text: "blah 4", id: 4 }
    ]
  },
  {
    name: "What is Kanban?",
    id: 3,
    items: [
      { text: "blah 5", id: 5 },
      { text: "blah 6", id: 6 },
      { text: "blah 7", id: 7 }
    ]
  },
  {
    name: "Questions about the event",
    id: 2,
    items: [
      { text: "blah 8", id: 8 },
      { text: "blah 9", id: 9 },
      { text: "blah 10", id: 10 }
    ]
  },
  {
    name: "Get started",
    id: 1,
    items: [{ text: "blah 11", id: 11 }, { text: "blah 12", id: 12 }]
  }
];

// a little function to help us with reordering the result
function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

///////////////////////////////////////
class Item extends React.Component {
  render() {
    const item = this.props.item;
    const draggableId = `draggable-item-${item.id}`;

    return (
      <Draggable draggableId={draggableId} type="ITEM">
        {(provided) => (
          <div>
            <div 
              className="column-item" 
              style={provided.draggableStyle}
              ref={provided.innerRef}
              {...provided.dragHandleProps}>
              {item.text}
            </div>
            {provided.placeholder}
          </div>
        )}
      </Draggable>
    );
  }
}
class List extends React.Component {
  render() {
    const list = this.props.list;
    const droppableId = `droppable-list-${list.id}`;

    return (
      <Droppable droppableId={droppableId} type="ITEM" direction="vertical">
        {(provider) => (
          <div className="column-body" ref={provider.innerRef}>
            {this.props.list.items.map(item => (
              <Item key={item.id} item={item}/>
            ))}
            {provider.placeholder}
          </div>
        )}
      </Droppable>
    );
  }
}

class Column extends React.Component {
  constructor(props) {
    super(props);

    this.classNames = this.classNames.bind(this);

    this.state = {
      items: this.props.items
    };
  }

  classNames(isDragging) {
    return `column ${isDragging ? "is-dragging" : ""}`;
  }

  render() {
    const draggableId = `draggable-column-${this.props.list.id}`;
    const name = this.props.list.name;

    return (
      <Draggable draggableId={draggableId} type="COLUMN">
        {(provided, snapshot) => (
          <div className="column-wrapper">
            <div className={this.classNames(snapshot.isDragging)} ref={provided.innerRef} style={provided.draggableStyle}>
              <header className="column-header" {...provided.dragHandleProps}>{name}</header>
              <List list={this.props.list}/>
            </div>
            {provided.placeholder}
          </div>
        )}
      </Draggable>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);

    this.state = {
      lists: LISTS
    };
  }

  onDragStart() {}

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const srcId = result.source.droppableId;
    const dstId = result.destination.droppableId;
    const draggableId = result.draggableId;

    // We've reordered items within the same list
    if (dstId === srcId) { 
      if (result.type === "COLUMN") {
        let items = reorder(
          this.state.lists,
          result.source.index,
          result.destination.index
        );
  
        this.setState({ lists: items });
      } 
      else {
        const id = parseInt(srcId.replace('droppable-list-', ''), 10);
        const list = this.state.lists.filter(list => list.id === id);

        if (list.length === 1) {
          list[0].items = reorder(
            list[0].items,
            result.source.index,
            result.destination.index
          );

          this.setState({ lists: this.state.lists });
        }
        else {
          console.info('SHIT');
        }
      }
    }
    else {
      const srcIdInt = parseInt(srcId.replace('droppable-list-', ''), 10);
      const dstIdInt = parseInt(dstId.replace('droppable-list-', ''), 10);
      const draggableIdInt = parseInt(draggableId.replace('draggable-item-', ''), 10);

      var srcList = null;
      var srcListIndex = null;
      var dstList = null;
      var dstListIndex = null;

      // find source and destination lists
      for (let index = 0; index < this.state.lists.length; index++) {
        let list = this.state.lists[index];

        if (srcList !== null && dstList !== null) {
          break;
        }
        else if (list.id === srcIdInt) {
          srcList = list;
          srcListIndex = index;
        }
        else if (list.id === dstIdInt) {
          dstList = list;
          dstListIndex = index;
        }
      }

      // find the item were swapping from srcList list to dstList
      var theItem = null;
      for (let index = 0; index < srcList.items.length; index++) {
        let element = srcList.items[index];
        if (element.id === draggableIdInt) {
          theItem = element;
          break;
        }
      }

      srcList.items = srcList.items.filter(item => item.id !== theItem.id);

      dstList.items.splice(result.destination.index, 0, theItem);

      this.setState({ lists: this.state.lists });
    }
  }

  render() {
    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        <Droppable droppableId="board" type="COLUMN" direction="horizontal">
          {provided => (
            <div className="board" ref={provided.innerRef}>
              {this.state.lists.map(list => (
                <Column key={list.id} list={list} />
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

ReactDOM.render(<Board />, document.querySelector("#root"));
