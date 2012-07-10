(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"helpers": function(exports, require, module) {
  (function() {

    exports.BrunchApplication = (function() {

      function BrunchApplication() {
        var _this = this;
        $(function() {
          _this.initialize(_this);
          return Backbone.history.start();
        });
      }

      BrunchApplication.prototype.initialize = function() {
        return null;
      };

      return BrunchApplication;

    })();

  }).call(this);
  
}});

window.require.define({"initialize": function(exports, require, module) {
  (function() {
    var BrunchApplication, HomeView, MainRouter, initPage,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    BrunchApplication = require('helpers').BrunchApplication;

    MainRouter = require('routers/main_router').MainRouter;

    HomeView = require('views/home_view').HomeView;

    initPage = require('views/initPage').initPage;

    exports.Application = (function(_super) {

      __extends(Application, _super);

      function Application() {
        Application.__super__.constructor.apply(this, arguments);
      }

      Application.prototype.initialize = function() {
        this.router = new MainRouter;
        this.homeView = new HomeView;
        return initPage();
      };

      return Application;

    })(BrunchApplication);

    window.app = new exports.Application;

  }).call(this);
  
}});

window.require.define({"routers/main_router": function(exports, require, module) {
  (function() {
    var __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    exports.MainRouter = (function(_super) {

      __extends(MainRouter, _super);

      function MainRouter() {
        MainRouter.__super__.constructor.apply(this, arguments);
      }

      MainRouter.prototype.routes = {
        '': 'home'
      };

      MainRouter.prototype.home = function() {};

      return MainRouter;

    })(Backbone.Router);

  }).call(this);
  
}});

window.require.define({"views/autoTest": function(exports, require, module) {
  (function() {
    var __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    exports.AutoTest = (function(_super) {

      __extends(AutoTest, _super);

      function AutoTest() {
        AutoTest.__super__.constructor.apply(this, arguments);
      }

      /* ------------------------------------------------------------------------
      # Checks whether the lines are well structured or not
      # Some suggestions of what could be checked out:
      #    <> each elt of lines corresponds to a DIV ------------------ (OK)
      #    <> each DIV has a matching elt in lines -------------------- (OK)
      #    <> type and depth are coherent ----------------------------- (OK)
      #    <> linePrev and LineNext are linked to the correct DIV ----- (OK)
      #    <> hierarchy of lines and indentation are okay ------------- (OK)
      #    <> a DIV contains a sequence of SPAN ended by a BR --------- (OK)
      #    <> two successive SPAN can't have the same class ----------- (OK)
      #    <> empty SPAN are really empty (<span></span>) ------------- (huh?)
      #    <> a note must  have at least one line
      */

      AutoTest.prototype.checkLines = function(CNEditor) {
        var child, children, currentLine, depth, element, i, id, lastClass, myAncestor, newNode, nextLine, node, nodeType, objDiv, possibleSon, prevLine, recVerif, root, rootLine, type, _ref;
        console.log('Detecting incoherences...');
        possibleSon = {
          "Th": function(name) {
            return name === "Lh" || name === "Th" || name === "To" || name === "Tu";
          },
          "Tu": function(name) {
            return name === "Lu" || name === "To" || name === "Tu";
          },
          "To": function(name) {
            return name === "Lo" || name === "To" || name === "Tu";
          },
          "Lh": function(name) {
            return false;
          },
          "Lu": function(name) {
            return false;
          },
          "Lo": function(name) {
            return false;
          },
          "root": function(name) {
            return true;
          }
        };
        nodeType = function(name) {
          if (name === "Lh" || name === "Lu" || name === "Lo") {
            return "L";
          } else if (name === "Th" || name === "Tu" || name === "To") {
            return "T";
          } else {
            return "ERR";
          }
        };
        id = function(line) {
          if (line === null) {
            return -1;
          } else {
            return parseInt(line.lineID.split("_")[1], 10);
          }
        };
        rootLine = {
          lineType: "root",
          lineID: "CNID_0",
          lineNext: CNEditor._lines["CNID_1"],
          linePrev: null,
          lineDepthAbs: 0
        };
        node = function(line, sons) {
          return {
            line: line,
            sons: sons
          };
        };
        root = new node(rootLine, []);
        myAncestor = [root];
        prevLine = null;
        currentLine = rootLine;
        nextLine = rootLine.lineNext;
        while (nextLine !== null) {
          type = nodeType(nextLine.lineType);
          depth = nextLine.lineDepthAbs;
          if (!((id(prevLine) + 2 === (_ref = id(currentLine) + 1) && _ref === id(nextLine)))) {
            return alert("ERROR: invalid line " + nextLine.lineID + "\n (" + nextLine.lineType + "-" + nextLine.lineDepthAbs + " has wrong identifier)");
          }
          element = CNEditor.editorBody$.children("#" + nextLine.lineID);
          if (element === null) {
            return alert("ERROR: invalid line " + nextLine.lineID + "\n (" + nextLine.lineType + "-" + nextLine.lineDepthAbs + " has no matching DIV)");
          }
          children = element.children();
          if (children === null || children.length < 2) {
            return alert("ERROR: invalid line " + nextLine.lineID + "\n (" + nextLine.lineType + "-" + nextLine.lineDepthAbs + " content is too short)");
          }
          lastClass = void 0;
          i = 0;
          while (i < children.length - 1) {
            child = children.get(i);
            if (child.nodeName === 'SPAN') {
              if ($(child).attr('class') != null) {
                if (lastClass === $(child).attr('class')) {
                  return alert("ERROR: invalid line " + nextLine.lineID + "\n (" + nextLine.lineType + "-" + nextLine.lineDepthAbs + " two consecutive SPAN with same class " + lastClass + ")");
                } else {
                  lastClass = $(child).attr('class');
                }
              }
            } else if (child.nodeName === 'A' || child.nodeName === 'IMG') {
              lastClass = void 0;
            } else {
              return alert("ERROR: invalid line " + nextLine.lineID + "\n (" + nextLine.lineType + "-" + nextLine.lineDepthAbs + " invalid label " + child.nodeName + ")");
            }
            i++;
          }
          child = children.get(children.length - 1);
          if (child.nodeName !== 'BR') {
            return alert("ERROR: invalid line " + nextLine.lineID + "\n (" + nextLine.lineType + "-" + nextLine.lineDepthAbs + " must end with BR)");
          }
          newNode = new node(nextLine, []);
          if (type === "T") {
            if (depth > myAncestor.length) {
              return alert("ERROR: invalid line " + nextLine.lineID + "\n (" + nextLine.lineType + "-" + nextLine.lineDepthAbs + " indentation issue)");
            } else if (depth === myAncestor.length) {
              myAncestor.push(newNode);
            } else {
              myAncestor[depth] = newNode;
            }
            if (myAncestor[depth - 1] === null) {
              return alert("ERROR: invalid line " + nextLine.lineID);
            } else {
              myAncestor[depth - 1].sons.push(newNode);
            }
          } else if (type === "L") {
            if (depth >= myAncestor.length) {
              return alert("ERROR: invalid line " + nextLine.lineID + "\n (" + nextLine.lineType + "-" + nextLine.lineDepthAbs + " indentation issue)");
            } else {
              myAncestor[depth + 1] = null;
            }
            if (myAncestor[depth] === null) {
              return alert("ERROR: invalid line " + nextLine.lineID);
            } else {
              myAncestor[depth].sons.push(newNode);
            }
          }
          prevLine = currentLine;
          currentLine = nextLine;
          nextLine = currentLine.lineNext;
        }
        objDiv = CNEditor.editorBody$.children("div");
        objDiv.each(function() {
          var myId;
          if ($(this).attr('id') != null) {
            myId = $(this).attr('id');
            if (/CNID_[0-9]+/.test(myId)) {
              if (!(CNEditor._lines[myId] != null)) {
                return alert("uh oh... missing line " + myId);
              }
            }
          }
        });
        recVerif = function(node) {
          var i, _ref2;
          if (node.sons.length > 0) {
            for (i = 0, _ref2 = node.sons.length - 1; 0 <= _ref2 ? i <= _ref2 : i >= _ref2; 0 <= _ref2 ? i++ : i--) {
              child = node.sons[i];
              if (!possibleSon[node.line.lineType](child.line.lineType)) {
                return alert("ERROR: invalid line " + child.line.lineID + "\n (hierarchic issue of a " + child.line.lineType + "-" + child.line.lineDepthAbs + ")");
              }
              if (nodeType(child.line.lineType) === "T") {
                if (node.line.lineDepthAbs + 1 !== child.line.lineDepthAbs) {
                  return alert("ERROR: invalid line " + child.line.lineID + "\n (indentation issue of a " + child.line.lineType + "-" + child.line.lineDepthAbs + ")");
                }
                recVerif(child);
              } else if (nodeType(child.line.lineType) === "L") {
                if (node.line.lineDepthAbs !== child.line.lineDepthAbs) {
                  return alert("ERROR: invalid line " + child.line.lineID + "\n (indentation issue of a " + child.line.lineType + "-" + child.line.lineDepthAbs + ")");
                }
              }
            }
          }
        };
        return recVerif(root);
      };

      return AutoTest;

    })(Backbone.View);

  }).call(this);
  
}});

