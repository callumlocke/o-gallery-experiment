(function () {
  'use strict';
 
  var me = document.currentScript.ownerDocument;

  var Gallery = require('../bower_components/o-gallery/main');
 
  var proto = Object.create(HTMLElement.prototype);
  proto.createdCallback = function () {

    // Query for nested elements
    var xTitle = this.querySelector('x-title');
    var xItems = this.querySelectorAll('x-item');


    /*
      Could validate the found elements here, and throw
      an error if any are missing/malformed.
    */


    // Build config for gallery
    var items = [].slice.call(xItems).map(function (el) {
      var xContent = el.querySelector('x-content');
      var xCaption = el.querySelector('x-caption');

      return {
        content: xContent ? xContent.innerHTML : null,
        caption: xCaption ? xCaption.innerHTML : null,
        selected: (el.getAttribute('x-selected') !== null)
      };
    });

    var config = {
      title: (xTitle ? xTitle.innerText : null),

      items: items,

      multipleItemsPerPage: (this.getAttribute('x-multipleitemsperpage') !== null),

      captions: (function () {
        for (var i = items.length - 1; i >= 0; i--) {
          if (items[i].caption) return true;
        }
        return false;
      })(),

      captionMinHeight: this.getAttribute('x-captionminheight'),
      captionMaxHeight: this.getAttribute('x-captionmaxheight')
    };

    // Construct the shadow DOM
    var shadowRoot = this.createShadowRoot();

    shadowRoot.innerHTML = me.getElementById('css').innerHTML;

    var cont = document.createElement('div');
    shadowRoot.appendChild(cont);

    // Construct the OGallery instance (and attach it to the element so other o-gallery elements can access it)
    this.gallery = new Gallery(cont, config);

    // Make it sync with another gallery, if applicable
    var otherId = this.getAttribute('x-sync');
    if (otherId) {
      document.addEventListener('DOMContentLoaded', function () {
        var otherGallery = document.getElementById(otherId);
        if (otherGallery) {
          console.log('other gallery', otherGallery.gallery);
        }
      });
    }

    console.log('Finished setting up o-gallery element', this);
  };
 
  // Register the o-gallery element
  document.registerElement('o-gallery', {prototype: proto});
 
})();
