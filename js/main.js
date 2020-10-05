'use strict'

// Gestion menu bar
const nav = document.querySelector('#wrapper nav');
const navLinks = nav.querySelectorAll('a');

// Video
const myVid = document.querySelector('video');
let isPaused = false;

let videoObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.intersectionRatio < .6 && !myVid.paused) {
            myVid.pause();
            isPaused = true;
        }
    });
}, {
    threshold: [0.25, 0.5, 0.75,],
});

// Scène 3D
const myBtn = document.querySelector('#btnPlay');
const myBtnIcon = myBtn.querySelector('i');
const myAnim = document.querySelector('.scene');
let animState;

let mutationsOptions = {
    attributes: true,
    attributeFilter: ['style']
};
let btnUpdater = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        animState = window.getComputedStyle(myAnim).animationPlayState
        if (animState == 'running') {
            myBtnIcon.classList.add('icon-pause-circle');
            myBtnIcon.classList.remove('icon-play-circle');
        }else{
            myBtnIcon.classList.remove('icon-pause-circle');
            myBtnIcon.classList.add('icon-play-circle');
        };
    });
});

let animObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.intersectionRatio < 0.9 && animState == 'running') {
            myAnim.style.animationPlayState = 'paused';
        }
    });
}, {
    threshold: [ 0.1, 0.25, 0.5 ]
});

// Slider
const gallery = document.querySelector('#gallery');
const galleryImgs = gallery.querySelectorAll('img');
const galleryNav = document.querySelector('#navGal');
const galleryNavLinks = galleryNav.querySelectorAll('a');
let gallerySelected = 0; // index photo affichée dans le slider

function updateGallNav(x) {
    galleryNavLinks[gallerySelected].classList.remove('selected');
    galleryNavLinks[x].classList.add('selected');
    gallerySelected = x;
}

function updateGallerySize() {
    // ajouter au besoin la largeur de l'ascenceur à celle du slider
    let w = gallery.offsetWidth - gallery.clientWidth;
    if (w > 0) {
        let w2 = parseInt(window.getComputedStyle(gallery).width);
        gallery.style.setProperty('width', w2 + w + 'px');
    }
    // ajouster la hauteur du slider quand les images sont réduites
    w = gallery.clientWidth;
    if (w < 426){
        let h = w * (400/426);
        gallery.style.setProperty('height', h + 'px');
    }
}

let galleryObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.intersectionRatio > 0.9) {
            let x = Array.from(galleryImgs).findIndex((node) => node === entry.target);
            updateGallNav(x);
        }
    });
}, {
    threshold: [0.1, 0.5, 0.9, 1],
    root: gallery
});


window.addEventListener("load", e => {
    // Gestion menu haut
    nav.addEventListener("click", e => {
        navLinks.forEach(e => {
            if (e.classList.contains('selected')) {
                e.classList.remove('selected');
            };
        });
        e.target.classList.add('selected');
    });

    // Scène 3D
    btnUpdater.observe(myAnim, mutationsOptions);
    animObserver.observe(myAnim);

    myBtn.addEventListener("click", e => {
        myAnim.style.animationPlayState = (animState !== 'running') ? 'running' : 'paused';
        e.preventDefault();
    });

    // Video
    videoObserver.observe(myVid);

    // Slider
    updateGallerySize();
    galleryNavLinks[gallerySelected].classList.add('selected');

    galleryImgs.forEach(e => {
        galleryObserver.observe(e);
    });

    galleryNav.addEventListener("click", e => {
        let t = e.target.parentElement;
        let x = Array.from(galleryNavLinks).findIndex((node) => node === t);
        if (x != -1) {
            updateGallNav(x);
        }
    });
});