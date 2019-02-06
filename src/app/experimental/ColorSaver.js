import AbstractLocalSaver from 'system/localsave/AbstractLocalSaver.js';
import LocalSave from 'system/localsave/LocalSave.js';
import * as ColorHelper from 'util/ColorHelper.js';

class ColorSaver extends AbstractLocalSaver
{
  constructor(styleOpts)
  {
    super();

    this._styleOpts = styleOpts;
  }

  initialize()
  {
    const root = document.getElementById("root");
    const opts = this._styleOpts;

    function activeColor(opt, value)
    {
      const color = [];
      ColorHelper.HEXtoRGB(value, color);
      ColorHelper.invertRGB(color, false, color);
      const result = ColorHelper.RGBtoHEX(color);
      //Set style
      opts.getOptionByProp(opt.prop + "-active").setStyle(result);
    }
    function liteColor(opt, value)
    {
      //v < 0.15 ? lighten : darken
      const color = [];
      const inverted = [];
      ColorHelper.HEXtoRGB(value, color);
      ColorHelper.invertRGB(color, true, inverted);
      ColorHelper.blendRGB(0.39, color, inverted, color);
      const result = ColorHelper.RGBtoHEX(color);
      //Set style
      opts.getOptionByProp(opt.prop + "-lite").setStyle(result);
    }
    function darkColor(opt, value)
    {
      //v < 0.15 ? lighten : darken
      const color = [];
      const inverted = [];
      ColorHelper.HEXtoRGB(value, color);
      ColorHelper.invertRGB(color, true, inverted);
      ColorHelper.blendRGB(0.2, color, inverted, color);
      const result = ColorHelper.RGBtoHEX(color);
      //Set style
      opts.getOptionByProp(opt.prop + "-dark").setStyle(result);
    }
    opts.registerStyleOption(root, "--color-graph-node", "color", "graph");
    opts.registerStyleOption(root, "--color-graph-text", "color", "graph");
    opts.registerStyleOption(root, "--color-graph-select", "color", "graph");

    opts.registerStyleOption(root, "--color-accent", "color", "general");
    opts.registerStyleOption(root, "--color-primary", "color", "general", (...args) => {
      liteColor(...args);
      darkColor(...args);
    });
    opts.registerStyleOption(root, "--color-primary-text", "color", "general");
    opts.registerStyleOption(root, "--color-primary-lite", "color", "hidden");
    opts.registerStyleOption(root, "--color-primary-dark", "color", "hidden");

    opts.registerStyleOption(root, "--color-background", "color", "general", (...args) => {
      activeColor(...args);
      liteColor(...args);
    });
    opts.registerStyleOption(root, "--color-background-active", "color", "hidden");
    opts.registerStyleOption(root, "--color-background-lite", "color", "hidden");

    opts.registerStyleOption(root, "--color-success", "color", "general");
    opts.registerStyleOption(root, "--color-warning", "color", "general");

    opts.registerStyleOption(root, "--color-surface", "color", "surface", (...args) => {
      activeColor(...args);
      liteColor(...args);
      darkColor(...args);
    });
    opts.registerStyleOption(root, "--color-surface-text", "color", "surface");
    opts.registerStyleOption(root, "--color-surface-active", "color", "surface");
    opts.registerStyleOption(root, "--color-surface-lite", "color", "hidden");
    opts.registerStyleOption(root, "--color-surface-dark", "color", "hidden");

    opts.registerStyleOption(root, "--color-surface-error", "color", "surface", darkColor);
    opts.registerStyleOption(root, "--color-surface-error-dark", "color", "hidden");
    opts.registerStyleOption(root, "--color-surface-success", "color", "surface", darkColor);
    opts.registerStyleOption(root, "--color-surface-success-dark", "color", "hidden");
    opts.registerStyleOption(root, "--color-surface-warning", "color", "surface", darkColor);
    opts.registerStyleOption(root, "--color-surface-warning-dark", "color", "hidden");

    opts.initialize();
  }

  destroy()
  {
    const opts = this._styleOpts;
    opts.terminate();
  }

  //Override
  onLoadSave()
  {
    const opts = this._styleOpts;
    const data = LocalSave.loadFromStorage("prefs-color");
    for(let prop in data)
    {
      const opt = opts.getOptionByProp(prop);
      if (opt)
      {
        opt.setStyle(data[prop]);
      }
    }
  }

  //Override
  onUnloadSave()
  {
    //Don't do anything...
  }

  //Override
  onAutoSave()
  {
    const opts = this._styleOpts;
    const data = {};
    for(let opt of opts.getOptions())
    {
      if (!opt.isDefaultStyle())
      {
        data[opt.prop] = opt.getStyle();
      }
    }
    LocalSave.saveToStorage("prefs-color", data);
  }

  getStyleOpts()
  {
    return this._styleOpts;
  }
}

export default ColorSaver;