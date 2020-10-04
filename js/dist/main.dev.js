'use strict'; // Gestion menu bar

var nav = document.querySelector('#wrapper nav');
var navLinks = nav.querySelectorAll('a'); // Video

var myVid = document.querySelector('video');
var isPaused = false;
var videoObserver = new IntersectionObserver(function (entries, observer) {
  entries.forEach(function (entry) {
    if (entry.intersectionRatio < .6 && !myVid.paused) {
      myVid.pause();
      isPaused = true;
    }
  });
}, {
  threshold: [0.25, 0.5, 0.75]
}); // Slider

var gallery = document.querySelector('#gallery');

if (gallery) {
  var _galleryImgs = gallery.querySelectorAll('img');

  var _galleryNav = document.querySelector('#navGal');

  var _galleryNavLinks = _galleryNav.querySelectorAll('a');

  var _gallerySelected = 0; // index photo affichée dans le slider
}

function updateGallNav(x) {
  galleryNavLinks[gallerySelected].classList.remove('selected');
  galleryNavLinks[x].classList.add('selected');
  gallerySelected = x;
}

function scrollbars() {
  // ajouter au besoin la largeur de l'ascenceur à celle du slider
  var w = gallery.offsetWidth - gallery.clientWidth;

  if (w > 0) {
    var w2 = parseInt(window.getComputedStyle(gallery)['width']);
    gallery.style.setProperty('width', w2 + w + 'px');
  }
}

var galleryObserver = new IntersectionObserver(function (entries, observer) {
  entries.forEach(function (entry) {
    if (entry.intersectionRatio > 0.9) {
      var x = Array.from(galleryImgs).findIndex(function (node) {
        return node === entry.target;
      });
      updateGallNav(x);
    }
  });
}, {
  threshold: [0.1, 0.5, 0.9, 1],
  root: gallery
});
window.addEventListener("load", function (e) {
  // Gestion menu haut
  nav.addEventListener("click", function (e) {
    navLinks.forEach(function (e) {
      if (e.classList.contains('selected')) {
        e.classList.remove('selected');
      }

      ;
    });
    e.target.classList.add('selected');
  }); // Video

  videoObserver.observe(myVid); // Slider

  if (gallery) {
    galleryNavLinks[gallerySelected].classList.add('selected');
    galleryImgs.forEach(function (e) {
      galleryObserver.observe(e);
    });
    galleryNav.addEventListener("click", function (e) {
      var t = e.target.parentElement;
      var x = Array.from(galleryNavLinks).findIndex(function (node) {
        return node === t;
      });

      if (x != -1) {
        updateGallNav(x);
      }
    });
  }
});