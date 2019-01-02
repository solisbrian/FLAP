import React from 'react';
import ToolbarButtonStyle from './ToolbarButton.css';
import Style from './ToolbarUploadButton.css';

import IconButton from 'test/components/IconButton.js';

class ToolbarUploadButton extends React.Component
{
  constructor(props)
  {
    super(props);

    this.onFileUpload = this.onFileUpload.bind(this);
  }

  onFileUpload(e)
  {
    const files = e.target.files;
    if (files.length > 0)
    {
      if (this.props.onUpload) this.props.onUpload(files[0]);

      //Makes sure you can upload the same file again.
      e.target.value = "";
    }
  }

  //Override
  render()
  {
    const IconClass = this.props.icon;
    return (
      <IconButton id={this.props.id}
        className={ToolbarButtonStyle.toolbar_button +
          " " + Style.upload_button +
          " " + this.props.className}
        style={this.props.style}
        title={this.props.title}
        disabled={this.props.disabled}>
        <input type="file" name="import"
          className={Style.upload_input}
          accept={this.props.accept}
          onChange={this.onFileUpload}/>
        <IconClass/>
      </IconButton>
    );
  }
}

export default ToolbarUploadButton;