window.require.define({"views/beautify": function(exports, require, module) {
  (function() {
    var any, read_settings_from_cookie, store_settings_to_cookie, the, unpacker_filter;

    any = function(a, b) {
      return a || b;
    };

    read_settings_from_cookie = function() {
      $("#tabsize").val(any($.cookie("tabsize"), "4"));
      $("#brace-style").val(any($.cookie("brace-style"), "collapse"));
      $("#detect-packers").attr("checked", $.cookie("detect-packers") !== "off");
      $("#preserve-newlines").attr("checked", $.cookie("preserve-newlines") !== "off");
      $("#keep-array-indentation").attr("checked", $.cookie("keep-array-indentation") === "on");
      $("#indent-scripts").val(any($.cookie("indent-scripts"), "normal"));
      return $("#space-before-conditional").attr("checked", $.cookie("space-before-conditional") !== "off");
    };

    store_settings_to_cookie = function() {
      var opts;
      opts = {
        expires: 360
      };
      $.cookie("tabsize", $("#tabsize").val(), opts);
      $.cookie("brace-style", $("#brace-style").val(), opts);
      $.cookie("detect-packers", ($("#detect-packers").attr("checked") ? "on" : "off"), opts);
      $.cookie("preserve-newlines", ($("#preserve-newlines").attr("checked") ? "on" : "off"), opts);
      $.cookie("keep-array-indentation", ($("#keep-array-indentation").attr("checked") ? "on" : "off"), opts);
      $.cookie("space-before-conditional", ($("#space-before-conditional").attr("checked") ? "on" : "off"), opts);
      return $.cookie("indent-scripts", $("#indent-scripts").val(), opts);
    };

    unpacker_filter = function(source) {
      var comment, found, trailing_comments, _results;
      trailing_comments = "";
      comment = "";
      found = false;
      _results = [];
      while (true) {
        found = false;
        if (/^\s*\/\*/.test(source)) {
          found = true;
          comment = source.substr(0, source.indexOf("*/") + 2);
          source = source.substr(comment.length).replace(/^\s+/, "");
          trailing_comments += comment + "\n";
        } else if (/^\s*\/\//.test(source)) {
          found = true;
          comment = source.match(/^\s*\/\/.*/)[0];
          source = source.substr(comment.length).replace(/^\s+/, "");
          trailing_comments += comment + "\n";
        }
        if (!found) {
          break;
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    exports.beautify = function(ed$) {
      var brace_style, comment_mark, indent_char, indent_scripts, indent_size, keep_array_indentation, opts, preserve_newlines, source, space_before_conditional;
      if (the.beautify_in_progress) return;
      the.beautify_in_progress = true;
      source = ed$.html();
      indent_size = $("#tabsize").val();
      indent_char = (indent_size === 1 ? "\t" : " ");
      preserve_newlines = $("#preserve-newlines").attr("checked");
      keep_array_indentation = $("#keep-array-indentation").attr("checked");
      indent_scripts = $("#indent-scripts").val();
      brace_style = $("#brace-style").val();
      space_before_conditional = $("#space-before-conditional").attr("checked");
      if ($("#detect-packers").attr("checked")) source = unpacker_filter(source);
      comment_mark = "<-" + "-";
      opts = {
        indent_size: 4,
        indent_char: " ",
        preserve_newlines: true,
        brace_style: "collapse",
        keep_array_indentation: false,
        space_after_anon_function: true,
        space_before_conditional: true,
        indent_scripts: "normal"
      };
      if (source && source[0] === "<" && source.substring(0, 4) !== comment_mark) {
        $("#resultText").val(style_html(source, opts));
      } else {
        $("#resultText").val(js_beautify(unpacker_filter(source), opts));
      }
      return the.beautify_in_progress = false;
    };

    the = {
      beautify_in_progress: false
    };

  }).call(this);
  
}});

window.require.define({"views/cozyToMarkdown": function(exports, require, module) {
  (function() {
    var __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    exports.CNcozyToMarkdown = (function(_super) {

      __extends(CNcozyToMarkdown, _super);

      function CNcozyToMarkdown() {
        CNcozyToMarkdown.__super__.constructor.apply(this, arguments);
      }

      CNcozyToMarkdown.prototype.translate = function(text) {
        var children, classType, converter, htmlCode, i, index, j, l, lineCode, lineElt, markCode, markup, space, _ref;
        htmlCode = $(document.createElement('div')).html(text);
        markCode = '';
        converter = {
          '#text': function(obj) {
            return obj.text();
          },
          'A': function(obj) {
            var href, title;
            title = obj.attr('title') != null ? obj.attr('title') : "";
            href = obj.attr('href') != null ? obj.attr('href') : "";
            return '[' + obj.html() + '](' + href + ' "' + title + '")';
          },
          'IMG': function(obj) {
            var alt, src, title;
            title = obj.attr('title') != null ? obj.attr('title') : "";
            alt = obj.attr('alt') != null ? obj.attr('alt') : "";
            src = obj.attr('src') != null ? obj.attr('src') : "";
            return '![' + alt + '](' + src + ' "' + title + '")';
          },
          'SPAN': function(obj) {
            return obj.text();
          }
        };
        index = [];
        markup = {
          'Th': function(blanks, depth) {
            if (depth < index.length) index[depth] = 0;
            return "\n" + blanks + "* # ";
          },
          'Lh': function(blanks, depth) {
            return "\n" + blanks + "    ";
          },
          'Tu': function(blanks, depth) {
            if (depth < index.length) index[depth] = 0;
            return "\n" + blanks + "+   ";
          },
          'Lu': function(blanks, depth) {
            return "\n" + blanks + "    ";
          },
          'To': function(blanks, depth) {
            var i, _ref;
            if (depth >= index.length) {
              for (i = 0, _ref = depth - index.length; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
                index.push(0);
              }
            }
            index[depth]++;
            return "\n" + blanks + ("" + index[depth] + ".   ");
          },
          'Lo': function(blanks, depth) {
            return "\n" + blanks + "    ";
          }
        };
        classType = function(className) {
          var blanks, depth, i, tab, type;
          tab = className.split("-");
          type = tab[0];
          depth = parseInt(tab[1], 10);
          blanks = '';
          i = 1;
          while (i < depth) {
            blanks += '    ';
            i++;
          }
          return markup[type](blanks, depth);
        };
        children = htmlCode.children();
        for (i = 0, _ref = children.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
          lineCode = $(children.get(i));
          if (lineCode.attr('class') != null) {
            markCode += classType(lineCode.attr('class'));
          }
          l = lineCode.children().length;
          j = 0;
          space = ' ';
          while (j < l) {
            lineElt = lineCode.children().get(j);
            if (j + 2 === l) space = '';
            if (lineElt.nodeType === 1 && (converter[lineElt.nodeName] != null)) {
              markCode += converter[lineElt.nodeName]($(lineElt)) + space;
            } else {
              markCode += $(lineElt).text() + space;
            }
            j++;
          }
          markCode += "\n";
        }
        return markCode;
      };

      return CNcozyToMarkdown;

    })(Backbone.View);

  }).call(this);
  
}});

window.require.define({"views/editor": function(exports, require, module) {
  
  /* ------------------------------------------------------------------------
  # CLASS FOR THE COZY NOTE EDITOR
  #
  # usage : 
  #
  # newEditor = new CNEditor( iframeTarget,callBack )
  #   iframeTarget = iframe where the editor will be nested
  #   callBack     = launched when editor ready, the context 
  #                  is set to the editorCtrl (callBack.call(this))
  # properties & methods :
  #   replaceContent    : (htmlContent) ->  # TODO : replace with markdown
  #   _keyPressListener : (e) =>
  #   _insertLineAfter  : (param) ->
  #   _insertLineBefore : (param) ->
  #   
  #   editorIframe      : the iframe element where is nested the editor
  #   editorBody$       : the jquery pointer on the body of the iframe
  #   _lines            : {} an objet, each property refers a line
  #   _highestId        : 
  #   _firstLine        : pointes the first line : TODO : not taken into account
  */

  (function() {
    var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    exports.CNEditor = (function(_super) {

      __extends(CNEditor, _super);

      /*
          #   Constructor : newEditor = new CNEditor( iframeTarget,callBack )
          #       iframeTarget = iframe where the editor will be nested
          #       callBack     = launched when editor ready, the context 
          #                      is set to the editorCtrl (callBack.call(this))
      */

      function CNEditor(iframeTarget, callBack) {
        this._keyPressListener = __bind(this._keyPressListener, this);
        var iframe$,
          _this = this;
        iframe$ = $(iframeTarget);
        iframe$.on('load', function() {
          var editorBody$, editor_css$, editor_head$, editor_html$;
          editor_html$ = iframe$.contents().find("html");
          editorBody$ = editor_html$.find("body");
          editorBody$.parent().attr('id', '__ed-iframe-html');
          editorBody$.attr("contenteditable", "true");
          editorBody$.attr("id", "__ed-iframe-body");
          editor_head$ = editor_html$.find("head");
          editor_css$ = editor_head$.html('<link href="stylesheets/app.css" \
                                                 rel="stylesheet">');
          _this.editorBody$ = editorBody$;
          _this.editorIframe = iframe$[0];
          _this._lines = {};
          _this._highestId = 0;
          _this._firstLine = null;
          editorBody$.prop('__editorCtl', _this);
          editorBody$.on('keypress', _this._keyPressListener);
          callBack.call(_this);
          return _this;
        });
      }

      /* ------------------------------------------------------------------------
      # TODO : initialise the editor content from a markdown string
      */

      CNEditor.prototype.replaceContent = function(htmlContent) {
        this.editorBody$.html(htmlContent);
        return this._readHtml();
      };

      /*
          # Change the path of the css applied to the editor iframe
      */

      CNEditor.prototype.replaceCSS = function(path) {
        return $(this.editorIframe).contents().find("link[rel=stylesheet]").attr({
          href: path
        });
      };

      /* ------------------------------------------------------------------------
      #    The listner of keyPress event on the editor's iframe... the king !
      */

      /*
          # SHORTCUT
          #
          # Definition of a shortcut : 
          #   a combination alt,ctrl,shift,meta
          #   + one caracter(.which) 
          #   or 
          #     arrow (.keyCode=dghb:) or 
          #     return(keyCode:13) or 
          #     bckspace (which:8) or 
          #     tab(keyCode:9)
          #   ex : shortcut = 'CtrlShift-up', 'Ctrl-115' (ctrl+s), '-115' (s),
          #                   'Ctrl-'
      */

      CNEditor.prototype._keyPressListener = function(e) {
        var div, keyStrokesCode, metaKeyStrokesCode, range4sel, sel, shortcut;
        metaKeyStrokesCode = (e.altKey ? "Alt" : "") + 
                                (e.ctrlKey ? "Ctrl" : "") + 
                                (e.shiftKey ? "Shift" : "");
        switch (e.keyCode) {
          case 13:
            keyStrokesCode = "return";
            break;
          case 35:
            keyStrokesCode = "end";
            break;
          case 36:
            keyStrokesCode = "home";
            break;
          case 33:
            keyStrokesCode = "pgUp";
            break;
          case 34:
            keyStrokesCode = "pgDwn";
            break;
          case 37:
            keyStrokesCode = "left";
            break;
          case 38:
            keyStrokesCode = "up";
            break;
          case 39:
            keyStrokesCode = "right";
            break;
          case 40:
            keyStrokesCode = "down";
            break;
          case 9:
            keyStrokesCode = "tab";
            break;
          case 8:
            keyStrokesCode = "backspace";
            break;
          case 32:
            keyStrokesCode = "space";
            break;
          case 27:
            keyStrokesCode = "esc";
            break;
          case 46:
            keyStrokesCode = "suppr";
            break;
          default:
            switch (e.which) {
              case 32:
                keyStrokesCode = "space";
                break;
              case 8:
                keyStrokesCode = "backspace";
                break;
              default:
                keyStrokesCode = e.which;
            }
        }
        shortcut = metaKeyStrokesCode + '-' + keyStrokesCode;
        if ((keyStrokesCode === "left" || keyStrokesCode === "up" || keyStrokesCode === "right" || keyStrokesCode === "down" || keyStrokesCode === "pgUp" || keyStrokesCode === "pgDwn" || keyStrokesCode === "end" || keyStrokesCode === "home") && (shortcut !== 'CtrlShift-down' && shortcut !== 'CtrlShift-up')) {
          this.newPosition = true;
          $("#editorPropertiesDisplay").text("newPosition = true");
        } else {
          if (this.newPosition) {
            this.newPosition = false;
            $("#editorPropertiesDisplay").text("newPosition = false");
            sel = rangy.getIframeSelection(this.editorIframe);
            div = sel.getRangeAt(0).startContainer;
            if (div.nodeName !== "DIV") div = $(div).parents("div")[0];
            if (div.innerHTML === "<span></span><br>") {
              range4sel = rangy.createRange();
              range4sel.collapseToPoint(div.firstChild, 0);
              sel.setSingleRange(range4sel);
            }
          }
        }
        this.currentSel = null;
        switch (shortcut) {
          case "-return":
            this._return();
            return e.preventDefault();
          case "-tab":
            this.tab();
            return e.preventDefault();
          case "-backspace":
            return this._backspace(e);
          case "-suppr":
            return this._suppr(e);
          case "Shift-tab":
            this.shiftTab();
            return e.preventDefault();
          case "Alt-97":
            this._toggleLineType();
            return e.preventDefault();
          case "Ctrl-118":
            return e.preventDefault();
          case "Ctrl-115":
            return e.preventDefault();
        }
      };

      /* ------------------------------------------------------------------------
      #  Manage deletions when ŝuppr key is pressed
      */

      CNEditor.prototype._suppr = function(e) {
        var sel, startLine;
        this._findLinesAndIsStartIsEnd();
        sel = this.currentSel;
        startLine = sel.startLine;
        if (sel.range.collapsed) {
          if (sel.rangeIsEndLine) {
            if (startLine.lineNext !== null) {
              sel.range.setEndBefore(startLine.lineNext.line$[0].firstChild);
              sel.endLine = startLine.lineNext;
              this._deleteMultiLinesSelections();
              return e.preventDefault();
            } else {
              return e.preventDefault();
            }
          }
        } else if (sel.endLine === startLine) {
          sel.range.deleteContents();
          return e.preventDefault();
        } else {
          this._deleteMultiLinesSelections();
          return e.preventDefault();
        }
      };

      /* ------------------------------------------------------------------------
      #  Manage deletions when backspace key is pressed
      */

      CNEditor.prototype._backspace = function(e) {
        var sel, startLine;
        this._findLinesAndIsStartIsEnd();
        sel = this.currentSel;
        startLine = sel.startLine;
        if (sel.range.collapsed) {
          if (sel.rangeIsStartLine) {
            if (startLine.linePrev !== null) {
              sel.range.setStartBefore(startLine.linePrev.line$[0].lastChild);
              sel.startLine = startLine.linePrev;
              this._deleteMultiLinesSelections();
              return e.preventDefault();
            } else {
              return e.preventDefault();
            }
          }
        } else if (sel.endLine === startLine) {
          sel.range.deleteContents();
          return e.preventDefault();
        } else {
          this._deleteMultiLinesSelections();
          return e.preventDefault();
        }
      };

      /* ------------------------------------------------------------------------
      #  Turn selected lines in a title List (Th)
      */

      CNEditor.prototype.titleList = function() {
        var endContainer, endDiv, endDivID, endLineID, initialEndOffset, initialStartOffset, line, range, sel, startContainer, startDiv, _results;
        sel = rangy.getIframeSelection(this.editorIframe);
        range = sel.getRangeAt(0);
        startContainer = range.startContainer;
        endContainer = range.endContainer;
        initialStartOffset = range.startOffset;
        initialEndOffset = range.endOffset;
        startDiv = startContainer;
        if (startDiv.nodeName !== "DIV") startDiv = $(startDiv).parents("div")[0];
        endDiv = endContainer;
        if (endDiv.nodeName !== "DIV") endDiv = $(endDiv).parents("div")[0];
        endLineID = endDiv.id;
        line = this._lines[startDiv.id];
        endDivID = endDiv.id;
        _results = [];
        while (true) {
          this._line2titleList(line);
          if (line.lineID === endDivID) {
            break;
          } else {
            _results.push(line = line.lineNext);
          }
        }
        return _results;
      };

      /* ------------------------------------------------------------------------
      #  Turn a given line in a title List Line (Th)
      */

      CNEditor.prototype._line2titleList = function(line) {
        var parent1stSibling, _results;
        if (line.lineType !== 'Th') {
          if (line.lineType[0] === 'L') {
            line.lineType = 'Tu';
            line.lineDepthAbs += 1;
          }
          this._titilizeSiblings(line);
          parent1stSibling = this._findParent1stSibling(line);
          _results = [];
          while (parent1stSibling !== null && parent1stSibling.lineType !== 'Th') {
            this._titilizeSiblings(parent1stSibling);
            _results.push(parent1stSibling = this._findParent1stSibling(parent1stSibling));
          }
          return _results;
        }
      };

      /* ------------------------------------------------------------------------
      #  Turn selected lines in a Marker List
      */

      CNEditor.prototype.markerList = function(l) {
        var endContainer, endDiv, endLineID, initialEndOffset, initialStartOffset, line, lineTypeTarget, range, startDiv, startDivID, _results;
        if (l != null) {
          startDivID = l.lineID;
          endLineID = startDivID;
        } else {
          range = rangy.getIframeSelection(this.editorIframe).getRangeAt(0);
          endContainer = initialStartOffset = range.startOffset;
          initialEndOffset = range.endOffset;
          startDiv = range.startContainer;
          if (startDiv.nodeName !== "DIV") startDiv = $(startDiv).parents("div")[0];
          startDivID = startDiv.id;
          endDiv = range.endContainer;
          if (endDiv.nodeName !== "DIV") endDiv = $(endDiv).parents("div")[0];
          endLineID = endDiv.id;
        }
        line = this._lines[startDivID];
        _results = [];
        while (true) {
          switch (line.lineType) {
            case 'Th':
              lineTypeTarget = 'Tu';
              l = line.lineNext;
              while (l !== null && l.lineDepthAbs >= line.lineDepthAbs) {
                switch (l.lineType) {
                  case 'Th':
                    l.line$.prop("class", "Tu-" + l.lineDepthAbs);
                    l.lineType = 'Tu';
                    l.lineDepthRel = this._findDepthRel(l);
                    break;
                  case 'Lh':
                    l.line$.prop("class", "Lu-" + l.lineDepthAbs);
                    l.lineType = 'Lu';
                    l.lineDepthRel = this._findDepthRel(l);
                }
                l = l.lineNext;
              }
              l = line.linePrev;
              while (l !== null && l.lineDepthAbs >= line.lineDepthAbs) {
                switch (l.lineType) {
                  case 'Th':
                    l.line$.prop("class", "Tu-" + l.lineDepthAbs);
                    l.lineType = 'Tu';
                    l.lineDepthRel = this._findDepthRel(l);
                    break;
                  case 'Lh':
                    l.line$.prop("class", "Lu-" + l.lineDepthAbs);
                    l.lineType = 'Lu';
                    l.lineDepthRel = this._findDepthRel(l);
                }
                l = l.linePrev;
              }
              break;
            case 'Lh':
            case 'Lu':
              this.tab(line);
              break;
            default:
              lineTypeTarget = false;
          }
          if (lineTypeTarget) {
            line.line$.prop("class", "" + lineTypeTarget + "-" + line.lineDepthAbs);
            line.lineType = lineTypeTarget;
          }
          if (line.lineID === endLineID) {
            break;
          } else {
            _results.push(line = line.lineNext);
          }
        }
        return _results;
      };

      /* ------------------------------------------------------------------------
      # Calculates the relative depth of the line
      #   usage   : cycle : Tu => To => Lx => Th
      #   param   : line : the line we want to find the relative depth
      #   returns : a number
      #
      */

      CNEditor.prototype._findDepthRel = function(line) {
        var linePrev;
        if (line.lineDepthAbs === 1) {
          if (line.lineType[1] === "h") {
            return 0;
          } else {
            return 1;
          }
        } else {
          linePrev = line.linePrev;
          while (linePrev.lineDepthAbs >= line.lineDepthAbs) {
            linePrev = linePrev.linePrev;
          }
          return linePrev.lineDepthRel + 1;
        }
      };

      /* ------------------------------------------------------------------------
      # Toggle line type
      #   usage : cycle : Tu => To => Lx => Th
      #   param :
      #       e = event
      */

      CNEditor.prototype._toggleLineType = function() {
        var endContainer, endDiv, endLineID, initialEndOffset, initialStartOffset, l, line, lineTypeTarget, range, sel, startContainer, startDiv, _results;
        sel = rangy.getIframeSelection(this.editorIframe);
        range = sel.getRangeAt(0);
        startContainer = range.startContainer;
        endContainer = range.endContainer;
        initialStartOffset = range.startOffset;
        initialEndOffset = range.endOffset;
        startDiv = startContainer;
        if (startDiv.nodeName !== "DIV") startDiv = $(startDiv).parents("div")[0];
        endDiv = endContainer;
        if (endDiv.nodeName !== "DIV") endDiv = $(endDiv).parents("div")[0];
        endLineID = endDiv.id;
        line = this._lines[startDiv.id];
        _results = [];
        while (true) {
          switch (line.lineType) {
            case 'Tu':
              lineTypeTarget = 'Th';
              l = line.lineNext;
              while (l !== null && l.lineDepthAbs >= line.lineDepthAbs) {
                if (l.lineDepthAbs === line.lineDepthAbs) {
                  if (l.lineType === 'Tu') {
                    l.line$.prop("class", "Th-" + line.lineDepthAbs);
                    l.lineType = 'Th';
                  } else {
                    l.line$.prop("class", "Lh-" + line.lineDepthAbs);
                    l.lineType = 'Lh';
                  }
                }
                l = l.lineNext;
              }
              l = line.linePrev;
              while (l !== null && l.lineDepthAbs >= line.lineDepthAbs) {
                if (l.lineDepthAbs === line.lineDepthAbs) {
                  if (l.lineType === 'Tu') {
                    l.line$.prop("class", "Th-" + line.lineDepthAbs);
                    l.lineType = 'Th';
                  } else {
                    l.line$.prop("class", "Lh-" + line.lineDepthAbs);
                    l.lineType = 'Lh';
                  }
                }
                l = l.linePrev;
              }
              break;
            case 'Th':
              lineTypeTarget = 'Tu';
              l = line.lineNext;
              while (l !== null && l.lineDepthAbs >= line.lineDepthAbs) {
                if (l.lineDepthAbs === line.lineDepthAbs) {
                  if (l.lineType === 'Th') {
                    l.line$.prop("class", "Tu-" + line.lineDepthAbs);
                    l.lineType = 'Tu';
                  } else {
                    l.line$.prop("class", "Lu-" + line.lineDepthAbs);
                    l.lineType = 'Lu';
                  }
                }
                l = l.lineNext;
              }
              l = line.linePrev;
              while (l !== null && l.lineDepthAbs >= line.lineDepthAbs) {
                if (l.lineDepthAbs === line.lineDepthAbs) {
                  if (l.lineType === 'Th') {
                    l.line$.prop("class", "Tu-" + line.lineDepthAbs);
                    l.lineType = 'Tu';
                  } else {
                    l.line$.prop("class", "Lu-" + line.lineDepthAbs);
                    l.lineType = 'Lu';
                  }
                }
                l = l.linePrev;
              }
              break;
            default:
              lineTypeTarget = false;
          }
          if (lineTypeTarget) {
            line.line$.prop("class", "" + lineTypeTarget + "-" + line.lineDepthAbs);
            line.lineType = lineTypeTarget;
          }
          if (line.lineID === endDiv.id) {
            break;
          } else {
            _results.push(line = line.lineNext);
          }
        }
        return _results;
      };

      /* ------------------------------------------------------------------------
      # tab keypress
      #   l = optional : a line to indent. If none, the selection will be indented
      */

      CNEditor.prototype.tab = function(l) {
        var endDiv, endLineID, isTabAllowed, line, lineNext, linePrev, linePrevSibling, lineTypeTarget, nextLineType, range, sel, startDiv, _results;
        if (l != null) {
          startDiv = l.line$[0];
          endDiv = startDiv;
        } else {
          sel = rangy.getIframeSelection(this.editorIframe);
          range = sel.getRangeAt(0);
          startDiv = range.startContainer;
          endDiv = range.endContainer;
        }
        if (startDiv.nodeName !== "DIV") startDiv = $(startDiv).parents("div")[0];
        if (endDiv.nodeName !== "DIV") endDiv = $(endDiv).parents("div")[0];
        endLineID = endDiv.id;
        line = this._lines[startDiv.id];
        _results = [];
        while (true) {
          switch (line.lineType) {
            case 'Tu':
            case 'Th':
              linePrevSibling = this._findPrevSibling(line);
              if (linePrevSibling === null) {
                isTabAllowed = false;
              } else {
                isTabAllowed = true;
                if (linePrevSibling.lineType === 'Th') {
                  lineTypeTarget = 'Lh';
                } else {
                  if (linePrevSibling.lineType === 'Tu') {
                    lineTypeTarget = 'Lu';
                  } else {
                    lineTypeTarget = 'Lo';
                  }
                  if (line.lineType === 'Th') {
                    lineNext = line.lineNext;
                    while (lineNext !== null && lineNext.lineDepthAbs > line.lineDepthAbs) {
                      switch (lineNext.lineType) {
                        case 'Th':
                          lineNext.lineType = 'Tu';
                          line.line$.prop("class", "Tu-" + lineNext.lineDepthAbs);
                          nextLineType = prevTxType;
                          break;
                        case 'Tu':
                          nextLineType = 'Lu';
                          break;
                        case 'To':
                          nextLineType = 'Lo';
                          break;
                        case 'Lh':
                          lineNext.lineType = nextLineType;
                          line.line$.prop("class", "" + nextLineType + "-" + lineNext.lineDepthAbs);
                      }
                    }
                  }
                }
              }
              break;
            case 'Lh':
            case 'Lu':
            case 'Lo':
              lineNext = line.lineNext;
              lineTypeTarget = null;
              while (lineNext !== null && lineNext.lineDepthAbs >= line.lineDepthAbs) {
                if (lineNext.lineDepthAbs === line.lineDepthAbs + 1) {
                  lineTypeTarget = lineNext.lineType;
                  lineNext = null;
                } else {
                  lineNext = lineNext.lineNext;
                }
              }
              if (lineTypeTarget === null) {
                linePrev = line.linePrev;
                while (linePrev !== null && linePrev.lineDepthAbs >= line.lineDepthAbs) {
                  if (linePrev.lineDepthAbs === line.lineDepthAbs + 1) {
                    lineTypeTarget = linePrev.lineType;
                    linePrev = null;
                  } else {
                    linePrev = linePrev.linePrev;
                  }
                }
              }
              if (lineTypeTarget === null) {
                isTabAllowed = true;
                lineTypeTarget = 'Tu';
                line.lineDepthAbs += 1;
                line.lineDepthRel += 1;
              } else {
                if (lineTypeTarget === 'Th') {
                  isTabAllowed = true;
                  line.lineDepthAbs += 1;
                  line.lineDepthRel = 0;
                }
                if (lineTypeTarget === 'Tu' || lineTypeTarget === 'To') {
                  isTabAllowed = true;
                  line.lineDepthAbs += 1;
                  line.lineDepthRel += 1;
                }
              }
          }
          if (isTabAllowed) {
            line.line$.prop("class", "" + lineTypeTarget + "-" + line.lineDepthAbs);
            line.lineType = lineTypeTarget;
          }
          if (line.lineID === endLineID) {
            break;
          } else {
            _results.push(line = line.lineNext);
          }
        }
        return _results;
      };

      /* ------------------------------------------------------------------------
      # shift + tab keypress
      #   e = event
      */

      CNEditor.prototype.shiftTab = function() {
        var endDiv, endLineID, initialEndOffset, initialStartOffset, isTabAllowed, line, lineTypeTarget, nextL, parent, range, sel, startDiv, _results;
        sel = rangy.getIframeSelection(this.editorIframe);
        range = sel.getRangeAt(0);
        startDiv = range.startContainer;
        endDiv = range.endContainer;
        initialStartOffset = range.startOffset;
        initialEndOffset = range.endOffset;
        if (startDiv.nodeName !== "DIV") startDiv = $(startDiv).parents("div")[0];
        if (endDiv.nodeName !== "DIV") endDiv = $(endDiv).parents("div")[0];
        endLineID = endDiv.id;
        line = this._lines[startDiv.id];
        _results = [];
        while (true) {
          switch (line.lineType) {
            case 'Tu':
            case 'Th':
              parent = line.linePrev;
              while (parent !== null && parent.lineDepthAbs >= line.lineDepthAbs) {
                parent = parent.linePrev;
              }
              if (parent !== null) {
                isTabAllowed = true;
                lineTypeTarget = parent.lineType;
                lineTypeTarget = "L" + lineTypeTarget.charAt(1);
                line.lineDepthAbs -= 1;
                line.lineDepthRel -= parent.lineDepthRel;
                if (line.lineNext.lineType[0] === 'L') {
                  nextL = line.lineNext;
                  nextL.lineType = 'T' + nextL.lineType[1];
                  nextL.line$.prop('class', "" + nextL.lineType + "-" + nextL.lineDepthAbs);
                }
              } else {
                isTabAllowed = false;
              }
              break;
            case 'Lh':
              isTabAllowed = true;
              lineTypeTarget = 'Th';
              break;
            case 'Lu':
              isTabAllowed = true;
              lineTypeTarget = 'Tu';
              break;
            case 'Lo':
              isTabAllowed = true;
              lineTypeTarget = 'To';
          }
          if (isTabAllowed) {
            line.line$.prop("class", "" + lineTypeTarget + "-" + line.lineDepthAbs);
            line.lineType = lineTypeTarget;
          }
          if (line.lineID === endDiv.id) {
            break;
          } else {
            _results.push(line = line.lineNext);
          }
        }
        return _results;
      };

      /* ------------------------------------------------------------------------
      # return keypress
      #   e = event
      */

      CNEditor.prototype._return = function() {
        var currSel, endLine, endOfLineFragment, newLine, range4sel, startLine;
        this._findLinesAndIsStartIsEnd();
        currSel = this.currentSel;
        startLine = currSel.startLine;
        endLine = currSel.endLine;
        if (currSel.range.collapsed) {} else if (endLine === startLine) {
          currSel.range.deleteContents();
        } else {
          this._deleteMultiLinesSelections();
          this._findLinesAndIsStartIsEnd();
          currSel = this.currentSel;
          startLine = currSel.startLine;
        }
        if (currSel.rangeIsEndLine) {
          newLine = this._insertLineAfter({
            sourceLineID: startLine.lineID,
            targetLineType: startLine.lineType,
            targetLineDepthAbs: startLine.lineDepthAbs,
            targetLineDepthRel: startLine.lineDepthRel
          });
          range4sel = rangy.createRange();
          range4sel.collapseToPoint(newLine.line$[0].firstChild, 0);
          return currSel.sel.setSingleRange(range4sel);
        } else if (currSel.rangeIsStartLine) {
          newLine = this._insertLineBefore({
            sourceLineID: startLine.lineID,
            targetLineType: startLine.lineType,
            targetLineDepthAbs: startLine.lineDepthAbs,
            targetLineDepthRel: startLine.lineDepthRel
          });
          range4sel = rangy.createRange();
          range4sel.collapseToPoint(startLine.line$[0].firstChild, 0);
          return currSel.sel.setSingleRange(range4sel);
        } else {
          currSel.range.setEndBefore(startLine.line$[0].lastChild);
          endOfLineFragment = currSel.range.extractContents();
          currSel.range.deleteContents();
          newLine = this._insertLineAfter({
            sourceLineID: startLine.lineID,
            targetLineType: startLine.lineType,
            targetLineDepthAbs: startLine.lineDepthAbs,
            targetLineDepthRel: startLine.lineDepthRel,
            fragment: endOfLineFragment
          });
          range4sel = rangy.createRange();
          range4sel.collapseToPoint(newLine.line$[0].firstChild.childNodes[0], 0);
          currSel.sel.setSingleRange(range4sel);
          return this.currentSel = null;
        }
      };

      /* ------------------------------------------------------------------------
      # turn in Th or Lh of the siblings of line (and line itself of course)
      # the children are note modified
      */

      CNEditor.prototype._titilizeSiblings = function(line) {
        var l, lineDepthAbs;
        lineDepthAbs = line.lineDepthAbs;
        l = line;
        while (l !== null && l.lineDepthAbs >= lineDepthAbs) {
          if (l.lineDepthAbs === lineDepthAbs) {
            switch (l.lineType) {
              case 'Tu':
              case 'To':
                l.line$.prop("class", "Th-" + lineDepthAbs);
                l.lineType = 'Th';
                l.lineDepthRel = 0;
                break;
              case 'Lu':
              case 'Lo':
                l.line$.prop("class", "Lh-" + lineDepthAbs);
                l.lineType = 'Lh';
                l.lineDepthRel = 0;
            }
          }
          l = l.lineNext;
        }
        l = line.linePrev;
        while (l !== null && l.lineDepthAbs >= lineDepthAbs) {
          if (l.lineDepthAbs === lineDepthAbs) {
            switch (l.lineType) {
              case 'Tu':
              case 'To':
                l.line$.prop("class", "Th-" + lineDepthAbs);
                l.lineType = 'Th';
                l.lineDepthRel = 0;
                break;
              case 'Lu':
              case 'Lo':
                l.line$.prop("class", "Lh-" + lineDepthAbs);
                l.lineType = 'Lh';
                l.lineDepthRel = 0;
            }
          }
          l = l.linePrev;
        }
        return true;
      };

      /* ------------------------------------------------------------------------
      # find the sibling line of the parent of line that is the first of the list
      # ex :
      #   . Sibling1  <= _findParent1stSibling(line)
      #   . Sibling2
      #   . Parent
      #      . child1
      #      . line     : the line in argument
      # returns null if no previous sibling, the line otherwise
      # the sibling is a title (Th, Tu or To), not a line (Lh nor Lu nor Lo)
      */

      CNEditor.prototype._findParent1stSibling = function(line) {
        var lineDepthAbs, linePrev;
        lineDepthAbs = line.lineDepthAbs;
        linePrev = line.linePrev;
        if (linePrev === null) return line;
        if (lineDepthAbs <= 2) {
          while (linePrev.linePrev !== null) {
            linePrev = linePrev.linePrev;
          }
          return linePrev;
        } else {
          while (linePrev !== null && linePrev.lineDepthAbs > (lineDepthAbs - 2)) {
            linePrev = linePrev.linePrev;
          }
          return linePrev.lineNext;
        }
      };

      /* ------------------------------------------------------------------------
      # find the previous sibling line.
      # returns null if no previous sibling, the line otherwise
      # the sibling is a title (Th, Tu or To), not a line (Lh nor Lu nor Lo)
      */

      CNEditor.prototype._findPrevSibling = function(line) {
        var lineDepthAbs, linePrevSibling;
        lineDepthAbs = line.lineDepthAbs;
        linePrevSibling = line.linePrev;
        if (linePrevSibling === null) {
          return null;
        } else if (linePrevSibling.lineDepthAbs < lineDepthAbs) {
          return null;
        } else {
          while (linePrevSibling.lineDepthAbs > lineDepthAbs) {
            linePrevSibling = linePrevSibling.linePrev;
          }
          while (linePrevSibling.lineType[0] === 'L') {
            linePrevSibling = linePrevSibling.linePrev;
          }
          return linePrevSibling;
        }
      };

      /* ------------------------------------------------------------------------
      #   delete the user multi line selection
      #
      #   prerequisite : at least 2 lines must be selected
      # 
      #   parameters :
      #        :
      #
      */

      CNEditor.prototype._deleteMultiLinesSelections = function(startLine, endLine) {
        var deltaDepth, deltaDepth1stLine, depthSibling, endLineDepthAbs, endOfLineFragment, firstLineAfterSiblingsOfDeleted, line, newDepth, prevSiblingType, range, range4caret, range4fragment, startContainer, startLineDepthAbs, startOffset;
        if (startLine !== void 0) {
          range = rangy.createRange();
          range.setStartBefore(startLine.line$);
          range.setStartAfter(endLine.line$);
        } else {
          this._findLines();
          range = this.currentSel.range;
          startContainer = range.startContainer;
          startOffset = range.startOffset;
          startLine = this.currentSel.startLine;
          endLine = this.currentSel.endLine;
        }
        endLineDepthAbs = endLine.lineDepthAbs;
        startLineDepthAbs = startLine.lineDepthAbs;
        deltaDepth = endLineDepthAbs - startLineDepthAbs;
        range4fragment = rangy.createRangyRange();
        range4fragment.setStart(range.endContainer, range.endOffset);
        range4fragment.setEndAfter(endLine.line$[0].lastChild);
        endOfLineFragment = range4fragment.cloneContents();
        if (endLine.lineType[1] === 'h' && startLine.lineType[1] !== 'h') {
          if (endLine.lineType[0] === 'L') {
            endLine.lineType = 'T' + endLine.lineType[1];
            endLine.line$.prop("class", "" + endLine.lineType + "-" + endLine.lineDepthAbs);
          }
          this.markerList(endLine);
        }
        range.deleteContents();
        if (startLine.line$[0].lastChild.nodeName === 'BR') {
          startLine.line$[0].removeChild(startLine.line$[0].lastChild);
        }
        startLine.line$.append(endOfLineFragment);
        startLine.lineNext = endLine.lineNext;
        if (endLine.lineNext !== null) endLine.lineNext.linePrev = startLine;
        endLine.line$.remove();
        delete this._lines[endLine.lineID];
        line = startLine.lineNext;
        if (line !== null) {
          deltaDepth1stLine = line.lineDepthAbs - startLineDepthAbs;
          if (deltaDepth1stLine >= 1) {
            while (line !== null && line.lineDepthAbs >= endLineDepthAbs) {
              newDepth = line.lineDepthAbs - deltaDepth;
              line.lineDepthAbs = newDepth;
              line.line$.prop("class", "" + line.lineType + "-" + newDepth);
              line = line.lineNext;
            }
          }
        }
        if (line !== null) {
          if (line.lineType[0] === 'L') {
            line.lineType = 'T' + line.lineType[1];
            line.line$.prop("class", "" + line.lineType + "-" + line.lineDepthAbs);
          }
          firstLineAfterSiblingsOfDeleted = line;
          depthSibling = line.lineDepthAbs;
          line = line.linePrev;
          while (line !== null && line.lineDepthAbs > depthSibling) {
            line = line.linePrev;
          }
          prevSiblingType = line.lineType;
          if (firstLineAfterSiblingsOfDeleted.lineType !== prevSiblingType) {
            if (prevSiblingType[1] === 'h') {
              this._line2titleList(firstLineAfterSiblingsOfDeleted);
            } else {
              this.markerList(firstLineAfterSiblingsOfDeleted);
            }
          }
        }
        range4caret = rangy.createRange();
        range4caret.collapseToPoint(startContainer, startOffset);
        this.currentSel.sel.setSingleRange(range4caret);
        return this.currentSel = null;
      };

      /* ------------------------------------------------------------------------
      # Insert a line after a source line
      # p = 
      #     sourceLineID       : ID of the line after which the line will be added
      #     fragment           : [optionnal] - an html fragment that will be added
      #     targetLineType     : type of the line to add
      #     targetLineDepthAbs : absolute depth of the line to add
      #     targetLineDepthRel : relative depth of the line to add
      */

      CNEditor.prototype._insertLineAfter = function(p) {
        var lineID, newLine, newLine$, sourceLine;
        this._highestId += 1;
        lineID = 'CNID_' + this._highestId;
        newLine$ = $("<div id='" + lineID + "' class='" + p.targetLineType + "-" + p.targetLineDepthAbs + "'></div>");
        if (p.fragment != null) {
          newLine$.append(p.fragment);
          newLine$.append('<br>');
        } else {
          newLine$.append($('<span></span><br>'));
        }
        sourceLine = this._lines[p.sourceLineID];
        newLine$ = newLine$.insertAfter(sourceLine.line$);
        newLine = {
          line$: newLine$,
          lineID: lineID,
          lineType: p.targetLineType,
          lineDepthAbs: p.targetLineDepthAbs,
          lineDepthRel: p.targetLineDepthRel,
          lineNext: sourceLine.lineNext,
          linePrev: sourceLine
        };
        this._lines[lineID] = newLine;
        if (sourceLine.lineNext !== null) sourceLine.lineNext.linePrev = newLine;
        sourceLine.lineNext = newLine;
        return newLine;
      };

      /* ------------------------------------------------------------------------
      # Insert a line before a source line
      # p = 
      #     sourceLineID       : ID of the line before which a line will be added
      #     fragment           : [optionnal] - an html fragment that will be added
      #     targetLineType     : type of the line to add
      #     targetLineDepthAbs : absolute depth of the line to add
      #     targetLineDepthRel : relative depth of the line to add
      */

      CNEditor.prototype._insertLineBefore = function(p) {
        var lineID, newLine, newLine$, sourceLine;
        this._highestId += 1;
        lineID = 'CNID_' + this._highestId;
        newLine$ = $("<div id='" + lineID + "' class='" + p.targetLineType + "-" + p.targetLineDepthAbs + "'></div>");
        if (p.fragment != null) {
          newLine$.append(p.fragment);
          newLine$.append($('<br>'));
        } else {
          newLine$.append($('<span></span><br>'));
        }
        sourceLine = this._lines[p.sourceLineID];
        newLine$ = newLine$.insertBefore(sourceLine.line$);
        newLine = {
          line$: newLine$,
          lineID: lineID,
          lineType: p.targetLineType,
          lineDepthAbs: p.targetLineDepthAbs,
          lineDepthRel: p.targetLineDepthRel,
          lineNext: sourceLine,
          linePrev: sourceLine.linePrev
        };
        this._lines[lineID] = newLine;
        if (sourceLine.linePrev !== null) sourceLine.linePrev.lineNext = newLine;
        sourceLine.linePrev = newLine;
        return newLine;
      };

      /* ------------------------------------------------------------------------
      # Finds :
      #   First and last line of selection. 
      # Remark :
      #   Only the first range of the selections is taken into account.
      # Returns : 
      #   sel : the selection
      #   range : the 1st range of the selections
      #   startLine : the 1st line of the range
      #   endLine : the last line of the range
      */

      CNEditor.prototype._findLines = function() {
        var endContainer, endLine, initialEndOffset, initialStartOffset, range, sel, startContainer, startLine;
        if (this.currentSel === null) {
          sel = rangy.getIframeSelection(this.editorIframe);
          range = sel.getRangeAt(0);
          startContainer = range.startContainer;
          endContainer = range.endContainer;
          initialStartOffset = range.startOffset;
          initialEndOffset = range.endOffset;
          if ((endContainer.id != null) && endContainer.id.substr(0, 5) === 'CNID_') {
            endLine = this._lines[endContainer.id];
          } else {
            endLine = this._lines[$(endContainer).parents("div")[0].id];
          }
          if (startContainer.nodeName === 'DIV') {
            startLine = this._lines[startContainer.id];
          } else {
            startLine = this._lines[$(startContainer).parents("div")[0].id];
          }
          return this.currentSel = {
            sel: sel,
            range: range,
            startLine: startLine,
            endLine: endLine,
            rangeIsStartLine: null,
            rangeIsEndLine: null
          };
        }
      };

      /* ------------------------------------------------------------------------
      # Finds :
      #   first and last line of selection 
      #   wheter the selection starts at the beginning of startLine or not
      #   wheter the selection ends at the end of endLine or not
      # 
      # Remark :
      #   Only the first range of the selections is taken into account.
      #
      # Returns : 
      #   sel : the selection
      #   range : the 1st range of the selections
      #   startLine : the 1st line of the range
      #   endLine : the last line of the range
      #   rangeIsEndLine : true if the range ends at the end of the last line
      #   rangeIsStartLine : turu if the range starts at the start of 1st line
      */

      CNEditor.prototype._findLinesAndIsStartIsEnd = function() {
        var endContainer, endLine, initialEndOffset, initialStartOffset, nextSibling, parentEndContainer, range, rangeIsEndLine, rangeIsStartLine, sel, startContainer, startLine;
        if (this.currentSel === null) {
          sel = rangy.getIframeSelection(this.editorIframe);
          range = sel.getRangeAt(0);
          startContainer = range.startContainer;
          endContainer = range.endContainer;
          initialStartOffset = range.startOffset;
          initialEndOffset = range.endOffset;
          if ((endContainer.id != null) && endContainer.id.substr(0, 5) === 'CNID_') {
            endLine = this._lines[endContainer.id];
            rangeIsEndLine = (endContainer.children.length - 1 === initialEndOffset) || (endContainer.children[initialEndOffset].nodeName === "BR");
          } else {
            endLine = this._lines[$(endContainer).parents("div")[0].id];
            parentEndContainer = endContainer;
            rangeIsEndLine = false;
            if (parentEndContainer.nodeType === Node.TEXT_NODE) {
              rangeIsEndLine = initialEndOffset === parentEndContainer.textContent.length;
            } else {
              nextSibling = parentEndContainer.nextSibling;
              rangeIsEndLine = nextSibling === null || nextSibling.nodeName === 'BR';
            }
            parentEndContainer = endContainer.parentNode;
            while (rangeIsEndLine && parentEndContainer.nodeName !== "DIV") {
              nextSibling = parentEndContainer.nextSibling;
              rangeIsEndLine = nextSibling === null || nextSibling.nodeName === 'BR';
              parentEndContainer = parentEndContainer.parentNode;
            }
          }
          if (startContainer.nodeName === 'DIV') {
            startLine = this._lines[startContainer.id];
            rangeIsStartLine = initialStartOffset === 0;
            if (initialStartOffset === 1 && startContainer.innerHTML === "<span></span><br>") {
              rangeIsStartLine = true;
            }
          } else {
            startLine = this._lines[$(startContainer).parents("div")[0].id];
            rangeIsStartLine = initialStartOffset === 0;
            while (rangeIsStartLine && parentEndContainer.nodeName !== "DIV") {
              rangeIsStartLine = parentEndContainer.previousSibling === null;
              parentEndContainer = parentEndContainer.parentNode;
            }
          }
          return this.currentSel = {
            sel: sel,
            range: range,
            startLine: startLine,
            endLine: endLine,
            rangeIsStartLine: rangeIsStartLine,
            rangeIsEndLine: rangeIsEndLine
          };
        }
      };

      /*  -----------------------------------------------------------------------
      # Parse a raw html inserted in the iframe in order to update the controler
      */

      CNEditor.prototype._readHtml = function() {
        var DeltaDepthAbs, htmlLine, htmlLine$, lineClass, lineDepthAbs, lineDepthAbs_old, lineDepthRel, lineDepthRel_old, lineID, lineID_st, lineNew, lineNext, linePrev, lineType, linesDiv$, _i, _len, _ref;
        linesDiv$ = this.editorBody$.children();
        lineDepthAbs = 0;
        lineDepthRel = 0;
        lineID = 0;
        this._lines = {};
        linePrev = null;
        lineNext = null;
        for (_i = 0, _len = linesDiv$.length; _i < _len; _i++) {
          htmlLine = linesDiv$[_i];
          htmlLine$ = $(htmlLine);
          lineClass = (_ref = htmlLine$.attr('class')) != null ? _ref : "";
          lineClass = lineClass.split('-');
          lineType = lineClass[0];
          if (lineType !== "") {
            lineDepthAbs_old = lineDepthAbs;
            lineDepthAbs = +lineClass[1];
            DeltaDepthAbs = lineDepthAbs - lineDepthAbs_old;
            lineDepthRel_old = lineDepthRel;
            if (lineType === "Th") {
              lineDepthRel = 0;
            } else {
              lineDepthRel = lineDepthRel_old + DeltaDepthAbs;
            }
            lineID = parseInt(lineID, 10) + 1;
            lineID_st = "CNID_" + lineID;
            htmlLine$.prop("id", lineID_st);
            lineNew = {
              line$: htmlLine$,
              lineID: lineID_st,
              lineType: lineType,
              lineDepthAbs: lineDepthAbs,
              lineDepthRel: lineDepthRel,
              lineNext: null,
              linePrev: linePrev
            };
            if (linePrev !== null) linePrev.lineNext = lineNew;
            linePrev = lineNew;
            this._lines[lineID_st] = lineNew;
          }
        }
        return this._highestId = lineID;
      };

      return CNEditor;

    })(Backbone.View);

  }).call(this);
  
}});

window.require.define({"views/home_view": function(exports, require, module) {
  (function() {
    var __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    exports.HomeView = (function(_super) {

      __extends(HomeView, _super);

      function HomeView() {
        HomeView.__super__.constructor.apply(this, arguments);
      }

      HomeView.prototype.id = 'home-view';

      HomeView.prototype.render = function() {
        $(this.el).html(require('./templates/home'));
        return this;
      };

      return HomeView;

    })(Backbone.View);

  }).call(this);
  
}});

window.require.define({"views/initPage": function(exports, require, module) {
  (function() {
    var AutoTest, CNEditor, CNcozyToMarkdown, CNmarkdownToCozy, beautify, checker, cozy2md, editorBody$, editor_css$, editor_doAddClasseToLines, editor_head$, md2cozy;

    beautify = require('views/beautify').beautify;

    CNEditor = require('views/editor').CNEditor;

    CNcozyToMarkdown = require('views/cozyToMarkdown').CNcozyToMarkdown;

    CNmarkdownToCozy = require('views/markdownToCozy').CNmarkdownToCozy;

    cozy2md = new CNcozyToMarkdown();

    md2cozy = new CNmarkdownToCozy();

    AutoTest = require('views/autoTest').AutoTest;

    checker = new AutoTest();

    editorBody$ = void 0;

    editor_head$ = void 0;

    editor_css$ = void 0;

    editor_doAddClasseToLines = void 0;

    exports.initPage = function() {
      var cb, editor, editorIframe$;
      $("body").html(require('./templates/editor'));
      editorIframe$ = $("iframe");
      cb = function() {
        /* initialisation of the page
        this.replaceContent( require('./templates/content-full') )
        this.replaceContent( require('./templates/content-empty') )
        this.replaceContent( require('./templates/content-full-marker') )
        this.replaceContent( require('./templates/content-shortlines-marker') )
        */
        var addClassToLines, editorCtrler, getSelectedLines, removeClassFromLines, restoreSelection,
          _this = this;
        this.replaceContent(require('./templates/content-shortlines-all'));
        editorCtrler = this;
        editorBody$ = this.editorBody$;
        beautify(editorBody$);
        editorBody$.on('keyup', function() {
          return beautify(editorBody$);
        });
        $("#resultBtnBar_coller").on('click', function() {
          return beautify(editorBody$);
        });
        $("#EmptyTextBtn").on("click", function() {
          editorCtrler.replaceContent(require('./templates/content-empty'));
          return beautify(editorBody$);
        });
        $("#SimpleTextBtn").on("click", function() {
          editorCtrler.replaceContent(require('./templates/content-simple'));
          return beautify(editorBody$);
        });
        $("#FullTextBtn").on("click", function() {
          editorCtrler.replaceContent(require('./templates/content-full'));
          return beautify(editorBody$);
        });
        $('#contentSelect').on("change", function(e) {
          console.log("./templates/" + e.currentTarget.value);
          editorCtrler.replaceContent(require("./templates/" + e.currentTarget.value));
          return beautify(editorBody$);
        });
        $('#cssSelect').on("change", function(e) {
          return editorCtrler.replaceCSS(e.currentTarget.value);
        });
        $("#indentBtn").on("click", function() {
          return editorCtrler.tab();
        });
        $("#unIndentBtn").on("click", function() {
          return editorCtrler.shiftTab();
        });
        $("#markerListBtn").on("click", function() {
          return editorCtrler.markerList();
        });
        $("#titleBtn").on("click", function() {
          return editorCtrler.titleList();
        });
        $("#checkBtn").on("click", function() {
          return checker.checkLines(editorCtrler);
        });
        $("#CozyMarkdown").on("click", function() {
          return $("#resultText").val(cozy2md.translate($("#resultText").val()));
        });
        restoreSelection = function(sel) {
          var i, num, range, _ref;
          num = sel.rangeCount;
          if (num === 0) return;
          for (i = 0, _ref = num - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
            range = sel.getRangeAt(i);
            sel.setSingleRange(range);
          }
          return beautify(editorBody$);
        };
        getSelectedLines = function(sel) {
          var divs, i, k, myDivs, node, range, _ref;
          myDivs = [];
          if (sel.rangeCount === 0) return;
          for (i = 0, _ref = sel.rangeCount - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
            range = sel.getRangeAt(i);
            divs = range.getNodes([1], function(element) {
              return element.tagName === 'DIV';
            });
            if (divs.length === 0) {
              if (range.commonAncestorContainer.tagName !== 'BODY') {
                node = range.commonAncestorContainer;
                while (node.tagName !== 'DIV') {
                  node = node.parentNode;
                }
                divs.push(node);
              }
            }
            k = 0;
            while (k < divs.length) {
              myDivs.push($(divs[k]));
              k++;
            }
          }
          return myDivs;
        };
        addClassToLines = function(mode) {
          var div, k, lineID, lines, sel;
          sel = rangy.getIframeSelection(_this.editorIframe);
          if (mode === "sel") {
            lines = getSelectedLines(sel);
            k = 0;
            while (k < lines.length) {
              div = lines[k];
              div.attr('toDisplay', div.attr('class') + '] ');
              k++;
            }
          } else {
            lines = _this._lines;
            for (lineID in lines) {
              div = $(lines[lineID].line$[0]);
              div.attr('toDisplay', div.attr('class') + '] ');
            }
          }
          return restoreSelection(sel);
        };
        removeClassFromLines = function(mode) {
          var div, k, lineID, lines, sel;
          sel = rangy.getIframeSelection(_this.editorIframe);
          if (mode === "sel") {
            lines = getSelectedLines(sel);
            k = 0;
            while (k < lines.length) {
              div = lines[k];
              div.attr('toDisplay', '');
              k++;
            }
          } else {
            lines = _this._lines;
            for (lineID in lines) {
              div = $(lines[lineID].line$[0]);
              div.attr('toDisplay', '');
            }
          }
          return restoreSelection(sel);
        };
        $("#addClass2LineBtn").on("click", function() {
          addClassToLines();
          if (editor_doAddClasseToLines) {
            $("#addClass2LineBtn").html("Show Class on Lines");
            editor_doAddClasseToLines = false;
            editorBody$.off('keyup', addClassToLines);
            return removeClassFromLines();
          } else {
            $("#addClass2LineBtn").html("Hide Class on Lines");
            editor_doAddClasseToLines = true;
            return editorBody$.on('keyup', addClassToLines);
          }
        });
        $("#addClass").on("click", function() {
          return addClassToLines("sel");
        });
        $("#delClass").on("click", function() {
          return removeClassFromLines("sel");
        });
        return this.editorBody$.on('mouseup', function() {
          this.newPosition = true;
          return $("#editorPropertiesDisplay").text("newPosition = true");
        });
      };
      editor = new CNEditor($('#editorIframe')[0], cb);
      return editor;
    };

  }).call(this);
  
}});

window.require.define({"views/markdownToCozy": function(exports, require, module) {
  (function() {
    var __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    exports.CNmarkdownToCozy = (function(_super) {

      __extends(CNmarkdownToCozy, _super);

      function CNmarkdownToCozy() {
        CNmarkdownToCozy.__super__.constructor.apply(this, arguments);
      }

      CNmarkdownToCozy.prototype.translate = function(text) {
        var conv, cozyCode, cozyTurn, depth, htmlCode, id, recRead;
        conv = new Showdown.converter();
        text = conv.makeHtml(text);
        htmlCode = $(document.createElement('ul')).html(text);
        cozyCode = '';
        id = 0;
        cozyTurn = function(type, depth, p) {
          var code;
          id++;
          code = '';
          p.contents().each(function() {
            var name;
            name = this.nodeName;
            if (name === "#text") {
              return code += "<span>" + ($(this).text()) + "</span>";
            } else if (this.tagName != null) {
              $(this).wrap('<div></div>');
              code += "" + ($(this).parent().html());
              return $(this).unwrap();
            }
          });
          return ("<div id=CNID_" + id + " class=" + type + "-" + depth + ">") + code + "<br></div>";
        };
        depth = 0;
        recRead = function(obj, status) {
          var child, i, tag, _ref, _results;
          tag = obj[0].tagName;
          if (tag === "UL") {
            depth++;
            obj.children().each(function() {
              return recRead($(this), "u");
            });
            return depth--;
          } else if (tag === "OL") {
            depth++;
            obj.children().each(function() {
              return recRead($(this), "o");
            });
            return depth--;
          } else if (tag === "LI" && (obj.contents().get(0) != null)) {
            if (obj.contents().get(0).nodeName === "#text") {
              obj = obj.clone().wrap('<p></p>').parent();
            }
            _results = [];
            for (i = 0, _ref = obj.children().length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
              child = $(obj.children().get(i));
              if (i === 0) {
                if (child.attr("class") === "TH") {
                  _results.push(cozyCode += cozyTurn("Th", depth, child));
                } else {
                  _results.push(cozyCode += cozyTurn("T" + status, depth, child));
                }
              } else {
                if (child.attr("class") === "TH") {
                  _results.push(recRead(child, "h"));
                } else {
                  _results.push(recRead(child, status));
                }
              }
            }
            return _results;
          } else if (tag === "P") {
            return cozyCode += cozyTurn("L" + status, depth, obj);
          }
        };
        htmlCode.children().each(function() {
          return recRead($(this), "u");
        });
        return cozyCode;
      };

      return CNmarkdownToCozy;

    })(Backbone.View);

  }).call(this);
  
}});

window.require.define({"views/templates/content-empty": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div');
  buf.push(attrs({ "class": ('Tu-1') }));
  buf.push('><span></span><br');
  buf.push(attrs({  }));
  buf.push('/></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"views/templates/content-full-marker": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<!-- --------------------------------------------><!-- Premier Th-1--><div');
  buf.push(attrs({ "class": ('Tu-1') }));
  buf.push('><span>Un premier titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-1') }));
  buf.push('><span>Une ligne Lu-1 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-2') }));
  buf.push('><span>Un second titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-2') }));
  buf.push('><span>Une ligne qui devient un titre après un suppr</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Un troisième titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Une ligne Lu-3 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Une 2ièmle ligne Lu-3 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Un troisième titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Une ligne Lu-3 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-2') }));
  buf.push('><span>Un second titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-2') }));
  buf.push('><span>Une ligne Lu-2 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Un troisième titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Une ligne Lu-3 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Point 1 blabla</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Point 2 blabla</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Point 2 blabla</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Une 2ièmle ligne Lu-3 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Un troisième titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Une ligne Lu-3 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><!-- --------------------------------------------><!-- Second Tu-1--><div');
  buf.push(attrs({ "class": ('Tu-1') }));
  buf.push('><span>Un second Titre Tu-1</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-1') }));
  buf.push('><span>Nous allons maintenant aborder les chapitres à puces :</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-2') }));
  buf.push('><span>Second paragraphe à puce avec un titre et une ligne</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-2') }));
  buf.push('><span>Une ligne Lu-2 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>troisième paragraphe à puce avec un titre et une ligne</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Une ligne Lu-2 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Quatrième paragraphe à puce avec un titre et une ligne</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-4') }));
  buf.push('><span>Une ligne Lu-2 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Quatrième paragraphe à puce avec un titre et une ligne</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>troisième paragraphe à puce avec un titre et une ligne</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Une ligne Lu-2 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>troisième paragraphe à puce avec un titre et une ligne</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>troisième paragraphe à puce avec un titre et une ligne</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>troisième paragraphe à puce avec un titre et une ligne</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-2') }));
  buf.push('><span>Second paragraphe à puce avec un titre et une ligne</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-2') }));
  buf.push('><span>Une ligne Lu-2 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>troisième paragraphe à puce avec un titre et une ligne</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Une ligne Lu-2 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Quatrième paragraphe à puce avec un titre et une ligne</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-4') }));
  buf.push('><span>Une ligne Lu-2 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-1') }));
  buf.push('><span>Un premier titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-1') }));
  buf.push('><span>Une ligne de niveau 1 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne </span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-1') }));
  buf.push('><span>Une seconde ligne de niveau 1 </span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-2') }));
  buf.push('><span>Un paragraphe avec juste un titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-2') }));
  buf.push('><span>Un second paragraphe avec un titre long et une ligne, un second paragraphe avec un titre long, un second paragraphe avec un titre long, un second paragraphe avec un titre long, un second paragraphe avec un titre long, un second paragraphe avec un titre long !</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-2') }));
  buf.push('><span>Ligne du Second paragraphe </span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-2') }));
  buf.push('><span>Un troisième paragraphe avec une liste en dessous :</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Premier paragraphe (1 titre seul)</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Second paragraphe (1 titre & une ligne)</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Ligne du Second paragraphe (1 titre & une ligne), longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>3ième paragraphe (1 titre & 2 lignes)</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Ligne 1 du 3ième paragraphe, pas longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Ligne 2 du 3ième paragraphe (1 titre & une ligne), longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Quatrième paragraphe avec une sous liste :</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Premier paragraphe</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Second paragraphe</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-4') }));
  buf.push('><span>Ligne 1 du 2nd paragraphe, pas longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>troisième paragraphe</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Quatrième paragraphe</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-1') }));
  buf.push('><span>Un titre de niveau 1</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-2') }));
  buf.push('><span>Un titre de niveau 2</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Un paragraphe un  titre et deux lignes</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Seconde ligne, pas très longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-2') }));
  buf.push('><span>Un second titre de niveau 2</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-2') }));
  buf.push('><span>Ligne commentant le paragraphe</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-2') }));
  buf.push('><span>Seconde ligne commentant le paragraphe</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Un paragraphe avec juste un titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Un second paragraphe avec un titre long, un second paragraphe avec un titre long, un second paragraphe avec un titre long, un second paragraphe avec un titre long, un second paragraphe avec un titre long, un second paragraphe avec un titre long !</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Un troisième paragraphe avec une liste en dessous :</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Premier paragraphe (1 titre seul)</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Second paragraphe (1 titre & une ligne)</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-4') }));
  buf.push('><span>Ligne du Second paragraphe (1 titre & une ligne), longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span></span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>c\'était un paragraphe vide :-)</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>12</span><br');
  buf.push(attrs({  }));
  buf.push('/></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"views/templates/content-full-relative-indent": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div');
  buf.push(attrs({ 'id':('nav') }));
  buf.push('><div');
  buf.push(attrs({ "class": ('Th-1') }));
  buf.push('><span>Un premier titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Th-1') }));
  buf.push('><span>Un second titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Th-2') }));
  buf.push('><span>Un titre de niveau 2</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Th-2') }));
  buf.push('><span>Un titre de niveau 2</span></div></div><!-- --------------------------------------------><!-- Premier Th-1--><div');
  buf.push(attrs({ "class": ('Th-1') }));
  buf.push('><span>Un premier titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-1') }));
  buf.push('><span>Une ligne Lh-1 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Th-2') }));
  buf.push('><span>Un second titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-2') }));
  buf.push('><span>Une ligne Lh-2 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Th-3') }));
  buf.push('><span>Un troisième titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-3') }));
  buf.push('><span>Une ligne Lh-3 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-3') }));
  buf.push('><span>Une 2ièmle ligne Lh-3 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Th-3') }));
  buf.push('><span>Un troisième titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-3') }));
  buf.push('><span>Une ligne Lh-3 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Th-2') }));
  buf.push('><span>Un second titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-2') }));
  buf.push('><span>Une ligne Lh-2 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Th-3') }));
  buf.push('><span>Un troisième titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-3') }));
  buf.push('><span>Une ligne Lh-3 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Point 1 blabla</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Point 2 blabla</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Point 2 blabla</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-3') }));
  buf.push('><span>Une 2ièmle ligne Lh-3 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Th-3') }));
  buf.push('><span>Un troisième titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-3') }));
  buf.push('><span>Une ligne Lh-3 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><!-- --------------------------------------------><!-- Second Th-1--><div');
  buf.push(attrs({ "class": ('Th-1') }));
  buf.push('><span>Un second Titre Th-1</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-1') }));
  buf.push('><span>Nous allons maintenant aborder les chapitres à puces :</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-2') }));
  buf.push('><span>Second paragraphe à puce avec un titre et une ligne</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-2') }));
  buf.push('><span>Une ligne Lu-2 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>troisième paragraphe à puce avec un titre et une ligne</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Une ligne Lu-2 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Quatrième paragraphe à puce avec un titre et une ligne</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-4') }));
  buf.push('><span>Une ligne Lu-2 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Quatrième paragraphe à puce avec un titre et une ligne</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>troisième paragraphe à puce avec un titre et une ligne</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Une ligne Lu-2 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>troisième paragraphe à puce avec un titre et une ligne</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>troisième paragraphe à puce avec un titre et une ligne</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>troisième paragraphe à puce avec un titre et une ligne</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-2') }));
  buf.push('><span>Second paragraphe à puce avec un titre et une ligne</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-2') }));
  buf.push('><span>Une ligne Lu-2 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>troisième paragraphe à puce avec un titre et une ligne</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Une ligne Lu-2 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Quatrième paragraphe à puce avec un titre et une ligne</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-4') }));
  buf.push('><span>Une ligne Lu-2 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Th-1') }));
  buf.push('><span>Un premier titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-1') }));
  buf.push('><span>Une ligne de niveau 1 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne </span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-1') }));
  buf.push('><span>Une seconde ligne de niveau 1 </span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-2') }));
  buf.push('><span>Un paragraphe avec juste un titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-2') }));
  buf.push('><span>Un second paragraphe avec un titre long et une ligne, un second paragraphe avec un titre long, un second paragraphe avec un titre long, un second paragraphe avec un titre long, un second paragraphe avec un titre long, un second paragraphe avec un titre long !</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-2') }));
  buf.push('><span>Ligne du Second paragraphe </span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-2') }));
  buf.push('><span>Un troisième paragraphe avec une liste en dessous :</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Premier paragraphe (1 titre seul)</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Second paragraphe (1 titre & une ligne)</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Ligne du Second paragraphe (1 titre & une ligne), longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>3ième paragraphe (1 titre & 2 lignes)</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Ligne 1 du 3ième paragraphe, pas longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Ligne 2 du 3ième paragraphe (1 titre & une ligne), longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Quatrième paragraphe avec une sous liste :</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Premier paragraphe</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Second paragraphe</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-4') }));
  buf.push('><span>Ligne 1 du 2nd paragraphe, pas longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>troisième paragraphe</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Quatrième paragraphe</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Th-1') }));
  buf.push('><span>Un titre de niveau 1</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Th-2') }));
  buf.push('><span>Un titre de niveau 2</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Un paragraphe un  titre et deux lignes</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Seconde ligne, pas très longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Th-2') }));
  buf.push('><span>Un second titre de niveau 2</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-2') }));
  buf.push('><span>Ligne commentant le paragraphe</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-2') }));
  buf.push('><span>Seconde ligne commentant le paragraphe</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Un paragraphe avec juste un titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Un second paragraphe avec un titre long, un second paragraphe avec un titre long, un second paragraphe avec un titre long, un second paragraphe avec un titre long, un second paragraphe avec un titre long, un second paragraphe avec un titre long !</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Un troisième paragraphe avec une liste en dessous :</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Premier paragraphe (1 titre seul)</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Second paragraphe (1 titre & une ligne)</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-4') }));
  buf.push('><span>Ligne du Second paragraphe (1 titre & une ligne), longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span></span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>c\'était un paragraphe vide :-)</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>12</span><br');
  buf.push(attrs({  }));
  buf.push('/></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"views/templates/content-full": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<!-- --------------------------------------------><!-- Premier Th-1--><div');
  buf.push(attrs({ "class": ('Th-1') }));
  buf.push('><span>Un premier titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-1') }));
  buf.push('><span>Une ligne Lh-1 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Th-2') }));
  buf.push('><span>Un second titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-2') }));
  buf.push('><span>Une ligne Lh-2 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Th-3') }));
  buf.push('><span>Un troisième titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-3') }));
  buf.push('><span>Une ligne Lh-3 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-3') }));
  buf.push('><span>Une 2ièmle ligne Lh-3 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Th-3') }));
  buf.push('><span>Un troisième titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-3') }));
  buf.push('><span>Une ligne Lh-3 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Th-2') }));
  buf.push('><span>Un second titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-2') }));
  buf.push('><span>Une ligne Lh-2 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Th-3') }));
  buf.push('><span>Un troisième titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-3') }));
  buf.push('><span>Une ligne Lh-3 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Point 1 blabla</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Point 2 blabla</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Point 2 blabla</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-3') }));
  buf.push('><span>Une 2ièmle ligne Lh-3 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Th-3') }));
  buf.push('><span>Un troisième titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-3') }));
  buf.push('><span>Une ligne Lh-3 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><!-- --------------------------------------------><!-- Second Th-1--><div');
  buf.push(attrs({ "class": ('Th-1') }));
  buf.push('><span>Un second Titre Th-1</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-1') }));
  buf.push('><span>Nous allons maintenant aborder les chapitres à puces :</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-2') }));
  buf.push('><span>Second paragraphe à puce avec un titre et une ligne</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-2') }));
  buf.push('><span>Une ligne Lu-2 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>troisième paragraphe à puce avec un titre et une ligne</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Une ligne Lu-2 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Quatrième paragraphe à puce avec un titre et une ligne</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-4') }));
  buf.push('><span>Une ligne Lu-2 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Quatrième paragraphe à puce avec un titre et une ligne</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>troisième paragraphe à puce avec un titre et une ligne</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Une ligne Lu-2 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>troisième paragraphe à puce avec un titre et une ligne</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>troisième paragraphe à puce avec un titre et une ligne</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>troisième paragraphe à puce avec un titre et une ligne</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-2') }));
  buf.push('><span>Second paragraphe à puce avec un titre et une ligne</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-2') }));
  buf.push('><span>Une ligne Lu-2 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>troisième paragraphe à puce avec un titre et une ligne</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Une ligne Lu-2 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Quatrième paragraphe à puce avec un titre et une ligne</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-4') }));
  buf.push('><span>Une ligne Lu-2 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Th-1') }));
  buf.push('><span>Un premier titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-1') }));
  buf.push('><span>Une ligne de niveau 1 plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne plutôt longue pour voir où se situe le retour à la ligne </span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-1') }));
  buf.push('><span>Une seconde ligne de niveau 1 </span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-2') }));
  buf.push('><span>Un paragraphe avec juste un titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-2') }));
  buf.push('><span>Un second paragraphe avec un titre long et une ligne, un second paragraphe avec un titre long, un second paragraphe avec un titre long, un second paragraphe avec un titre long, un second paragraphe avec un titre long, un second paragraphe avec un titre long !</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-2') }));
  buf.push('><span>Ligne du Second paragraphe </span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-2') }));
  buf.push('><span>Un troisième paragraphe avec une liste en dessous :</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Premier paragraphe (1 titre seul)</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Second paragraphe (1 titre & une ligne)</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Ligne du Second paragraphe (1 titre & une ligne), longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>3ième paragraphe (1 titre & 2 lignes)</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Ligne 1 du 3ième paragraphe, pas longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Ligne 2 du 3ième paragraphe (1 titre & une ligne), longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Quatrième paragraphe avec une sous liste :</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Premier paragraphe</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Second paragraphe</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-4') }));
  buf.push('><span>Ligne 1 du 2nd paragraphe, pas longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>troisième paragraphe</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Quatrième paragraphe</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Th-1') }));
  buf.push('><span>Un titre de niveau 1</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Th-2') }));
  buf.push('><span>Un titre de niveau 2</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Un paragraphe un  titre et deux lignes</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Seconde ligne, pas très longue.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Th-2') }));
  buf.push('><span>Un second titre de niveau 2</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-2') }));
  buf.push('><span>Ligne commentant le paragraphe</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-2') }));
  buf.push('><span>Seconde ligne commentant le paragraphe</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Un paragraphe avec juste un titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Un second paragraphe avec un titre long, un second paragraphe avec un titre long, un second paragraphe avec un titre long, un second paragraphe avec un titre long, un second paragraphe avec un titre long, un second paragraphe avec un titre long !</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Un troisième paragraphe avec une liste en dessous :</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Premier paragraphe (1 titre seul)</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Second paragraphe (1 titre & une ligne)</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-4') }));
  buf.push('><span>Ligne du Second paragraphe (1 titre & une ligne), longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs, Très longue ligne mais avec des variations de longueurs.</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span></span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>c\'était un paragraphe vide :-)</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>12</span><br');
  buf.push(attrs({  }));
  buf.push('/></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"views/templates/content-shortlines-all": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div');
  buf.push(attrs({ 'id':('CNID_1'), "class": ('Th-1') }));
  buf.push('><span>Tu-1 - n°1</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_2'), "class": ('Lh-1') }));
  buf.push('><span>Lh-1 - n°2</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_3'), "class": ('Th-2') }));
  buf.push('><span>Th-2 - n°3</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_4'), "class": ('Lh-2') }));
  buf.push('><span>Lh-2 - n°4</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_5'), "class": ('Tu-3') }));
  buf.push('><span>Tu-3 - n°5</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_6'), "class": ('Lu-3') }));
  buf.push('><span>Lu-3 - n°6</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_7'), "class": ('Lu-3') }));
  buf.push('><span>Lu-3 - n°7</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_8'), "class": ('Tu-3') }));
  buf.push('><span>Tu-3 - n°8</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_9'), "class": ('Lu-3') }));
  buf.push('><span>Lu-3 - n°9</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_10'), "class": ('Th-2') }));
  buf.push('><span>Th-2 - n°10</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_11'), "class": ('Lh-2') }));
  buf.push('><span>Lh-2 - n°11</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_12'), "class": ('Th-3') }));
  buf.push('><span>Th-3 - n°12</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_13'), "class": ('Lh-3') }));
  buf.push('><span>Lh-3 - n°13</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_14'), "class": ('Th-4') }));
  buf.push('><span>Th-4 - n°14</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_15'), "class": ('Th-4') }));
  buf.push('><span>Th-4 - n°15</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_16'), "class": ('Th-4') }));
  buf.push('><span>Th-4 - n°16</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_17'), "class": ('Lh-3') }));
  buf.push('><span>Lh-3 - n°17</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_18'), "class": ('Th-3') }));
  buf.push('><span>Th-3 - n°18</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_19'), "class": ('Lh-3') }));
  buf.push('><span>Lh-3 - n°19</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_20'), "class": ('Th-1') }));
  buf.push('><span>Th-1 - n°20</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_21'), "class": ('Lh-1') }));
  buf.push('><span>Lh-1 - n°21</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_22'), "class": ('Tu-2') }));
  buf.push('><span>Tu-2 - n°22</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_23'), "class": ('Lu-2') }));
  buf.push('><span>Lu-2 - n°23</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_24'), "class": ('Tu-3') }));
  buf.push('><span>Tu-3 - n°24</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_25'), "class": ('Lu-3') }));
  buf.push('><span>Lu-3 - n°25</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_26'), "class": ('Tu-4') }));
  buf.push('><span>Tu-4 - n°26</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_27'), "class": ('Lu-4') }));
  buf.push('><span>Lu-4 - n°27</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_28'), "class": ('Tu-4') }));
  buf.push('><span>Tu-4 - n°28</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_29'), "class": ('Tu-3') }));
  buf.push('><span>Tu-3 - n°29</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_30'), "class": ('Lu-3') }));
  buf.push('><span>Lu-3 - n°30</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_31'), "class": ('Tu-3') }));
  buf.push('><span>Tu-3 - n°31</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_32'), "class": ('Tu-3') }));
  buf.push('><span>Tu-3 - n°32</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_33'), "class": ('Tu-3') }));
  buf.push('><span>Tu-3 - n°33</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_34'), "class": ('Tu-2') }));
  buf.push('><span>Tu-2 - n°34</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_35'), "class": ('Lu-2') }));
  buf.push('><span>Lu-2 - n°35</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_36'), "class": ('Tu-3') }));
  buf.push('><span>Tu-3 - n°36</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_37'), "class": ('Lu-3') }));
  buf.push('><span>Lu-3 - n°37</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_38'), "class": ('Tu-4') }));
  buf.push('><span>Tu-4 - n°38</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_39'), "class": ('Lu-4') }));
  buf.push('><span>Lu-4 - n°39</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_40'), "class": ('Th-1') }));
  buf.push('><span>Th-1 - n°40</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_41'), "class": ('Lh-1') }));
  buf.push('><span>Lh-1 - n°41</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_42'), "class": ('Lh-1') }));
  buf.push('><span>Lh-1 - n°42</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_43'), "class": ('Tu-2') }));
  buf.push('><span>Tu-2 - n°43</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_44'), "class": ('Tu-2') }));
  buf.push('><span>Tu-2 - n°44</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_45'), "class": ('Lu-2') }));
  buf.push('><span>Lu-2 - n°45</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_46'), "class": ('Tu-2') }));
  buf.push('><span>Tu-2 - n°46</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_47'), "class": ('Tu-3') }));
  buf.push('><span>Tu-3 - n°47</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_48'), "class": ('Tu-3') }));
  buf.push('><span>Tu-3 - n°48</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_49'), "class": ('Lu-3') }));
  buf.push('><span>Lu-3 - n°49</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_50'), "class": ('Tu-3') }));
  buf.push('><span>Tu-3 - n°50</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_51'), "class": ('Lu-3') }));
  buf.push('><span>Lu-3 - n°51</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_52'), "class": ('Lu-3') }));
  buf.push('><span>Lu-3 - n°52</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_53'), "class": ('Tu-3') }));
  buf.push('><span>Tu-3 - n°53</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_54'), "class": ('Tu-4') }));
  buf.push('><span>Tu-4 - n°54</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_55'), "class": ('Tu-4') }));
  buf.push('><span>Tu-4 - n°55</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_56'), "class": ('Lu-4') }));
  buf.push('><span>Lu-4 - n°56</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_57'), "class": ('Tu-4') }));
  buf.push('><span>Tu-4 - n°57</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_58'), "class": ('Tu-4') }));
  buf.push('><span>Tu-4 - n°58</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_59'), "class": ('Th-1') }));
  buf.push('><span>Th-1 - n°59</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_60'), "class": ('Tu-2') }));
  buf.push('><span>Tu-2 - n°60</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_61'), "class": ('Tu-3') }));
  buf.push('><span>Tu-3 - n°61</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_62'), "class": ('Lu-3') }));
  buf.push('><span>Lu-3 - n°62</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_63'), "class": ('Lu-3') }));
  buf.push('><span>Lu-3 - n°63</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_64'), "class": ('Tu-2') }));
  buf.push('><span>Tu-2 - n°64</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_65'), "class": ('Lu-2') }));
  buf.push('><span>Lu-2 - n°65</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_66'), "class": ('Lu-2') }));
  buf.push('><span>Lu-2 - n°66</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_67'), "class": ('Tu-3') }));
  buf.push('><span>Tu-3 - n°67</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_68'), "class": ('Tu-3') }));
  buf.push('><span>Tu-3 - n°68</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_69'), "class": ('Tu-3') }));
  buf.push('><span>Tu-3 - n°69</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_70'), "class": ('Tu-4') }));
  buf.push('><span>Tu-4 - n°70</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_71'), "class": ('Tu-4') }));
  buf.push('><span>Tu-4 - n°71</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_72'), "class": ('Lu-4') }));
  buf.push('><span>Lu-4 - n°72</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_73'), "class": ('Tu-4') }));
  buf.push('><span>Tu-4 - n°73</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_74'), "class": ('Tu-4') }));
  buf.push('><span>Tu-4 - n°74</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ 'id':('CNID_75'), "class": ('Tu-4') }));
  buf.push('><span>Tu-4 - n°75</span><br');
  buf.push(attrs({  }));
  buf.push('/></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"views/templates/content-shortlines-marker": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<!-- --------------------------------------------><!-- Premier Th-1--><!-- //Tu-2  -   n°3--><div');
  buf.push(attrs({ "class": ('Tu-1') }));
  buf.push('><span>Tu-1  -   n°1</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-1') }));
  buf.push('><span>Lu-1  -   n°2</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-2') }));
  buf.push('><span></span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-2') }));
  buf.push('><span>Lu-2  -   n°4</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Tu-3  -   n°5</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Lu-3  -   n°6</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Lu-3  -   n°7</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Tu-3  -   n°8</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Lu-3  -   n°9</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-2') }));
  buf.push('><span>Tu-2  -   n°10</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-2') }));
  buf.push('><span>Lu-2  -   n°11</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Tu-3  -   n°12</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Lu-3  -   n°13</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Tu-4  -   n°14</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Tu-4  -   n°15</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Tu-4  -   n°16</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Lu-3  -   n°17</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Tu-3  -   n°18</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Lu-3  -   n°19</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><!-- --------------------------------------------><!-- Second Tu-1--><div');
  buf.push(attrs({ "class": ('Tu-1') }));
  buf.push('><span>Tu-1  -   n°20</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-1') }));
  buf.push('><span>Lu-1  -   n°21</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-2') }));
  buf.push('><span>Tu-2  -   n°22</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-2') }));
  buf.push('><span>Lu-2  -   n°23</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Tu-3  -   n°24</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Lu-3  -   n°25</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Tu-4  -   n°26</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-4') }));
  buf.push('><span>Lu-4  -   n°27</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Tu-4  -   n°28</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Tu-3  -   n°29</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Lu-3  -   n°30</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Tu-3  -   n°31</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Tu-3  -   n°32</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Tu-3  -   n°33</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-2') }));
  buf.push('><span>Tu-2  -   n°34</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-2') }));
  buf.push('><span>Lu-2  -   n°35</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Tu-3  -   n°36</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Lu-3  -   n°37</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Tu-4  -   n°38</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-4') }));
  buf.push('><span>Lu-4  -   n°39</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-1') }));
  buf.push('><span>Tu-1  -   n°40</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-1') }));
  buf.push('><span>Lu-1  -   n°41</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-1') }));
  buf.push('><span>Lu-1  -   n°42</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-2') }));
  buf.push('><span>Tu-2  -   n°43</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-2') }));
  buf.push('><span>Tu-2  -   n°44</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-2') }));
  buf.push('><span>Lu-2  -   n°45</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-2') }));
  buf.push('><span>Tu-2  -   n°46</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Tu-3  -   n°47</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Tu-3  -   n°48</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Lu-3  -   n°49</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Tu-3  -   n°50</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Lu-3  -   n°51</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Lu-3  -   n°52</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Tu-3  -   n°53</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Tu-4  -   n°54</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Tu-4  -   n°55</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-4') }));
  buf.push('><span>Lu-4  -   n°56</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Tu-4  -   n°57</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Tu-4  -   n°58</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-1') }));
  buf.push('><span>Tu-1  -   n°59</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-2') }));
  buf.push('><span>Tu-2  -   n°60</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Tu-3  -   n°61</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Lu-3  -   n°62</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span>Lu-3  -   n°63</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-2') }));
  buf.push('><span>Tu-2  -   n°64</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-2') }));
  buf.push('><span>Lu-2  -   n°65</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-2') }));
  buf.push('><span>Lu-2  -   n°66</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Tu-3  -   n°67</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Tu-3  -   n°68</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span>Tu-3  -   n°69</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Tu-4  -   n°70</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Tu-4  -   n°71</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-4') }));
  buf.push('><span>Lu-4  -   n°72</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Tu-4  -   n°73</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Tu-4  -   n°74</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-4') }));
  buf.push('><span>Tu-4  -   n°75</span><br');
  buf.push(attrs({  }));
  buf.push('/></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"views/templates/editor": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div');
  buf.push(attrs({ 'id':('main'), "class": ('table-ly-wrpr') }));
  buf.push('><!-- boutons for the editor--><div');
  buf.push(attrs({ 'id':('divMainBtn'), "class": ('table-ly-hder') }));
  buf.push('><div');
  buf.push(attrs({ 'id':('generalBtnBar'), "class": ('btn-group') }));
  buf.push('><button');
  buf.push(attrs({ 'id':('EmptyTextBtn'), "class": ('btn') + ' ' + ('btn-small') + ' ' + ('btn-primary') }));
  buf.push('>Init texte vide  </button><button');
  buf.push(attrs({ 'id':('SimpleTextBtn'), "class": ('btn') + ' ' + ('btn-small') + ' ' + ('btn-primary') }));
  buf.push('>Init texte simple</button><button');
  buf.push(attrs({ 'id':('FullTextBtn'), "class": ('btn') + ' ' + ('btn-small') + ' ' + ('btn-primary') }));
  buf.push('>Init texte long</button><button');
  buf.push(attrs({ 'id':('logKeysBtn'), "class": ('btn') + ' ' + ('btn-small') + ' ' + ('btn-primary') }));
  buf.push('>Log keystrokes</button><button');
  buf.push(attrs({ 'id':('logRangeBtn'), "class": ('btn') + ' ' + ('btn-small') + ' ' + ('btn-primary') }));
  buf.push('>Log range</button><button');
  buf.push(attrs({ 'id':('printRangeBtn'), "class": ('btn') + ' ' + ('btn-small') + ' ' + ('btn-primary') }));
  buf.push('>Print Range</button><button');
  buf.push(attrs({ 'id':('addClass2LineBtn'), "class": ('btn') + ' ' + ('btn-small') + ' ' + ('btn-primary') }));
  buf.push('>Show Class on Lines</button></div><select');
  buf.push(attrs({ 'id':('contentSelect') }));
  buf.push('><option');
  buf.push(attrs({ 'value':("content-full"), 'style':("display:block") }));
  buf.push('>Full note</option><option');
  buf.push(attrs({ 'value':("content-full-marker"), 'style':("display:block") }));
  buf.push('>Tout en puces</option><option');
  buf.push(attrs({ 'value':("content-shortlines-marker"), 'style':("display:block") }));
  buf.push('>Tout en puce, lignes courtes</option><option');
  buf.push(attrs({ 'value':("content-shortlines-all"), 'style':("display:block") }));
  buf.push('>Puces et titres, lignes courtes</option><option');
  buf.push(attrs({ 'value':("content-empty"), 'style':("display:block") }));
  buf.push('>Empty note</option><option');
  buf.push(attrs({ 'value':("content-full-relative-indent"), 'style':("display:block") }));
  buf.push('>Avec sommaire</option><option');
  buf.push(attrs({ 'value':("test_1"), 'style':("display:block") }));
  buf.push('>Test numero 1</option><option');
  buf.push(attrs({ 'value':("test_2"), 'style':("display:block") }));
  buf.push('>Test numero 2</option><option');
  buf.push(attrs({ 'value':("test_3"), 'style':("display:block") }));
  buf.push('>Test numero 3</option><option');
  buf.push(attrs({ 'value':("test_4"), 'style':("display:block") }));
  buf.push('>Test numero 4</option><option');
  buf.push(attrs({ 'value':("test_5"), 'style':("display:block") }));
  buf.push('>Test numero 5</option><option');
  buf.push(attrs({ 'value':("test_6"), 'style':("display:block") }));
  buf.push('>Test numero 6</option><option');
  buf.push(attrs({ 'value':("test_7"), 'style':("display:block") }));
  buf.push('>Test numero 7</option><option');
  buf.push(attrs({ 'value':("test_8"), 'style':("display:block") }));
  buf.push('>Test numero 8</option><option');
  buf.push(attrs({ 'value':("test_9"), 'style':("display:block") }));
  buf.push('>Test numero 9</option><option');
  buf.push(attrs({ 'value':("test_10"), 'style':("display:block") }));
  buf.push('>Test numero 10</option><option');
  buf.push(attrs({ 'value':("test_11"), 'style':("display:block") }));
  buf.push('>Test numero 11</option></select><select');
  buf.push(attrs({ 'id':('cssSelect') }));
  buf.push('><option');
  buf.push(attrs({ 'value':("images/editor2.css"), 'style':("display:block") }));
  buf.push('>css1</option><option');
  buf.push(attrs({ 'value':("stylesheets/app.css"), 'style':("display:block") }));
  buf.push('>css2</option></select></div><div');
  buf.push(attrs({ 'id':('main-div'), "class": ('table-ly-ctnt') }));
  buf.push('><div');
  buf.push(attrs({ 'id':('col-wrap') }));
  buf.push('><div');
  buf.push(attrs({ 'id':('editor-col') }));
  buf.push('><div');
  buf.push(attrs({ 'id':('well-editor'), "class": ('monWell') }));
  buf.push('><div');
  buf.push(attrs({ 'id':('editorDiv'), "class": ('table-ly-wrpr') }));
  buf.push('><!-- boutons for the editor--><div');
  buf.push(attrs({ "class": ('table-ly-hder') }));
  buf.push('><div');
  buf.push(attrs({ 'id':('editorBtnBar'), "class": ('btn-group') }));
  buf.push('><button');
  buf.push(attrs({ 'id':('indentBtn'), "class": ('btn') + ' ' + ('btn-small') + ' ' + ('btn-primary') }));
  buf.push('>Indent</button><button');
  buf.push(attrs({ 'id':('unIndentBtn'), "class": ('btn') + ' ' + ('btn-small') + ' ' + ('btn-primary') }));
  buf.push('>Un-indent</button><button');
  buf.push(attrs({ 'id':('markerListBtn'), "class": ('btn') + ' ' + ('btn-small') + ' ' + ('btn-primary') }));
  buf.push('>- Marker list</button><button');
  buf.push(attrs({ 'id':('titleBtn'), "class": ('btn') + ' ' + ('btn-small') + ' ' + ('btn-primary') }));
  buf.push('>1.1.2 Title</button><button');
  buf.push(attrs({ 'id':('addClass'), "class": ('btn') + ' ' + ('btn-small') + ' ' + ('btn-primary') }));
  buf.push('>Class of sel Lines ON</button><button');
  buf.push(attrs({ 'id':('delClass'), "class": ('btn') + ' ' + ('btn-small') + ' ' + ('btn-primary') }));
  buf.push('>Class of sel Lines OFF</button><button');
  buf.push(attrs({ 'id':('checkBtn'), "class": ('btn') + ' ' + ('btn-small') + ' ' + ('btn-primary') }));
  buf.push('>Run Test !</button><button');
  buf.push(attrs({ 'id':('CozyMarkdown'), "class": ('btn') + ' ' + ('btn-small') + ' ' + ('btn-primary') }));
  buf.push('>Markdown</button></div></div><!-- text for the editor--><div');
  buf.push(attrs({ 'id':('editorContent'), "class": ('table-ly-ctnt') }));
  buf.push('><iframe');
  buf.push(attrs({ 'id':('editorIframe') }));
  buf.push('></iframe></div></div></div></div><div');
  buf.push(attrs({ 'id':('result-col') }));
  buf.push('><div');
  buf.push(attrs({ 'id':('well-result'), "class": ('monWell') }));
  buf.push('><div');
  buf.push(attrs({ 'id':('resultDiv'), "class": ('table-ly-wrpr') }));
  buf.push('><div');
  buf.push(attrs({ "class": ('table-ly-hder') }));
  buf.push('><div');
  buf.push(attrs({ 'id':('resultBtnBar'), "class": ('btn-group') }));
  buf.push('><button');
  buf.push(attrs({ 'id':('resultBtnBar_coller'), "class": ('btn') + ' ' + ('btn-small') + ' ' + ('btn-primary') }));
  buf.push('>Coller</button><button');
  buf.push(attrs({ "class": ('btn') + ' ' + ('btn-small') + ' ' + ('btn-primary') }));
  buf.push('>-</button><button');
  buf.push(attrs({ "class": ('btn') + ' ' + ('btn-small') + ' ' + ('btn-primary') }));
  buf.push('>-</button></div><p');
  buf.push(attrs({ 'id':('editorPropertiesDisplay') }));
  buf.push('></p></div><!-- text for the resulting html--><div');
  buf.push(attrs({ 'id':('resultContent'), "class": ('table-ly-ctnt') }));
  buf.push('><textarea');
  buf.push(attrs({ 'id':('resultText') }));
  buf.push('></textarea></div></div></div></div></div></div></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"views/templates/home": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  }
  return buf.join("");
  };
}});

