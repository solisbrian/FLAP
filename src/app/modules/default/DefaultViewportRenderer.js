import React from 'react';

import TrashCan from 'content/viewport/TrashCan.js';
import CursorMode from 'content/viewport/CursorMode.js';

class DefaultViewportRenderer extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  //Override
  render()
  {
    //Inherits props from parent
    const parent = this.props.parent;
    const currentModule = this.props.currentModule;
    const screen = this.props.screen;

    const inputController = currentModule.getInputController();
    const graphController = currentModule.getGraphController();
    const machineController = currentModule.getMachineController();

    const LabelEditor = currentModule.getLabelEditor();

    return <span>
    { LabelEditor &&
      <LabelEditor ref={ref=>graphController.labelEditorElement=ref}
      inputController={inputController}
      graphController={graphController}
      machineController={machineController}
      screen={screen}/> }
      <span>
        <div className="anchor-bottom-left" style={{width: "100%"}}>
          <CursorMode inputController={inputController} graphController={graphController}/>
        </div>
        <div className="anchor-bottom-right">
          <TrashCan inputController={inputController} viewport={parent}/>
        </div>
      </span>
    </span>;
  }
}
export default DefaultViewportRenderer;
