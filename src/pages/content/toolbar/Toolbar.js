import React from 'react';

import './Toolbar.css';
import NewButton from './button/NewButton.js';
import SaveButton from './button/SaveButton.js';
import UndoButton from './button/UndoButton.js';
import RedoButton from './button/RedoButton.js';

class Toolbar extends React.Component
{
  constructor(props)
  {
    super(props);

    this.machineName = React.createRef();
  }

  getMachineName()
  {
    return this.machineName.value;
  }

  getMachineType()
  {
    return "DFA";
  }

  render()
  {
    const app = this.props.app;
    const graph = this.props.graph;
    const getMachineName = this.getMachineName.bind(this);

    return <div className="toolbar-container">
      <div className="toolbar-title">
        <input id="machine-name" type="text" defaultValue="Untitled" ref={ref=>this.machineName=ref}></input>
        <label id="machine-type">DFA</label>
      </div>
      <NewButton workspace={app.workspace} getFileName={getMachineName}/>
      <SaveButton graph={graph} getFileName={getMachineName}/>
      <UndoButton />
      <RedoButton />
    </div>;
  }
}

export default Toolbar;