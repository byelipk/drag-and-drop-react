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

// class List extends React.Component {
//   render() {
//     const name = this.props.list.name;
//     const text = this.props.list.text;

//     return (
//       <Droppable droppableId={name} type="LIST" direction="vertical">
//         <div className="column-item">{text}</div>
//       </Droppable>
//     );
//   }
// }

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
    const name = this.props.list.name;

    return (
      <Draggable draggableId={name} type="COLUMN">
        {(provided, snapshot) => (
          <div className="column-wrapper">
            <div
              className={this.classNames(snapshot.isDragging)}
              ref={provided.innerRef}
              style={provided.draggableStyle}
            >
              <header className="column-header" {...provided.dragHandleProps}>{name}</header>
              <div className="column-body">
                {this.props.list.items.map(item => (
                  <div key={item.id} className="column-item">{item.text}</div>
                ))}
              </div>
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
    if (dstId === srcId && result.type === "COLUMN") {
      console.log("LOLZ", result)
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
