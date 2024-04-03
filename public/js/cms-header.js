document.addEventListener("DOMContentLoaded", function() {

  /** @polyfills section */
  (function(doc, proto) {
    try { // check if browser supports :scope natively
      doc.querySelector(':scope body');
    } catch (err) { // polyfill native methods if it doesn't
      ['querySelector', 'querySelectorAll'].forEach(function(method) {
        var nativ = proto[method];
        proto[method] = function(selectors) {
          if (/(^|,)\s*:scope/.test(selectors)) { // only if selectors contains :scope
            var id = this.id; // remember current element id
            this.id = 'ID_' + Date.now(); // assign new unique id
            selectors = selectors.replace(/((^|,)\s*):scope/g, '$1#' + this.id); // replace :scope with #ID
            var result = doc[method](selectors);
            this.id = id; // restore previous id
            return result;
          } else {
            return nativ.call(this, selectors); // use native code for other selectors
          }
        }
      });
    }
  })(window.document, Element.prototype);

  /** @predefined variables section */
  var stickyFrom = 90;
  var removeStickyFrom = 50;
  var mobileBreakpoint = 767;
  var sidebarAddWidth = 400;
  var sidebarLeftExtra = 50;
  var offset = 0;
  var offsetStep = 100;
  var arrowIconOffset = 33;
  var globalFocus = null;
  var oldMobileValues = []; // for old titles & menu levels
  /** section end */

  /** @general variables section */
  var documentBody = document && document.body;
  var header = document.querySelector(".cms-header");
  var localNav = document.querySelector(".cms-nav");

  if (!header) {
    return;
  }

  /** @gridMenu variables section */
  var gridMenuBtn = document.getElementById("cms_global_nav");
  var closeMenuBtn = document.getElementById("cms_global_nav_close");
  var sliderMenu = document.querySelector(".cms-global-nav-slider");
  var isGridMenuOpen = false;
  /** section end */

  /** @popups variables section */
  var popups = document.getElementsByClassName("cms-popup"); // get all popups
  
  var navigationItemTemplate = document.getElementById(
    "cms_global_nav-item_template"
  );
  /** section end */

  /** @accordion variables section */
  var accordions = document.getElementsByClassName("cms-nav-menu--lvl-1")[0]
    .children;
  var leftSideNav = document.querySelector(".cms-nav-menu--lvl-1");
  /** section end */

  /** @mobile variables section */
  // get mobile close buttons
  var hamburgerMenu = document.getElementById("cms_mobile_menu");
  var showHamburgerMenuBtn = document.getElementById("cms_show_mobile_menu");
  var mobileClosePopup = document.getElementsByClassName(
    "cms-popup-close-button"
  );
  var mobileBackBtn = document.getElementsByClassName("cms-popup-back-button");
  var mobileMenu = document.getElementById("cms_mobile_menu");
  var mobileMenuLevel = document.querySelector(".cms-mobile-menu-menu");
  var mobileMenuSlider = document.querySelector(".cms-slide-menu-slider");
  var mobileMenuTitle = document.querySelector(".cms-mobile-menu-title");

  setBrowserClass();

  /** @events assign section */
  if (document && window) {
    document.addEventListener("click", returnFocusHandler);
    window.addEventListener("resize", onWindowResize, true);
    window.addEventListener("scroll", onWindowScroll);
    localNav && localNav.addEventListener("click", onLocalNavPanelClick);
    sliderMenu && sliderMenu.addEventListener("keydown", onGlobalNavClick);
    if (leftSideNav) {
      leftSideNav.addEventListener("click", onLeftSideClick);
      leftSideNav.addEventListener("keydown", onLeftSideClick);
    }
    gridMenuBtn && gridMenuBtn.addEventListener("click", toggleGlobalNav);
    closeMenuBtn && closeMenuBtn.addEventListener("click", toggleGlobalNav);
    showHamburgerMenuBtn &&
      showHamburgerMenuBtn.addEventListener("click", showHamburgerMenu);
    mobileMenu && mobileMenu.addEventListener("click", onMobileMenuItemClicked);
  }
  /** section end */

  /** @get methods section */
  function getWindowWidth() {
    if (window) return window.innerWidth;
  }

  function getSidebarWidth() {
    if (window)
      return gridMenuBtn.getBoundingClientRect().left + sidebarAddWidth;
  }

  function scrollUp () {
    document.animate({ scrollTop: 0 }, 300);
    documentBody.animate({ scrollTop: 0 }, 300);
  };

  /** section end */

  /** @set methods section */
  function getIsMobile() {
    // return isMobile
    var _isMobile = getWindowWidth() <= mobileBreakpoint;
    return _isMobile;
  }

  function setOffset(type, element) {
    var _newOffset, _newOffsetTitle;
    switch (type) {
      case "right":
        offset = offset + offsetStep;
        break;
      case "left":
        offset = offset - offsetStep;
        break;
      default:
        offset = 0;
        break;
    }

    _newOffset = "translateX(-" + offset + "%)";
    _newOffsetTitle = "translateX(" + offset + "%)";
    mobileMenuTitle.style.transform = _newOffsetTitle;
    element
      ? (element.style.transform = _newOffset)
      : (mobileMenuTitle.parentElement.style.transform = _newOffset);
  }

  function setMobileMenuHeight(element) {
  }
  
  function setHeightForMobileMenuList() {
        var mobileMenuTitleHeight = document.querySelectorAll('.cms-mobile-menu-title')[0].offsetHeight || 0;
        var mobileMenuListWrapper = document.querySelectorAll('.cms-mobile-menu-menu')[0];
        var mobileMenuListLevel2 = document.querySelectorAll('.cms-slide-menu--lvl-2:not(.hide)')[0];
        var mobileMenuListLevel3 = document.querySelectorAll('.cms-mobile-menu-menu--lvl-3:not(.hide)')[0];

        var subtrahend =  mobileMenuTitleHeight;
        var heightValue = "calc(100vh - " + subtrahend + "px)";

        if(mobileMenuListWrapper) {
          mobileMenuListWrapper.style.height = heightValue;
          mobileMenuListWrapper.style.maxHeight = heightValue;
        }

        if(mobileMenuListLevel2) {
          mobileMenuListLevel2.style.height = heightValue;
          mobileMenuListLevel2.style.maxHeight = heightValue;
        }

        if(mobileMenuListLevel3) {
          mobileMenuListLevel3.style.height = heightValue;
          mobileMenuListLevel3.style.maxHeight = heightValue;
        }
    }
  /** section end */

  /** @utility methods section */
  function removeSidebarWidth() {
    sliderMenu.style.cssText = null;
  }

  function addOverflowMobile() {
    var windowWidth = window.innerWidth;
    if (windowWidth <= mobileBreakpoint) {
      documentBody.classList.add("overflow-hidden");
    }
  }

  function removeOverflowMobile() {
    var windowWidth = window.innerWidth;
    if (windowWidth <= mobileBreakpoint) {
      documentBody.classList.remove("overflow-hidden");
    }
  }

  // back to first level at mobile
  function backToFirstLevel() {
    mobileMenuLevel.classList.remove("unsetOverflow");
    mobileMenuTitle
      .querySelector(".cms-popup-back-button")
      .classList.add("hide");
  }

  // remove transform: translate from multi-level menu
  function resetMobileMenu() {
    setOffset(null, null);
    // set default title and erase oldValues array
    if (oldMobileValues && oldMobileValues.length > 0) {
      mobileMenuTitle.firstElementChild.textContent = oldMobileValues[0].title;
      for (var _i = 0; _i < oldMobileValues.length; _i++) {
        oldMobileValues[_i].level.classList.add("hide");
      }
      oldMobileValues = [];
    }
    backToFirstLevel();
  }

  function hideGlobalNav(shouldSaveOverlay) {
    if (!isGridMenuOpen) return;
    isGridMenuOpen = false;
    sliderMenu.classList.remove("show-global-navigation");
    sliderMenu.classList.add("hide-global-navigation");
    removeSidebarWidth();
  }

  // hide inner levels of accordion
  function hideLevelsRecursively(level, accordion) {
    var _level = "cms-nav-menu--lvl-" + level;
    var _innerAccordions = accordion.getElementsByClassName(_level);
    if (_innerAccordions && _innerAccordions.length > 0) {
      for (var _i = 0; _i < _innerAccordions.length; _i++) {
        if (!_innerAccordions[_i].classList.contains("hide")) {
          _innerAccordions[_i].previousElementSibling.classList.remove(
            "cms-menu-link-open"
          );
          _innerAccordions[_i].classList.add("hide");
        }
      }
    } else {
      // base case
      return;
    }
    return hideLevelsRecursively(level + 1, accordion);
  }

  function checkMenuLevel(level, type) {
    var _level; // mobile menu level
    if (type === "object" && level.length > 0) {
      _level = level[level.length - 1].level;
    } else if (type === "node") {
      _level = level;
    }
  }

  function moveSliderForward(element, newTitle, newLevel) {
    // set offset for block and title
    setOffset("right", element);
    // save old title & new element reference
    oldMobileValues.push({
      title: mobileMenuTitle.firstElementChild.textContent,
      level: newLevel
    });
    // and set new one
    mobileMenuTitle.firstElementChild.textContent = newTitle;
    checkMenuLevel(newLevel, "node");
    setMobileMenuHeight(element);

    // show back button
    mobileMenuTitle
      .querySelector(".cms-popup-back-button")
      .classList.remove("hide");
     setHeightForMobileMenuList();
  }

  function moveSliderBackward(element) {
    // save old values and pop from stack at the same time
    var _oldReferences = oldMobileValues.pop();
    // set offset for block and title
    setOffset("left", element);
    // set old title and hide level
    mobileMenuTitle.firstElementChild.textContent = _oldReferences.title;
    _oldReferences.level.classList.add("hide");
    checkMenuLevel(oldMobileValues, "object");
    // hide back button if main screen and back to first level
    !offset && backToFirstLevel();
    // should investigate with only css mock data
    setMobileMenuHeight(element);
      setHeightForMobileMenuList();
  }

  function addStickyHeader() {
    header.classList.add("cms-sticky-header");
  }

  function removeStickyHeader() {
    header.classList.remove("cms-sticky-header");
  }

  // helper for form input
  function elementInputToggler(type, element, newValue, classToToggle) {
    if (type === "add") {
      element.firstElementChild.value = newValue;
      element.lastElementChild.classList.add(classToToggle);
    } else if (type === "remove") {
      element.firstElementChild.value = newValue;
      element.lastElementChild.classList.remove(classToToggle);
    }
  }

  /** event @functions sections */
  function onWindowResize() {
    // set isMobile and exit if it is
    if (getIsMobile()) {
      return;
    } else {
      // if tab navigation was enabled
      if (enableTabNavigation) {
        globalFocus = document.activeElement;
      }
      checkStickyHeader();
    }
    if (!isGridMenuOpen) return;
  }

  function returnFocusHandler() {
    if (globalFocus) {
      globalFocus.focus();
    }

    hideAccordionLevels();
  }

  function onWindowScroll() {
    checkStickyHeader();
  }

  // for sticky header
  function checkStickyHeader() {
    var _screenTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    if (_screenTop > stickyFrom) {
      isSticky = true;
      addStickyHeader();
    }
    if (_screenTop < removeStickyFrom) {
      isSticky = false;
      removeStickyHeader();
    }
  }
  
  // toggle global nav
  function toggleGlobalNav() {
    event.preventDefault(); // prevent native behavior
    sliderMenu.classList.toggle("show-global-navigation");
    documentBody.classList.toggle("overflow-hidden");

    // set new width and toggle variables
    isGridMenuOpen = !isGridMenuOpen;

    if (isGridMenuOpen) {
      sliderMenu.classList.remove("hide-global-navigation");
      turnOnPopupFocus("show-global-navigation", focusable, "default");
    } else {
      sliderMenu.classList.add("hide-global-navigation");
      removeSidebarWidth(); // clear width and left
      turnOffPopupFocus(gridMenuBtn, false);
    }
  }

  function onGlobalNavClick($event) {
    if (!enableTabNavigation || $event.target.id === 'cms_global_nav_close') return;
    if (pressedKeyHandler($event, "Space") ) {
      redirectByLink($event);
    }
  }

  // mobile slide menu handler
  function onMobileMenuItemClicked($event) {
    // local variables
    var _target = $event.target;
    var _parent = $event.target.parentElement;
    var _grandParent = $event.target.parentElement.parentElement;
    var _newTitle, _newLevel;
    var _currentLevel;
      // if <li> was clicked
      if (_target.classList.contains("cms-mobile-menu-sub-nav")) {
          _currentLevel = _parent;
          // get new title & element
          _newTitle = _target.querySelector(".cms-mobile-menu-link")
              .firstElementChild.textContent;
          _newLevel = _target.lastElementChild;
          _newLevel.classList.remove("hide");
          _currentLevel.classList.add("unsetOverflow");
          moveSliderForward(mobileMenuSlider, _newTitle, _newLevel);
          //if <label> was clicked
      } else if (
          _grandParent.classList.contains("cms-mobile-menu-sub-nav") &&
          _parent.nextElementSibling
      ) {
          _currentLevel = _grandParent.parentElement;
          _newLevel = _grandParent.lastElementChild;
          _newTitle = _target.textContent;
          _newLevel.classList.remove("hide");
          _currentLevel.classList.add("unsetOverflow");
          moveSliderForward(mobileMenuSlider, _newTitle, _newLevel);
      }

  }

  // toggle nested level
  function toggleAccordionMenu($event) {
    // local/scoped variables
    var _level, _parent, _grandParent, _isHideClassExist;
    if (enableTabNavigation && $event.type === "keydown") {
      if (
        !pressedKeyHandler($event, "Enter") &&
        !pressedKeyHandler($event, "Space")
      ) {
        // return if not specified keyboard button was pressed
        return;
      } else {
        event.stopPropagation(); // stop propagation
        event.preventDefault();
        if (
          (!$event.target.parentElement.classList.contains("cms-accordion") &&
            $event.target.classList.contains("cms-nav-link"))
        ) {
          redirectByLink($event);
        }

        _level = $event.target;
        _parent = _level.parentElement.classList.contains("cms-accordion")
          ? _level.parentElement
          : _level;
        _grandParent = _level.parentElement;
      }
    } else {
      event.stopPropagation(); // stop propagation
      _level = $event.target.parentElement.classList.contains(
        "cms-nav-link"
      )
        ? $event.target.parentElement
        : $event.target;
      _parent = _level.parentElement;
      _grandParent = _level.parentElement.parentElement;
    }
    // hide global nav
    hideGlobalNav(false);
    // first level
    if (_grandParent === leftSideNav) {
      _isHideClassExist = _parent.lastElementChild.classList.contains("hide")
        ? true
        : false;
      hideAccordionLevels(); // close opened one's first
      _parent.querySelector(".cms-nav-dropdown").classList.toggle("hide");
      // case for toggling
      if (!_isHideClassExist) {
        _parent.querySelector(".cms-nav-dropdown").classList.add("hide");
      } else {
        !_parent
          .querySelector(".cms-nav-dropdown")
          .classList.contains("hide");
      }
      // for others - toggle nested level and rotate arrow
    } else if (_parent.classList.contains("cms-accordion")) {
      _level.classList.toggle("cms-menu-link-open");
      _level.nextElementSibling.classList.toggle("hide");
      if (_level.classList.contains("cms-menu-link-open")) {
        focusCycleSetter(
          "cms-accordion",
          focusableAccordion,
          "accordion",
          _parent
        );
      } else {
        focusCycleSetter(
          "cms-accordion",
          focusableAccordion,
          "accordion",
          _parent.parentElement.parentElement
        );
      }
    }
  }

  // overflow check
  function checkOverflowAfterHamburgerClick() {
    if(!documentBody.classList.contains('overflow-hidden')) {
      addOverflowMobile();
    }
  }

  // show hamburger menu
  function showHamburgerMenu() {
    event.preventDefault(); // prevent native behavior
    addOverflowMobile();
    checkOverflowAfterHamburgerClick();
    hamburgerMenu.classList.remove("hide");
    initMobileMenuHeight();
  }

  // mobile back button
  function backToPrevious($event) {
    event.preventDefault();
    var _grandParent = $event.currentTarget.parentElement.parentElement;
    
    if (
      $event.currentTarget &&
      _grandParent.classList.contains("cms-slide-menu-slider")
    ) {
      moveSliderBackward(_grandParent);
    }
  }

  function redirectByLink($event, $target) {
    var _item = $target || $event.target;
    if (_item.tagName === "A") {
      _item.click();
    }
    $event.preventDefault();
  }

  function onLeftSideClick($event) {
    if ($event.type !== "keydown") {
      $event.stopPropagation();
      hideAllPopups(null);
    } else if (pressedKeyHandler($event, "Space")) {
      redirectByLink($event);
    }
  }

  function onLocalNavPanelClick($event) {
    $event.stopPropagation();
    if ($event.target.classList.contains("layout")) {
      hideAllPopups(null);
      return;
    }

    // hideAllPopups(null);
  }

  function hideAccordionLevels() {
    for (var _i = 0; _i < accordions.length; _i++) {
      if (
        accordions[_i].querySelector(".cms-nav-dropdown") &&
        !accordions[_i]
          .querySelector(".cms-nav-dropdown")
          .classList.contains("hide")
      ) {
        hideLevelsRecursively(10, accordions[_i]);
        accordions[_i]
          .querySelector(".cms-nav-dropdown")
          .classList.add("hide");
      }
    }
  }

  // add class to list of HTML Collection
  function addClassToNodes(nodes, classForAdd, exception) {
    for (var i = 0; i < nodes.length; i++) {
      if (!exception || nodes[i] !== exception) {
        nodes[i].classList.add(classForAdd);
      }
    }
  }

  // hide all popups
  function hideAllPopups(exception) {
    documentBody.classList.remove("overflow-hidden");
  }

  // hide popups on mobile
  function closeMobilePopups() {
    event.preventDefault();
    event.stopPropagation(); // stop propogation
    addClassToNodes(popups, "hide"); // add 'hide' class to all popups
    resetMobileMenu();
    removeOverflowMobile();
  }

  /** section end */

  /** @init functions */

  initAccordion();
  initMobileButtons();
  initStickyCheck();

  function initAccordion() {
    // init level-1  navigation
    for (var _j = 0; _j < accordions.length; _j++) {
      var _menu = accordions[_j];
      // add only for items with nested levels
      if (_menu.lastElementChild.classList.contains("cms-nav-dropdown")) {
        _menu.addEventListener("click", toggleAccordionMenu);
        _menu.addEventListener("keydown", toggleAccordionMenu);
      }
    }
  }

  function initMobileButtons() {
    // init event to the all Close popup buttons
    for (var _i = 0; _i < mobileClosePopup.length; _i++) {
      mobileClosePopup[_i].addEventListener("click", closeMobilePopups);
    }
    // init all back buttons
    for (var _j = 0; _j < mobileBackBtn.length; _j++) {
      mobileBackBtn[_j].addEventListener("click", backToPrevious);
    }
  }

  function initMobileMenuHeight() {
    hamburgerMenu &&
      hamburgerMenu.firstElementChild &&
      setMobileMenuHeight(hamburgerMenu.firstElementChild);
      setHeightForMobileMenuList();
  }

  function browserDetect() {
    var isFirefox = typeof InstallTrigger !== "undefined";
    var isSafari =
      /constructor/i.test(window.HTMLElement) ||
      (function(p) {
        return p.toString() === "[object SafariRemoteNotification]";
      })(
        !window["safari"] ||
          (typeof safari !== "undefined" && safari.pushNotification)
      );
    var isIE = !!document.documentMode;
    var isEdge = !isIE && !!window.StyleMedia;
    var isChrome = !!window.chrome;

    if (isChrome) return "chrome";
    if (isSafari) return "safari";
    if (isIE) return "ie";
    if (isEdge) return "edge";
    if (isFirefox) return "firefox";
  }

  function setBrowserClass() {
    header.classList.add("browser-" + browserDetect());
  }

  function initStickyCheck() {
    var _screenTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    if (_screenTop > stickyFrom) {
      addStickyHeader();
    } else if (_screenTop < removeStickyFrom) {
      removeStickyHeader();
    }
  }

  /** section end */

  /** @focus logic section */
  // first focus item = logo
  var enableTabNavigation = true; // feature  flag
  if (getIsMobile()) enableTabNavigation = false; // disable for mobile

  /** @variables section */
  var currentFocus = 0;
  var nextFocusableEl, previousFocusableEl;
  var popupFocusableEls, popupFirstFocusEl, popupLastFocusEl;
  var isInnerFocusActive = false;
  var focusable =
    'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])';
  var focusableNot = ".cms-notification"; //-label
  var focusableAccordion = "a.cms-nav-link, span.cms-nav-link";
  var focusMoveType = "default";
  var localLastFocusable;
  /** section end */

  // init focus, here we can put feature toggle to enable/disable tab navigation
  if (enableTabNavigation) {
    initFocusNavigation();
  }

  function focusCycleSetter(popup, selectors, type, parent) {
    // for the accordions in the local navigation
    if (type === "accordion") {
      popupFocusableEls = parent.querySelectorAll(selectors);
      var _filteredFocusable = [];
      for (var _i = 0; _i < popupFocusableEls.length; _i++) {
        if (
          popupFocusableEls[_i].parentElement.parentElement ===
          parent.lastElementChild
        ) {
          _filteredFocusable.push(popupFocusableEls[_i]);
        }
      }

      popupFocusableEls = _filteredFocusable;
      popupFocusableEls.unshift(parent.firstElementChild);
      // all popups
    } else {
      popupFocusableEls = document
        .querySelector("." + popup)
        .querySelectorAll(selectors);
    }

    popupFirstFocusEl = popupFocusableEls[0];
    popupLastFocusEl = popupFocusableEls[popupFocusableEls.length - 1];
  }

  // init inner focus level
  function turnOnPopupFocus(popup, selectors, moveType) {
    if (!enableTabNavigation) return; // return if feature was disabled
    focusCycleSetter(popup, selectors, "classic");
    isInnerFocusActive = true;
    focusMoveType = moveType;
    popupFirstFocusEl.focus();
  }

  // return control to the upper level flow
  function turnOffPopupFocus(trigger, returnControl) {
    if (!enableTabNavigation) return; // return if feature was disabled
    if (!returnControl && !isSticky) {
      isInnerFocusActive = false;
    }
    focusMoveType = "default";
    trigger.focus();
  }

  // check which key was pressed
  function pressedKeyHandler(e, type) {
    /** IE11 support was included */
    switch (type) {
      case "Enter":
        var _KEYCODE_ENTER = 13; // code for "ENTER"
        return e.key === "Enter" || e.keyCode === _KEYCODE_ENTER;
      case "Tab":
        var _KEYCODE_TAB = 9; // code for "TAB"
        return e.key === "Tab" || e.keyCode === _KEYCODE_TAB;
      case "Esc":
        var _KEYCODE_ESC = 27; // code for "ESC"
        return e.key === "Escape" || e.keyCode === _KEYCODE_ESC;
      case "Space":
        var _KEYCODE_SPACE = 32; // code for "SPACE"
        return e.key === "Space" || e.keyCode === _KEYCODE_SPACE;
      default:
        break;
    }
  }

  // init focus navigation - main entry point!
  function initFocusNavigation() {
    var _getFocusableEls = document.querySelectorAll("[data-focus-order]");
    // sort items by "data-focus-order" attribute
    var _sortedFocusableEls = [].slice
      .call(_getFocusableEls)
      .sort(function(a, b) {
        return a.dataset.focusOrder > b.dataset.focusOrder ? 1 : -1;
      });
    var _getFocusableLocalEls = setFocusableLocalEls();

    setKeyboardListeners(); // init "Space" events for buttons in the top-rifht side

    // we get the last element of local nav , therefore last focusable element of header
    getLocalLastFocusable();

    document.addEventListener("keydown", function(e) {
      var _isTabPressed = pressedKeyHandler(e, "Tab");
      var _isEscPressed = pressedKeyHandler(e, "Esc");

      // give control to "ESC" handler
      if (_isEscPressed) {
        focusEscapeHandler(e);
        return;
      }

      // return if no "TAB" was pressed - the base case
      if (!_isTabPressed) return;

      if (
        currentFocus === _sortedFocusableEls.length - 1 ||
        currentFocus === _sortedFocusableEls.length
      ) {
        // pop from stack if true was returned
        if (focusLocalNavigationHandler(e)) return;
      }
      // give control if "flex" move between popups was presented, else proceed with flow
      if (isInnerFocusActive && !focusFlexMoveHandler(e)) {
        focusLockCycling(e);
        return;
      }
      // keep default page navigation and counting after header's end and pop method from stack
      if (!focusLevel(e)) return;
      // general case, when user cycles throw entier header
      if (e.shiftKey) {
        /* shift + tab */
        currentFocus--;
        if (currentFocus < 0) return;
        setFocus();
        previousFocusableEl.focus();
        e.preventDefault();
      } /* tab */ else {
        setFocus();
        nextFocusableEl.focus();
        e.preventDefault();
        currentFocus++;
      }
    });

    function setKeyboardListeners() {
      var _linkContainers = document.querySelectorAll(
        ".cms-header-text-button, .cms-nav-menu--lvl-1 > li.cms-nav-item, .cms-header-logo > a"
      );

      var _linkWrapperClasses = ["cms-nav-item", "cms-accordion"];

      for (var _i = 0; _i < _linkContainers.length; _i++) {
        _linkContainers[_i].addEventListener("keydown", function(e) {
          if (!pressedKeyHandler(e, "Space") && !pressedKeyHandler(e, "Enter")) return;
          // replace target to a link element when event was fired on it's wrapper
          if (_linkWrapperClasses.some(function(_s) { return e.target.classList.contains(_s); })) {            
            var _link = e.target.querySelector(':scope > a');
            if (_link) {
              redirectByLink(e, _link);
            }
          }
          else {
            redirectByLink(e);
          }
        });
      }
    }

    function setFocusableLocalEls() {
      var _localFocusableEls = document.querySelectorAll(
        ".cms-nav-menu--lvl-1 > li.cms-nav-item"
      );

      var _filteredFocusableLocalEls = [].slice
        .call(_localFocusableEls)
        .filter(function(element) {
          // for IE11
          if (element.currentStyle) {
            return element.currentStyle.display !== "none";
            // for all other browsers
          } else {
            return getComputedStyle(element, null).display !== "none";
          }
        });

      return _filteredFocusableLocalEls;
    }

    // local part handler
    function focusLocalNavigationHandler(e) {
      /* shift + tab */
      if (e.shiftKey) {
        // if we enter to the main from the first item of the local navigation
        if (document.activeElement === leftSideNav.firstElementChild) {
          hideAccordionLevels();
          isInnerFocusActive = false;
          // if we enter into local navigation from outside of header
        } else if (document.activeElement === localLastFocusable) {
          isInnerFocusActive = true;
        } else {
          focusAccordionLevels(e, "down");
        }
      } /* tab */ else {
        // trigger when we enter into local nav section
        if (!isInnerFocusActive) {
          focusLocalNav(e);
          return true;
        }

        // if we're at last element of the local navigation, then return control and procced with the method execution
        if (document.activeElement === localLastFocusable) {
          isInnerFocusActive = false;
          // proceed with cycling inside the local navigation if not
        } else {
          if (
            !isSticky
          ) {
            focusAccordionLevels(e, "up");
          } else {
            return false;
          }
          return true;
        }
      }
    }

    // lock cycling if needed
    function focusLockCycling(e) {
      if (e.shiftKey) {
        /* shift + tab */
        if (document.activeElement === popupFirstFocusEl) {
          popupLastFocusEl.focus();
          e.preventDefault();
        }
      } /* tab */ else {
        if (document.activeElement === popupLastFocusEl) {
          popupFirstFocusEl.focus();
          e.preventDefault();
        }
      }
    }

    function focusAccordionLevels($event, type) {
      var _level = $event.target.classList.contains("cms-nav-link")
        ? $event.target.parentElement
        : $event.target;
      var _parent = _level.parentElement;
      var _grandParent = _level.parentElement.parentElement;
      /* shift + tab */
      if (type === "down") {
        _parent === leftSideNav && hideAccordionLevels();
      } /* tab */ else if (
        _parent.classList.contains("cms-menu-store") ||
        (document.activeElement.parentElement === _parent.lastElementChild &&
          _parent.classList.contains("cms-nav-menu--lvl-2") &&
          _parent === _grandParent.lastElementChild &&
          !_level.firstElementChild.classList.contains("cms-menu-link-open"))
      ) {
        hideAccordionLevels();
      } else if (_parent !== leftSideNav) {
        focusLockCycling($event);
      }
    }

    // move focus into local navigation
    function focusLocalNav(e) {
      // get and focus first item of local navigation
      var _itemToFocus = leftSideNav.firstElementChild;
      isInnerFocusActive = true;
      currentFocus++;
      _itemToFocus.focus();
      e.preventDefault();
    }

    function setFocus() {
      if (document.activeElement === documentBody) {
        nextFocusableEl = _sortedFocusableEls[0];
        previousFocusableEl = documentBody;
      } else {
        nextFocusableEl = _sortedFocusableEls[currentFocus];
        if (!currentFocus) {
          previousFocusableEl = documentBody;
          document.activeElement.blur(); // set focus to body
        } else {
          previousFocusableEl = _sortedFocusableEls[currentFocus - 1];
        }
      }
    }

    function focusEscapeHandler(e) {

      if (
        e.target.parentElement === leftSideNav &&
        e.target.lastElementChild.classList.contains("hide")
      ) {
        return;
      }

      // for local navigation items
      if (currentFocus === _sortedFocusableEls.length) {
        var _toClose = "";
        for (var _i = 0; _i < accordions.length; _i++) {
          if (
            accordions[_i].lastElementChild.classList.contains(
              "cms-nav-dropdown"
            ) &&
            !accordions[_i].lastElementChild.classList.contains("hide")
          ) {
            _toClose = accordions[_i];
          }
        }
        hideLastLevel(_toClose, e, true);
        return;
      }
      // close all popups
      focusHidePopups(e, false);
      // return focus to popup initiator
      _sortedFocusableEls[currentFocus - 1].focus();
    }

    // "pop" the highest accordion from the stack, we use recursive method for this purposes
    function hideLastLevel(parent, e, isFirst) {
      var _toClose = null;
      var _parent = parent;
      if (_parent) {
        if (isSticky && !(_parent.parentElement === leftSideNav) && !_parent.classList.contains("cms-accordion")) {
          focusHidePopups(e, true);
          return;
        }
      } else {
        focusHidePopups(e, true);
        return;
      }

      var parentChildren = isFirst
        ? parent.lastElementChild.firstElementChild.children
        : parent.lastElementChild.children;
      for (var _i = 0; _i < parentChildren.length; _i++) {
        if (
          parentChildren[_i].classList.contains("cms-accordion") &&
          !parentChildren[_i].lastElementChild.classList.contains("hide")
        ) {
          _toClose = parentChildren[_i];
        }
      }
      if (_toClose) {
        hideLastLevel(_toClose, e, false);
      } else {
        _parent.firstElementChild.classList.remove("cms-menu-link-open");
        _parent.lastElementChild.classList.add("hide");
        focusCycleSetter(
          "cms-accordion",
          focusableAccordion,
          "accordion",
          _parent.parentElement.parentElement
        );
        if (_parent.parentElement === leftSideNav) {
          _parent.focus();
        } else {
          _parent.firstElementChild.focus();
        }
        event.preventDefault();
        return; // base case
      }
    }

    function getLocalLastFocusable() {
      var _last = _getFocusableLocalEls[_getFocusableLocalEls.length - 1];
      if (_last && _last.lastElementChild) {
        var _lastOfLast = _last.lastElementChild;
        localLastFocusable = _lastOfLast.classList.contains(
          "cms-nav-dropdown"
        )
          ? _last
          : _lastOfLast;
      }
    }

    function focusLevel(e) {
      // when we outside of header from left
      if (currentFocus < 0) return leftBorderHandler(e);
      // when we outside of header from right
      if (currentFocus >= _getFocusableEls.length) return rightBorderHandler(e);
      return true; // base case
    }

    // hide all opened popups and return focus flow to the upper level
    function focusHidePopups(e, isEsc) {
      hideAllPopups();
      focusMoveType = "default";
      isInnerFocusActive = false;
    }

    // check if we should cycle throw elements of popup
    function focusFlexMoveHandler(e) {
      if (focusMoveType === "flex") {
        /* shift + tab */
        if (e.shiftKey) {
          // return to the upper level if we move back from the first element of the popup or if no-notifications popups appears
          if (
            document.activeElement === popupFirstFocusEl ||
            popupLastFocusEl.classList.contains("cms-no-notifications")
          ) {
            focusHidePopups(e, false);
            currentFocus++;
            return true;
          }
          // return to the upper level if we move forward from the last element of the popup or if no-notifications popups appears
          /* tab */
        } else if (
          document.activeElement === popupLastFocusEl ||
          popupLastFocusEl.classList.contains("cms-no-notifications")
        ) {
          focusHidePopups(e, false);
          return true;
        }
      }
      return false;
    }

    function rightBorderHandler(e) {
      // shift+tab
      if (e.shiftKey) {
        // when we enter into the header from the right side
        if (
          currentFocus === _sortedFocusableEls.length ||
          currentFocus === _sortedFocusableEls.length - 1
        ) {
          return true;
        }
        // decrease counter when we enter into the header
        currentFocus--;
      } /* just tab */ else {
        if (!isSticky) {
          // increase counter while cycling outside of the header
          currentFocus++;
        }
      }
      return false;
    }

    function leftBorderHandler(e) {
      // shift+tab
      if (e.shiftKey) {
        // decrease counter while cycling outside of the header
        currentFocus--;
      } /* just tab */ else {
        // increase counter while cycling outside of the header
        currentFocus++;
        // when we enter into the header from the left side
        if (!currentFocus) return true;
      }
      return false;
    }
  }
  /** sections end */
});

