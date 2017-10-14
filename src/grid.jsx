

import "./css/grid.css";

import React from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

var LISTS = [
  { name: "Todo list", id: 4 },
  { name: "What is Kanban?", id: 3 },
  { name: "Questions about the event", id: 2 },
  { name: "Get started", id: 1 }
];

// a little function to help us with reordering the result
function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};


///////////////////////////////////////


class Column extends React.Component {
  constructor(props) {
    super(props);

    this.classNames = this.classNames.bind(this);
  }

  classNames(isDragging) {
    return `column ${isDragging ? 'is-dragging' : ''}`;
  }

  render() {
    const name = this.props.list.name;

    return (
      <Draggable draggableId={name} type="COLUMN">
        {(provided, snapshot) => (
          <div className="column-wrapper">
            <div 
              className={this.classNames(snapshot.isDragging)} 
              ref={provided.innerRef} 
              style={provided.draggableStyle}
              {...provided.dragHandleProps}>
              {name}
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
    }
  }

  onDragStart() {

  }

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
      let items = reorder(
        this.state.lists,
        result.source.index,
        result.destination.index
      );

      this.setState({ lists: items });
    }

  }

  render() {
    return (
      <DragDropContext onDragStart={this.onDragStart} onDragEnd={this.onDragEnd}>
        <Droppable droppableId="board" type="COLUMN" direction="horizontal">
          {(provided) => (
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

ReactDOM.render(<Board />, document.querySelector('#root'));