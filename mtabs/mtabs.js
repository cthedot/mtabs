;(function () {
  "use strict";
  /*
    any tabs element with an id will be saved 
    call ``Tabs.activate(tabs-id, tab-no)`` to activate any tab
  */

  var tabs = []

  function init($elements, options) {
    // moveTabs = false
    options = options || {}

    ;[].forEach.call($elements, function ($element, j) {
      var $headersContainer = $element.querySelector('.tabs-headers')
      var $headers = $element.querySelectorAll('.tabs-headers > *')
      var max = $headers.length - 1
      var active = 0
      var widths = []
      var widthSum = 0
      var availableWidth = window.innerWidth
      var hash = location.hash
      
      function activate(n) {
        var x = (options.moveTabs || availableWidth < widthSum) ?
          -(widths.slice(0, n).reduce(function (sum, n) {
            return sum + n
          }, 0)) : 0
          
        $headersContainer.style.transform = 'webkitTranslateX(' + x + 'px)'
        $headersContainer.style.transform = 'translateX('+ x + 'px)'
        $element.classList.remove('tabs-' + active)
        $element.classList.add('tabs-' + n)
        active = n
      }

      ;[].forEach.call($headers, function ($header, i) {
        var css = window.getComputedStyle($header)
        var w = parseInt(css.width) +
          parseInt(css.paddingLeft) +
          parseInt(css.paddingRight) +
          parseInt(css.borderLeftWidth) +
          parseInt(css.borderRightWidth)

        widthSum += w
        widths.push(w)
        
        $header.addEventListener('click', function (e) {
          e.preventDefault()
          activate(i)
        })
        
        if (hash) {
          if ($header.getAttribute('href') == hash) {
            active = i            
          }          
        }
        
      })

      // events
      if (window.Hammer) {
        var hammertime = new Hammer($element, {});
        hammertime.on('swipe', function (ev) {
          if (ev.direction == Hammer.DIRECTION_RIGHT && active > 0) {
            activate(active - 1)
          }
          else if (ev.direction == Hammer.DIRECTION_LEFT && active < max) {
            activate(active + 1)
          }
        });
      }

      window.addEventListener('keydown', function(e) {
        if (e.keyCode == 37 && active > 0) {
          activate(active - 1)
        }
        if (e.keyCode == 39 && active < max) {
          activate(active + 1)
        }
      }, false) 

      window.addEventListener('resize', function(e) {
        availableWidth = window.innerWidth
      }, false) 


      // to be able to control from script
      var id = $element.getAttribute('id')

      if (id) {
        tabs[id] = {
          activate: activate
        }
      }
      
      activate(0)
    })
  }

  function activate(id, n) {
    if (id in tabs) {
      tabs[id].activate(n)
    }
  }

  window.Tabs = {
    init: init,
    activate: activate,
    VERSION: 0.2
  }

}());