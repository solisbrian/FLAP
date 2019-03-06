import React from 'react';
import Style from './TestListView.css';

import { guid } from 'util/MathHelper.js';
import { downloadText } from 'util/Downloader.js';

import IconButton from 'experimental/components/IconButton.js';
import IconUploadButton from 'experimental/components/IconUploadButton.js';

import PageContentIcon from 'experimental/iconset/PageContentIcon.js';
import UploadIcon from 'experimental/iconset/UploadIcon.js';
import DownloadIcon from 'experimental/iconset/DownloadIcon.js';
import CrossIcon from 'experimental/iconset/CrossIcon.js';
import AddIcon from 'experimental/iconset/AddIcon.js';
import RunningManIcon from 'experimental/iconset/RunningManIcon.js';
import WalkingManIcon from 'experimental/iconset/WalkingManIcon.js';

import TestItem, {SUCCESS_MODE, FAILURE_MODE, WORKING_MODE, DEFAULT_MODE} from './TestItem.js';

import {solveFSA} from 'modules/fsa2/machine/FSAUtils.js';

const ACCEPT_FILE_TYPES = ['.txt'];
const TEST_FILENAME = "test.txt";
const TEST_REFRESH_TICKS = 30;

class TestListView extends React.Component
{
  constructor(props)
  {
    super(props);

    this._testList = [];
    this._testName = TEST_FILENAME;

    this.onTestNew = this.onTestNew.bind(this);
    this.onTestUpload = this.onTestUpload.bind(this);
    this.onTestDownload = this.onTestDownload.bind(this);
    this.onTestClose = this.onTestClose.bind(this);
    this.onTestAdd = this.onTestAdd.bind(this);
    this.onTestDelete = this.onTestDelete.bind(this);
    this.onTestTest = this.onTestTest.bind(this);
    this.onTestRunAll = this.onTestRunAll.bind(this);
    this.onExpressionChange = this.onExpressionChange.bind(this);
  }

  //Override
  componentDidMount()
  {
    this.props.machineController.getExpressionChangeHandler().addListener(this.onExpressionChange);
  }

  //Override
  componentWillUnmount()
  {
    this.props.machineController.getExpressionChangeHandler().removeListener(this.onExpressionChange);
  }

  onExpressionChange(expression)
  {
    for(const test of this._testList)
    {
      test.ref.resetStatus();
    }
  }

  onTestNew(e)
  {
    if (!this.isEmpty())
    {
      this.onTestClose(e);
    }

    this.onTestAdd(e);
  }

  onTestUpload(fileBlob)
  {
    const reader = new FileReader();
    reader.onload = (event) => {
      try
      {
        this._testName = fileBlob.name;
        this._testList.length = 0;

        const tests = event.target.result.split("\n");
        for(let test of tests)
        {
          test = test.trim();
          if (test.length > 0)
          {
            this._testList.push({
              id: guid(),
              defaultValue: test,
              ref: null
            });
          }
        }

        //Make sure an element exists, at least
        if (this._testList.length <= 0)
        {
          this.onTestAdd(null);
        }
      }
      catch(e)
      {
        reader.abort();
      }
    };
    reader.readAsText(fileBlob);
  }

  onTestDownload(e)
  {
    const testStrings = [];
    for(const test of this._testList)
    {
      const ref = test.ref;
      if (ref)
      {
        testStrings.push(ref.getValue());
      }
    }

    downloadText(this._testName, testStrings.join('\n'));
  }

  onTestClose(e)
  {
    const tester = this.props.tester;
    if (tester.isTesting())
    {
      tester.stopTest();
    }

    this._testList.length = 0;
  }

  onTestAdd(e)
  {
    this._testList.push({
      id: guid(),
      defaultValue: "",
      ref: null
    });
  }

  onTestRunAll(e)
  {
    const tester = this.props.tester;
    let i = 0;

    const nextTest = () => {
      const test = this._testList[i];
      this.onTestTest(null, test.ref, true, () => {
        ++i;
        if (i < this._testList.length)
        {
          nextTest();
        }
      });
    }
    nextTest();
  }

  onTestDelete(e, item)
  {
    //Already handled in render()
  }

  onTestTest(e, item, callback=null)
  {
    const itemValue = item.getValue();

    item.setState({status: WORKING_MODE});

    const machineController = this.props.machineController;
    const fsa = machineController.getEquivalentFSA();
    const result = solveFSA(fsa, itemValue);
    item.setState({status: result ? SUCCESS_MODE : FAILURE_MODE});

    if (callback) callback();
  }

  isEmpty()
  {
    return this._testList.length <= 0;
  }

  //Override
  render()
  {
    const tester = this.props.tester;

    const machineController = this.props.machineController;

    const empty = this.isEmpty();

    return (
      <div id={this.props.id}
        className={Style.test_container +
          " " + this.props.className}
        style={this.props.style}>
        <div className={Style.test_control_tray}>
          <IconButton className={Style.test_control_button}
            title={I18N.toString("action.testing.new")}
            onClick={this.onTestNew}>
            <PageContentIcon/>
          </IconButton>
          <IconUploadButton className={Style.test_control_button}
            title={I18N.toString("action.testing.import")}
            accept={ACCEPT_FILE_TYPES.join(",")}
            onUpload={this.onTestUpload}>
            <UploadIcon/>
          </IconUploadButton>
          <IconButton className={Style.test_control_button}
            title={I18N.toString("action.testing.save")}
            disabled={empty}
            onClick={this.onTestDownload}>
            <DownloadIcon/>
          </IconButton>
          <IconButton className={Style.test_control_button}
            title={I18N.toString("action.testing.clear")}
            disabled={empty}
            onClick={this.onTestClose}>
            <CrossIcon/>
          </IconButton>
        </div>
        <div className={Style.test_list_container +
          (empty ? " empty " : "")}>
          <IconButton className={Style.test_list_add}
            title={"Add"} onClick={this.onTestAdd}>
            <AddIcon/>
            <span className={Style.test_list_count}>
              {!empty ? "" + this._testList.length : ""}
            </span>
          </IconButton>
          <div className={Style.test_list_scroll_container}>
            <div className={Style.test_list}>
              {this._testList.map((e, i) => {
                const id = e.id;
                const defaultValue = e['defaultValue'] || "";
                let testCallback = this.onTestTest;
                if (machineController.getMachineExpression().length === 0)
                {
                  testCallback = null;
                }
                return <TestItem key={id} ref={ref=>e.ref=ref}
                  defaultValue={defaultValue}
                  onTest={testCallback}
                  onDelete={(e, item) => {
                    this._testList.splice(i, 1);
                    this.onTestDelete(e, item);
                  }}/>
              })}
            </div>
          </div>
          <IconButton className={Style.test_list_runall}
            title={"Run All"} onClick={this.onTestRunAll}>
            <RunningManIcon/>
          </IconButton>
        </div>
      </div>
    );
  }
}

export default TestListView;