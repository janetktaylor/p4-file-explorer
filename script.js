global.$ = $;

var remote = require('remote');
var Menu = remote.require('menu');
var BrowserWindow = remote.require('browser-window');
var MenuItem = remote.require('menu-item');
var shell = require('shell');
var p4 = require('node-perforce');

var abar = require('address_bar');
var folder_view = require('folder_view');
var info_bar = require('file_info_bar');


// append default actions to menu for OSX
var initMenu = function () {
    var nativeMenuBar = new Menu();
    if (process.platform == "darwin") {
      nativeMenuBar.createMacBuiltin && nativeMenuBar.createMacBuiltin("FileExplorer");
    }

};

var aboutWindow = null;
var App = {
  // show "about" window
  about: function () {
    var params = {toolbar: false, resizable: false, show: true, height: 150, width: 400};
    aboutWindow = new BrowserWindow(params);
    aboutWindow.loadUrl('file://' + __dirname + '/about.html');
  },

  // change folder for sidebar links
  cd: function (anchor) {
    anchor = $(anchor);

    $('#sidebar li').removeClass('active');
    $('#sidebar i').removeClass('icon-white');

    anchor.closest('li').addClass('active');
    anchor.find('i').addClass('icon-white');

    this.setPath(anchor.attr('nw-path'));
  },

  // set path for file explorer
  setPath: function (path) {
    if (path.indexOf('~') == 0) {
      path = path.replace('~', process.env['HOME']);
    }
    this.folder.open(path);
    this.addressbar.set(path);
  }
};

$(document).ready(function() {
  initMenu();

  var folder = new folder_view.Folder($('#files'));
  var addressbar = new abar.AddressBar($('#addressbar'));
  var infobar = new info_bar.InfoBar( $('#infobar'));

  var setStartDir = function(err, p4info){
    App.clientRoot = p4info.clientRoot;

    folder.open(App.clientRoot);
    addressbar.set(App.clientRoot);
  }

  p4.info(setStartDir);

  App.folder = folder;
  App.addressbar = addressbar;
  App.infobar = infobar;

  folder.on('navigate', function(dir, mime) {
    if (mime.type == 'folder') {
      addressbar.enter(mime);
    } else {
      shell.openItem(mime.path);
    }
  });

  addressbar.on('navigate', function(dir) {
    folder.open(dir);
  });

  // when I click on a file, show its attributes in the right pane
  folder.on('currclick', function(f, mime) {
    infobar.set(f);
  })

  // sidebar favorites
  $('[nw-path]').bind('click', function (event) {
    event.preventDefault();
    App.cd(this);
  });
});
