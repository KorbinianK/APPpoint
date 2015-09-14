/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
  var currentUser = Parse.User.current();
(function (document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  app.displayInstalledToast = function () {
    document.querySelector('#caching-complete')
      .show();
  };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function () {});



  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function () {
    // imports are loaded and elements have been registered
  });




  // Main area's paper-scroll-header-panel custom condensing transformation of
  // the appName in the middle-container and the bottom title in the bottom-container.
  // The appName is moved to top and shrunk on condensing. The bottom sub title
  // is shrunk to nothing on condensing.
  addEventListener('paper-header-transform', function (e) {
    var appName = document.querySelector('.app-name');
    var middleContainer = document.querySelector('.middle-container');
    var bottomContainer = document.querySelector('.bottom-container');
    var detail = e.detail;
    var heightDiff = detail.height - detail.condensedHeight;
    var yRatio = Math.min(1, detail.y / heightDiff);
    var maxMiddleScale = 0.50; // appName max size when condensed. The smaller the number the smaller the condensed size.
    var scaleMiddle = Math.max(maxMiddleScale, (heightDiff - detail.y) / (heightDiff / (1 - maxMiddleScale)) + maxMiddleScale);
    var scaleBottom = 1 - yRatio;

    // Move/translate middleContainer
    Polymer.Base.transform('translate3d(0,' + yRatio * 100 + '%,0)', middleContainer);

    // Scale bottomContainer and bottom sub title to nothing and back
    Polymer.Base.transform('scale(' + scaleBottom + ') translateZ(0)', bottomContainer);

    // Scale middleContainer appName
    Polymer.Base.transform('scale(' + scaleMiddle + ') translateZ(0)', appName);
  });

  // Close drawer after menu item is selected if drawerPanel is narrow
  app.onMenuSelect = function () {
    var drawerPanel = document.querySelector('#paperDrawerPanel');
    if (drawerPanel.narrow) {
      drawerPanel.closeDrawer();
    }
  };

  app.isEqual = function (x, y) {
    return x === y;
  };

  app.currentUser = function (usr) {
    if (currentUser = !null) {
      // console.log("admin");
      return currentUser;
    } else {

      return null;

    }
  }
  app.isAdmin = function (usr) {
    var currentUser = Parse.User.current();
    if (currentUser != null) {
      if (currentUser.get("isAdmin") === true) {
        return true;
      } else {
        return false;
      }
    }
  }
  app.isDocent = function (usr) {
    var currentUser = Parse.User.current();
    if (currentUser != null) {
      if (currentUser.get("isTeacher") === true) {
        return true;
      } else {
        return false;
      }
    }
  }
  app.isUser = function (usr) {
    var currentUser = Parse.User.current();
    if (currentUser != null) {
      if (currentUser.get("isTeacher") === false && currentUser.get("isAdmin") === false) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

})(document);

function objSort() {
  var args = arguments,
    array = args[0],
    case_sensitive, keys_length, key, desc, a, b, i;

  if (typeof arguments[arguments.length - 1] === 'boolean') {
    case_sensitive = arguments[arguments.length - 1];
    keys_length = arguments.length - 1;
  } else {
    case_sensitive = false;
    keys_length = arguments.length;
  }

  return array.sort(function (obj1, obj2) {
    for (i = 1; i < keys_length; i++) {
      key = args[i];
      if (typeof key !== 'string') {
        desc = key[1];
        key = key[0];
        a = obj1[args[i][0]];
        b = obj2[args[i][0]];
      } else {
        desc = false;
        a = obj1[args[i]];
        b = obj2[args[i]];
      }

      if (case_sensitive === false && typeof a === 'string') {
        a = a.toLowerCase();
        b = b.toLowerCase();
      }

      if (!desc) {
        if (a < b) return -1;
        if (a > b) return 1;
      } else {
        if (a > b) return -1;
        if (a < b) return 1;
      }
    }
    return 0;
  });
}
