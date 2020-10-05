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
}); // Scène 3D

var myBtn = document.querySelector('#btnPlay');
var myBtnIcon = myBtn.querySelector('i');
var myAnim = document.querySelector('.scene');
var animState;
var mutationsOptions = {
  attributes: true,
  attributeFilter: ['style']
};
var btnUpdater = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    animState = window.getComputedStyle(myAnim).animationPlayState;

    if (animState == 'running') {
      myBtnIcon.classList.add('icon-pause-circle');
      myBtnIcon.classList.remove('icon-play-circle');
    } else {
      myBtnIcon.classList.remove('icon-pause-circle');
      myBtnIcon.classList.add('icon-play-circle');
    }

    ;
  });
});
var animObserver = new IntersectionObserver(function (entries, observer) {
  entries.forEach(function (entry) {
    if (entry.intersectionRatio < 0.9 && animState == 'running') {
      myAnim.style.animationPlayState = 'paused';
    }
  });
}, {
  threshold: [0.1, 0.25, 0.5]
}); // Slider

var gallery = document.querySelector('#gallery');
var galleryImgs = gallery.querySelectorAll('img');
var galleryNav = document.querySelector('#navGal');
var galleryNavLinks = galleryNav.querySelectorAll('a');
var gallerySelected = 0; // index photo affichée dans le slider

function updateGallNav(x) {
  galleryNavLinks[gallerySelected].classList.remove('selected');
  galleryNavLinks[x].classList.add('selected');
  gallerySelected = x;
}

function updateGallerySize() {
  // ajouter au besoin la largeur de l'ascenceur à celle du slider
  var w = gallery.offsetWidth - gallery.clientWidth;

  if (w > 0) {
    var w2 = parseInt(window.getComputedStyle(gallery).width);
    gallery.style.setProperty('width', w2 + w + 'px');
  } // ajouster la hauteur du slider quand les images sont réduites


  w = gallery.clientWidth;

  if (w < 426) {
    var h = w * (400 / 426);
    gallery.style.setProperty('height', h + 'px');
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
  }); // Scène 3D

  btnUpdater.observe(myAnim, mutationsOptions);
  animObserver.observe(myAnim);
  myBtn.addEventListener("click", function (e) {
    myAnim.style.animationPlayState = animState !== 'running' ? 'running' : 'paused';
    e.preventDefault();
  }); // Video

  videoObserver.observe(myVid); // Slider

  updateGallerySize();
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
});