import "./css/multihorizontal.css";

import React from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const DATA1 = [
  { text: "This is what I did.", id: "list1-1" },
  { text: "I smoke weed every day.", id: "list1-2" },
  { text: "Drinking and smoking are fun things to do. They just are.", id: "list1-3" },
  { text: "Let's play sports.", id: "list1-4" },
  { text: "Come on now let's all go get sloshed and have a wonderful time outside the electric fence.", id: "list1-5" },
  { text: "Music. Just music.", id: "list1-6" }
];

const DATA2 = [
  { text: "This is what I did.", id: "list2-1" },
  { text: "I smoke weed every day.", id: "list2-2" },
  { text: "Drinking and smoking are fun things to do. They just are.", id: "list2-3" },
  { text: "Let's play sports.", id: "list2-4" },
  { text: "Come on now let's all go get sloshed and have a wonderful time outside the electric fence.", id: "list2-5" },
  { text: "Music. Just music.", id: "list2-6" },
  { text: "Jump on board.", id: "list2-7" },
  { text: "I can fly high into the sky.", id: "list2-8" }
];

// a little function to help us with reordering the result
function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

function listClassNames(isDraggingOver) {
  return `list ${isDraggingOver ? 'is-dragging-over' : ''}`;
}

function cardClassNames(isDragging) {
  return `card ${isDragging ? 'is-dragging' : ''}`;
}

//////////////////////////////


class Item extends React.Component {
  render() {
    return (
      <Draggable draggableId={`${this.props.item.id}`}>
        {(provided, snapshot) => (
          <div className="card-wrapper">
            <div ref={provided.innerRef} className={cardClassNames(snapshot.isDragging)} style={provided.draggableStyle} {...provided.dragHandleProps}>
              {this.props.item.text}
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
    return (
      <Droppable droppableId={this.props.listId} direction="horizontal">
        {(provided, snapshot) => (
          <div className="wrapper">
            <div className={listClassNames(snapshot.isDraggingOver)} ref={provided.innerRef}>
              {this.props.items.map(item => ( <Item key={item.id} item={item} />))}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    );
  }
}

class App extends React.Component {

  constructor(props) {
    super(props);

    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);

    this.state = {
      map: { list1: DATA1, list2: DATA2 },
      items: DATA2
    };
  }

  onDragStart() {

  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const dstId = result.destination.droppableId;
    const srcId = result.source.droppableId;
    const draggableId = result.draggableId;

    // We've reordered items within the same list
    if (dstId === srcId) {
      const droppableId = dstId;
      
      let hash = {};
      let items = reorder(
        this.state.map[droppableId],
        result.source.index,
        result.destination.index
      );

      hash[droppableId] = items;

      this.setState({ map: Object.assign(this.state.map, hash) });
    } else {
      let hash = {};

      var item = this.state.map[result.source.droppableId][result.source.index];
      var srcItems = this.state.map[result.source.droppableId].filter(i => i.id !== item.id)
      var dstItems = this.state.map[result.destination.droppableId];

      dstItems.splice(result.destination.index, 0, item);

      hash[dstId] = dstItems;
      hash[srcId] = srcItems;

      this.setState({ map: Object.assign(this.state.map, hash) });
    }
  }

  render() {
    return (
      <DragDropContext onDragStart={this.onDragStart} onDragEnd={this.onDragEnd}>
        <div>
          <h1>The Horizontal List</h1>
          {Object.keys(this.state.map).map(key => (
            <List key={key} listId={key} items={this.state.map[key]} />
          ))}
        </div>
      </DragDropContext>
    );
  }
}


ReactDOM.render(<App />, document.querySelector('#root'));