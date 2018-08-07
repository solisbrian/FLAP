import React from 'react';
import './StateList.css';

import InfoBlock from '../infoblock/InfoBlock.js';
import IconButton from 'icons/IconButton.js';
import BoxAddIcon from 'icons/BoxAddIcon.js';
import TriangleIcon from 'icons/TriangleIcon.js';

import StateTag from './StateTag.js';

class StateList extends React.Component
{
  constructor(props)
  {
    super(props);

    this.onCreate = this.onCreate.bind(this);
  }

  onCreate(e)
  {
    const machine = this.props.machine;
    const graph = machine.graph;
    const x = -100 + (Math.random() * 100 * 2);
    const y = -100 + (Math.random() * 100 * 2);
    graph.newNode(x, y, machine.getNextDefaultNodeLabel());
  }

  render()
  {
    const pointer = this.props.controller.pointer;
    const graph = this.props.machine.graph;
    return <InfoBlock title="States" defaultValue="true">
      <div className="statelist-container">
        <div className="statelist">
          <TriangleIcon/>
          {
            graph.nodes.map((e, i) => {
              return <StateTag key={i} src={e} label={e.label} accept={e.accept} graph={graph}
                onFocus={(ev) => {
                  //Center workspace at focused node; inverted due to graph-to-screen space
                  pointer.offsetX = -e.x;
                  pointer.offsetY = -e.y;
                }}/>
            })
          }
        </div>
        <IconButton onClick={this.onCreate}>
          <BoxAddIcon/>
        </IconButton>
      </div>
    </InfoBlock>;
  }
}

export default StateList;
