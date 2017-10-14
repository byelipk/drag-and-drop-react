import "./css/horizontal.css";

import React from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const DATA1 = [
  { text: "This is what I did.", id: 1 },
  { text: "I smoke weed every day.", id: 2 },
  { text: "Drinking and smoking are fun things to do. They just are.", id: 3 },
  { text: "Let's play sports.", id: 4 },
  { text: "Come on now let's all go get sloshed and have a wonderful time outside the electric fence.", id: 5 },
  { text: "Music. Just music.", id: 6 }
];

const DATA2 = [
  { text: "This is what I did.", id: 9 },
  { text: "I smoke weed every day.", id: 10 },
  { text: "Drinking and smoking are fun things to do. They just are.", id: 11 },
  { text: "Let's play sports.", id: 12 },
  { text: "Come on now let's all go get sloshed and have a wonderful time outside the electric fence.", id: 5 },
  { text: "Music. Just music.", id: 13 },
  { text: "Jump on board.", id: 14 },
  { text: "I can fly high into the sky.", id: 15 }
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
      <Draggable key={this.props.item.id} draggableId={this.props.item.id}>
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
      <Droppable droppableId="DROP" direction="horizontal">
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

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items
    });
  }

  render() {
    return (
      <DragDropContext onDragStart={this.onDragStart} onDragEnd={this.onDragEnd}>
        <div>
          <h1>The Horizontal List</h1>
          <List items={this.state.items} />
        </div>
      </DragDropContext>
    );
  }
}


ReactDOM.render(<App />, document.querySelector('#root'));