window.require.define({"views/templates/test_1": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<!--premier titre--><div');
  buf.push(attrs({ "class": ('Tu-1') }));
  buf.push('><span>Tu-1</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-1') }));
  buf.push('><span>Lu-1</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><!--second titre--><div');
  buf.push(attrs({ "class": ('Tu-1') }));
  buf.push('><span>Tu-1</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-1') }));
  buf.push('><span>Lu-1</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-2') }));
  buf.push('><span>Tu-2</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-1') }));
  buf.push('><span>Lu-1</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><!--la div suivante ne peut pas être la fille du Tu-2 car un Lu-1 les sépare--><div');
  buf.push(attrs({ "class": ('Lu-2') }));
  buf.push('><span>Snif... je suis la ligne 7 et j\'ai pas le droit d\'être ici</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Th-1') }));
  buf.push('><span>Th-1</span><br');
  buf.push(attrs({  }));
  buf.push('/></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"views/templates/test_10": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div');
  buf.push(attrs({ "class": ('Th-1') }));
  buf.push('><span>Un premier titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-1') }));
  buf.push('><span');
  buf.push(attrs({ "class": ('truc') }));
  buf.push('>Une ligne Lh-1 </span><span');
  buf.push(attrs({ "class": ('bob') }));
  buf.push('>ENCORE Une ligne Lh-1 Une ligne Lh-1</span><a>toto</a><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-2') }));
  buf.push('><span');
  buf.push(attrs({ "class": ('bob') }));
  buf.push('>azertyuiop</span><span>Un second titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Th-3') }));
  buf.push('><span');
  buf.push(attrs({ "class": ('bob') }));
  buf.push('>azertyuiop</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-3') }));
  buf.push('><span');
  buf.push(attrs({ "class": ('truc') }));
  buf.push('>Une ligne Lh-1 </span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-2') }));
  buf.push('><span');
  buf.push(attrs({ "class": ('truc') }));
  buf.push('>Une ligne Lh-1 </span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-1') }));
  buf.push('><span');
  buf.push(attrs({ "class": ('truc') }));
  buf.push('>Une ligne Lh-1 </span><br');
  buf.push(attrs({  }));
  buf.push('/></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"views/templates/test_11": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div');
  buf.push(attrs({ "class": ('Th-1') }));
  buf.push('><span>Un premier titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-1') }));
  buf.push('><span');
  buf.push(attrs({ "class": ('truc') }));
  buf.push('>Une ligne Lh-1 </span><span');
  buf.push(attrs({ "class": ('bob') }));
  buf.push('>ENCORE Une ligne Lh-1 Une ligne Lh-1</span><a>toto</a><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-2') }));
  buf.push('><span');
  buf.push(attrs({ "class": ('bob') }));
  buf.push('>azertyuiop</span><span>Un second titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-3') }));
  buf.push('><span');
  buf.push(attrs({ "class": ('bob') }));
  buf.push('>azertyuiop</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-3') }));
  buf.push('><span');
  buf.push(attrs({ "class": ('truc') }));
  buf.push('>Une ligne Lh-1 </span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-2') }));
  buf.push('><span');
  buf.push(attrs({ "class": ('truc') }));
  buf.push('>Une ligne Lh-1 </span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-1') }));
  buf.push('><span');
  buf.push(attrs({ "class": ('truc') }));
  buf.push('>Une ligne Lh-1 </span><br');
  buf.push(attrs({  }));
  buf.push('/></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"views/templates/test_2": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div');
  buf.push(attrs({ "class": ('Tu-1') }));
  buf.push('><span>Tu-1</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-1') }));
  buf.push('><span>Tu-1</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-1') }));
  buf.push('><span>Lu-1</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><!-- une Lo ne peut pas être fille d\'un Tu--><div');
  buf.push(attrs({ "class": ('Lo-1') }));
  buf.push('><span>Je suis une Lo fautive</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Th-1') }));
  buf.push('><span>UN SUPER TITRE</span><br');
  buf.push(attrs({  }));
  buf.push('/></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"views/templates/test_3": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div');
  buf.push(attrs({ "class": ('Tu-1') }));
  buf.push('><span>Tu-1...</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-1') }));
  buf.push('><span>Tu-1...</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-1') }));
  buf.push('><span>Lu-1</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><!-- une lh ne peut pas descendre d\'une Tu--><div');
  buf.push(attrs({ "class": ('Lh-1') }));
  buf.push('><span>Une ligne qui n\'a pas le droit d\'être ici car c\'est une Lh</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Th-1') }));
  buf.push('><span>UN SUPER TITRE</span><br');
  buf.push(attrs({  }));
  buf.push('/></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"views/templates/test_4": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div');
  buf.push(attrs({ "class": ('Tu-1') }));
  buf.push('><span>Une ligne Tu-1...</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lu-1') }));
  buf.push('><span>Une ligne Lu-1</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Tu-2') }));
  buf.push('><span>Un sous-titre Tu-2</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('To-2') }));
  buf.push('><span>Un sous-titre To-2</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><!-- un titre Th ne peut pas descendre d\'un Tu ou d\'un To--><div');
  buf.push(attrs({ "class": ('Th-2') }));
  buf.push('><span>Un titre Th-2 qui n\'a pas le droit d\'être là</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Th-1') }));
  buf.push('><span>UN SUPER TITRE</span><br');
  buf.push(attrs({  }));
  buf.push('/></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"views/templates/test_5": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div');
  buf.push(attrs({ "class": ('Th-1') }));
  buf.push('><span>Un premier titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-1') }));
  buf.push('><span>Une ligne Lh-1 </span><span>ENCORE Une ligne Lh-1 Une ligne Lh-1</span><a>toto</a><br');
  buf.push(attrs({  }));
  buf.push('/></div><!-- and poof, an unknown label--><div');
  buf.push(attrs({ "class": ('To-2') }));
  buf.push('><span>azertyuiop</span><span>m</span><label></label><span>Un second titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"views/templates/test_6": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div');
  buf.push(attrs({ "class": ('Th-1') }));
  buf.push('><span>Un premier titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-1') }));
  buf.push('><span>Une ligne Lh-1 </span><span>ENCORE Une ligne Lh-1 Une ligne Lh-1</span><a>toto</a><br');
  buf.push(attrs({  }));
  buf.push('/></div><!--label with a br in the middle of nowhere--><div');
  buf.push(attrs({ "class": ('To-2') }));
  buf.push('><span>azertyuiop</span><span>m</span><br');
  buf.push(attrs({  }));
  buf.push('/><span>Un second titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-1') }));
  buf.push('><span>Une ligne Lh-1 </span><span>ENCORE Une ligne Lh-1 Une ligne Lh-1</span><a>toto</a><br');
  buf.push(attrs({  }));
  buf.push('/></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"views/templates/test_7": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div');
  buf.push(attrs({ "class": ('Th-1') }));
  buf.push('><span>Un premier titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-1') }));
  buf.push('><span>Une ligne Lh-1 </span><span>ENCORE Une ligne Lh-1 Une ligne Lh-1</span><a>toto</a><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('To-2') }));
  buf.push('><span>azertyuiop</span><span>m</span><span>Un second titre</span></div><!--a br should be there -->');
  }
  return buf.join("");
  };
}});

