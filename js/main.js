const gallery = document.querySelector('#gallery');
const galleryImgs =gallery.querySelectorAll('img');
const galleryNav = document.querySelector('#navGal');
const galleryNavLinks = galleryNav.querySelectorAll('a');
let gallerySelected = 0; // numéro photo affichée

function updateGallNav(x) {
    galleryNavLinks[gallerySelected].classList.remove('selected');
    galleryNavLinks[x].classList.add('selected');
    gallerySelected = x;
}

let galleryObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.intersectionRatio > 0.9) {
            let x = Array.from(galleryImgs).findIndex((node) => node === entry.target);
            updateGallNav(x);
        }
    });
}, {
    threshold: [ 0.1, 0.5, 0.9, 1 ],
    root: gallery
});


window.addEventListener("load", e => {
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