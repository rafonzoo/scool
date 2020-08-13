(function() {
  "use strict";

  /**
   * File navigation.js.
   *
   * Handles toggling the navigation menu for small screens and enables TAB key
   * navigation support for dropdown menus.
   */
  function localNavigation() {
    var container, button, menu, links, i, len;
    container = document.getElementById("site-navigation");

    if (!container) {
      return;
    }

    button = container.getElementsByTagName("button")[0];

    if ("undefined" === typeof button) {
      return;
    }

    menu = container.getElementsByTagName("ul")[0]; // Hide menu toggle button if menu is empty and return early.

    if ("undefined" === typeof menu) {
      button.style.display = "none";
      return;
    }

    menu.setAttribute("aria-expanded", "false");

    if (-1 === menu.className.indexOf("nav-menu")) {
      menu.className += " nav-menu";
    }

    button.onclick = function() {
      if (-1 !== container.className.indexOf("toggled")) {
        container.className = container.className.replace(" toggled", "");
        button.setAttribute("aria-expanded", "false");
        menu.setAttribute("aria-expanded", "false");
      } else {
        container.className += " toggled";
        button.setAttribute("aria-expanded", "true");
        menu.setAttribute("aria-expanded", "true");
      }
    }; // Get all the link elements within the menu.

    links = menu.getElementsByTagName("a"); // Each time a menu link is focused or blurred, toggle focus.

    for (i = 0, len = links.length; i < len; i++) {
      links[i].addEventListener("focus", toggleFocus, true);
      links[i].addEventListener("blur", toggleFocus, true);
    }
    /**
     * Sets or removes .focus class on an element.
     */

    function toggleFocus() {
      var self = this; // Move up through the ancestors of the current link until we hit .nav-menu.

      while (-1 === self.className.indexOf("nav-menu")) {
        // On li elements toggle the class .focus.
        if ("li" === self.tagName.toLowerCase()) {
          if (-1 !== self.className.indexOf("focus")) {
            self.className = self.className.replace(" focus", "");
          } else {
            self.className += " focus";
          }
        }

        self = self.parentElement;
      }
    }
    /**
     * Toggles `focus` class to allow submenu access on tablets.
     */

    (function(container) {
      var touchStartFn,
        i,
        parentLink = container.querySelectorAll(
          ".menu-item-has-children > a, .page_item_has_children > a"
        );

      if ("ontouchstart" in window) {
        touchStartFn = function touchStartFn(e) {
          var menuItem = this.parentNode,
            i;

          if (!menuItem.classList.contains("focus")) {
            e.preventDefault();

            for (i = 0; i < menuItem.parentNode.children.length; ++i) {
              if (menuItem === menuItem.parentNode.children[i]) {
                continue;
              }

              menuItem.parentNode.children[i].classList.remove("focus");
            }

            menuItem.classList.add("focus");
          } else {
            menuItem.classList.remove("focus");
          }
        };

        for (i = 0; i < parentLink.length; ++i) {
          parentLink[i].addEventListener("touchstart", touchStartFn, false);
        }
      }
    })(container);
  }

  /**
   * File skip-link-focus-fix.js.
   *
   * Helps with accessibility for keyboard only users.
   *
   * Learn more: https://git.io/vWdr2
   */
  function skipLinkFocusFix() {
    var isIe = /(trident|msie)/i.test(navigator.userAgent);

    if (isIe && document.getElementById && window.addEventListener) {
      window.addEventListener(
        "hashchange",
        function() {
          var id = location.hash.substring(1),
            element;

          if (!/^[A-z0-9_-]+$/.test(id)) {
            return;
          }

          element = document.getElementById(id);

          if (element) {
            if (
              !/^(?:a|select|input|button|textarea)$/i.test(element.tagName)
            ) {
              element.tabIndex = -1;
            }

            element.focus();
          }
        },
        false
      );
    }
  }

  function spinWheelEvent() {
    var landingImage = document.getElementById("image-landing");
    var landingImage2 = document.getElementById("image-landing-2");
    var landingImage3 = document.getElementById("image-radial");

    var requestAnimation =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback) {
        window.setTimeout(callback, 1000 / 60);
      };

    var scrollTicking = false;
    var scrollWinY = 0;

    (function initSpinYaxis() {
      scrollWinY = window.pageYOffset;
      landingImage.style.transform = "translate(-50%,-50%)rotate(".concat(
        scrollWinY,
        "deg)"
      );
      landingImage3.style.transform = "translate(-50%,-50%)rotate(".concat(
        scrollWinY,
        "deg)"
      );
    })();

    function spinScrolling() {
      scrollWinY = window.scrollY;

      if (document.body.dataset.bodyScroll === "unlocked") {
        return spinScrollTick();
      }
    }

    function spinScrollTick() {
      if (scrollTicking !== true) {
        requestAnimation(spinUpdate);
        scrollTicking = true;
      }
    }

    function spinUpdate() {
      landingImage.style.transform = "translate(-50%,-50%)rotate(".concat(
        scrollWinY,
        "deg)"
      );
      landingImage3.style.transform = "translate(-50%,-50%)rotate(".concat(
        scrollWinY,
        "deg)"
      );
      scrollTicking = false;
    }

    window.addEventListener("scroll", spinScrolling, false);
  }

  /**
   * Release default underscore script.
   * Skip to focus and navigation toggle
   */

  localNavigation();
  skipLinkFocusFix();
  spinWheelEvent();
  /**
   * Replace feather attribute as Icon
   * @param feathericon(c)
   */
  // @ts-ignore

  feather.replace();
  /**
   * Get computed background color to match
   * the body element or user want to.
   */
  // document.addEventListener('DOMContentLoaded', () => {
  // 	const header = document.getElementById('masthead');
  // 	const menu = document.getElementById('primary-menu');
  // 	const bodyBg = window.getComputedStyle(document.body);
  // 	const bgProp = bodyBg.getPropertyValue('background-color');
  // 	[].concat(header, menu).forEach(item => {
  // 		item.style.backgroundColor = `${bgProp}`;
  // 	});
  // });

  /**
   * Get rotate animation for a while and run
   * only after the document completely loaded
   */

  document.onreadystatechange = function() {
    var figureLanding = document.getElementById("image-landing");
    var figureLanding2 = document.getElementById("image-landing-2");
    var figureLanding3 = document.getElementById("image-radial");
    var figureLanding4 = document.getElementById("image-backcover");

    if (document.readyState === "complete") {
      figureLanding.setAttribute("data-spin-animation", "roll");
      figureLanding3.setAttribute("data-spin-animation", "roll");
      figureLanding4.setAttribute("data-spin-animation", "roll");
      figureLanding2.setAttribute("data-type-animation", "reveal-opacity");
      setTimeout(function() {
        document.body.dataset.bodyScroll = "unlocked";
        figureLanding.setAttribute("data-spin-animation", "off");
        figureLanding2.setAttribute("data-type-animation", "off");
        figureLanding3.setAttribute("data-spin-animation", "off");
        figureLanding4.setAttribute("data-spin-animation", "off");
        figureLanding2.setAttribute("data-spin-effect", "cubic-roll");
        figureLanding3.setAttribute("data-spin-effect", "cubic-roll");
      }, 7000);
    }
  };

  document.body.dataset.bodyScroll = "unlocked";
})();

//# sourceMappingURL=built.js.map