window.require.define({"views/templates/test_8": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div');
  buf.push(attrs({ "class": ('Th-1') }));
  buf.push('><span>Un premier titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-1') }));
  buf.push('><span');
  buf.push(attrs({ "class": ('truc') }));
  buf.push('>Une ligne Lh-1 </span><span');
  buf.push(attrs({ "class": ('bob') }));
  buf.push('>ENCORE Une ligne Lh-1 Une ligne Lh-1</span><a>toto</a><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('To-2') }));
  buf.push('><span');
  buf.push(attrs({ "class": ('bob') }));
  buf.push('>azertyuiop</span><span');
  buf.push(attrs({ "class": ('bob') }));
  buf.push('>m</span><span>Un second titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"views/templates/test_9": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div');
  buf.push(attrs({ "class": ('Th-1') }));
  buf.push('><span>Un premier titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-1') }));
  buf.push('><span');
  buf.push(attrs({ "class": ('truc') }));
  buf.push('>Une ligne Lh-1 </span><span');
  buf.push(attrs({ "class": ('bob') }));
  buf.push('>ENCORE Une ligne Lh-1 Une ligne Lh-1</span><a>toto</a><br');
  buf.push(attrs({  }));
  buf.push('/></div><!-- an obvious issue of indentation--><div');
  buf.push(attrs({ "class": ('To-3') }));
  buf.push('><span');
  buf.push(attrs({ "class": ('bob') }));
  buf.push('>azertyuiop</span><span>Un second titre</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-2') }));
  buf.push('><span');
  buf.push(attrs({ "class": ('bob') }));
  buf.push('>azertyuiop</span><br');
  buf.push(attrs({  }));
  buf.push('/></div><div');
  buf.push(attrs({ "class": ('Lh-1') }));
  buf.push('><span');
  buf.push(attrs({ "class": ('truc') }));
  buf.push('>Une ligne Lh-1 </span><br');
  buf.push(attrs({  }));
  buf.push('/></div>');
  }
  return buf.join("");
  };
}});

