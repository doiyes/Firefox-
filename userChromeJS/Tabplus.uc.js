// ==UserScript==
// @name           Tabplus.uc.js
// @description    设置标签的打开方式
// @update         2019-09-23
// @update         2019-09-14
// @update         2018-04-20
// @license          MIT License
// @compatibility  Firefox 70+
// @charset         UTF-8
// @include       chrome://browser/content/browser.xhtml
// @include      chrome://browser/content/browser.xul
// ==/UserScript==


//01. 自动切换到鼠标移动到的标签页 
((g, w) => {
  class TabPlus {
    constructor() {
      this.SelectedTabOnMouseover();
    }
    SelectedTabOnMouseover(timeout) {
      g.tabContainer.addEventListener('mouseover', e => {
        const tab = e.target.closest('.tabbrowser-tab');
        if (!tab) return;
        timeout = setTimeout(() => g.selectedTab = tab, 150);
      }, false);
      g.tabContainer.addEventListener('mouseout', () => clearTimeout(timeout), false);
    }
  }
  new TabPlus();
})(gBrowser, window);



// 05. 标签栏鼠标滚轮切换标签页 
/*
(function() {
  if (!location.href.startsWith('chrome://browser/content/browser.x'))
    return;
  const scrollRight = true;
  const wrap = true;
  gBrowser.tabContainer.addEventListener("wheel", function(event) {
    let dir = (scrollRight ? 1 : -1) * Math.sign(event.deltaY);
    setTimeout(function() {
      gBrowser.tabContainer.advanceSelectedTab(dir, wrap);
    }, 0);
  }, true);
})();
*/



// 06. 在新标签页查看图片 
location.href.startsWith('chrome://browser/content/browser.x') && (function () {
    document.querySelector("#context-viewimage").setAttribute("oncommand", 'openTrustedLinkIn(gContextMenu.imageURL,"tab")');
})();




// 07. 鼠标移动到地址栏和搜索栏时自动全选里面的文字
/* {if (location == "chrome://browser/content/browser.xul") {
// 地址栏
var autselectpulbar = document.getElementById("urlbar-container");
autselectpulbar.addEventListener("mouseover", function(event){
            if(event.target.compareDocumentPosition(document.activeElement)!= 20)
                   event.target.select();
    }, false);

// 搜索栏
var autselectpsearchbar = document.getElementById("searchbar");
 autselectpsearchbar.addEventListener("mouseover", function(event){
           if(event.target.compareDocumentPosition(document.activeElement)!= 20)
                   event.target.select();
}, false);
}
};
*/

//08.  关闭标签页后选择左侧标签   
(function () {
  gBrowser.tabContainer.addEventListener("TabClose", tabCloseHandler, false);
  function tabCloseHandler(event) {
    var tab = event.target;
    gBrowser.selectedTab = tab;
    if (gBrowser.selectedTab._tPos != 0) {
      gBrowser.tabContainer.advanceSelectedTab(-1, true);
    }
  }
})();




//09.  在当前标签页右侧打开新标签页 
(function () {
    if (!location.href.startsWith('chrome://browser/content/browser.x'))
        return;
    gBrowser.tabContainer.addEventListener("TabOpen", tabOpenHandler, false);
    gBrowser.tabContainer.addEventListener("TabClose", tabCloseHandler, false);

		function tabOpenHandler(event) {
			var tab = event.target;
			gBrowser.moveTabTo(tab, gBrowser.selectedTab._tPos + 1);
		}
    function tabCloseHandler(event) {
        var tab = event.target;
      // 如果是因下载而产生的空白页
      if (tab.linkedBrowser.documentURI.spec == 'about:blank') return;
      if (tab._tPos <= gBrowser.selectedTab._tPos){
          if (tab.previousSibling) {
            gBrowser.selectedTab = tab.previousSibling;
        	}
      }
    }
})();





// 10. 搜索后自动清除搜索栏内容 
(function () {
  if (BrowserSearch.searchBar && BrowserSearch.searchBar.textbox) {
            BrowserSearch.searchBar.textbox.addEventListener("blur", function () {
                this.value = "";
            }, !1);
        }
})();



// 11. 失出焦点自动关闭查找栏 
(function() {
	function closeFindbar(e) {
		if (!gFindBar.hidden) {
			if (e.target.id != "findbar-container") {
				gFindBar.close();
			}
		}
	}
	addEventListener('blur', closeFindbar, false);
})();



// 12. 左键点击书签菜单不自动关闭 
location.href.startsWith('chrome://browser/content/browser.x') && document.querySelector("#personal-bookmarks").addEventListener("mouseover", function (event) {
    event.originalTarget.classList.contains("bookmark-item") && event.originalTarget.setAttribute('closemenu', "none")
}, true);







//14.  新标签打开侧边栏历史页面 
(function() {
    if (!location.href.startsWith('chrome://browser/content/browser.x'))
    return;

  eval('PlacesUIUtils.openNodeWithEvent = '  + PlacesUIUtils.openNodeWithEvent.toString()
    .replace(' && PlacesUtils.nodeIsBookmark(aNode)', '')
    .replace('getBrowserWindow(window)', 
      '(window && window.document.documentElement.getAttribute("windowtype") == "navigator:browser") ? window : BrowserWindowTracker.getTopWindow()')
  );

  let onPopupshowing = function() {
    let historyMenu = document.getElementById('history-menu');
    if (!historyMenu._placesView) {
      new HistoryMenu(event);
      historyMenu._placesView._onCommand = function HM__onCommand(aEvent) {
        let placesNode = aEvent.target._placesNode;
        if (placesNode) {
          PlacesUIUtils.openNodeWithEvent(placesNode, aEvent);
        };
      };
    };
  };

  let historyPopup = document.getElementById('goPopup');
  historyPopup.setAttribute('onpopupshowing', '(' + onPopupshowing.toString() + ')()');

})();


