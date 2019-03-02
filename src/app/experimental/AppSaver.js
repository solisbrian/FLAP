import AbstractLocalSaver from 'system/localsave/AbstractLocalSaver.js';
import LocalSave from 'system/localsave/LocalSave.js';

class AppSaver extends AbstractLocalSaver
{
  constructor(app)
  {
    super();

    this._app = app;
  }

  //Override
  onLoadSave()
  {
    const app = this._app;
    const session = app.getSession();
    const currentModule = session.getCurrentModule();
    const currentModuleName = currentModule.getModuleName();

    const data = LocalSave.loadFromStorage("graph-" + currentModuleName);
    if (data)
    {
      const exporter = app.getExportManager().getDefaultExporter();
      exporter.importFromData(data, currentModule);
    }

    //HACK: not all modules have this
    if (currentModule.captureGraphEvent) currentModule.captureGraphEvent();
  }

  //Override
  onUnloadSave()
  {
    //Don't do anything...
  }

  //Override
  onAutoSave()
  {
    const app = this._app;
    const session = app.getSession();
    const currentModule = session.getCurrentModule();
    const currentModuleName = currentModule.getModuleName();

    const exporter = app.getExportManager().getDefaultExporter();
    const data = exporter.exportToData(currentModule);
    LocalSave.saveToStorage("graph-" + currentModuleName, data);
  }

  getApp()
  {
    return this._app;
  }
}

export default AppSaver;
