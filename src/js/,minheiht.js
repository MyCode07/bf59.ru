
// add min height and margin bottom so map contant's height doesn't twitch
function addMinHeight() {
    let mapContantHeight = document.querySelector('.map__content').getBoundingClientRect().height;

    document.querySelector('.map__offices').style.minHeight = mapContantHeight + 'px';
    document.querySelector('.map__offices').style.maxHeight = mapContantHeight + 'px';
}

if (window.innerWidth > 1024) {
    addMinHeight();
}

// remove map contant's min height and margin bottom

function removeMinHeight(index) {
    let office = document.querySelector(`.map__office[data-index="${index}"]`);
    let height = office.getBoundingClientRect().height
    document.querySelector('.map__offices').style.minHeight = height + 'px';
    document.querySelector('.map__offices').style.maxHeight = height + 'px';

    setTimeout(() => {
        document.querySelector('.map__offices').style.minHeight = 'none';
        document.querySelector('.map__offices').style.maxHeight = 'none';
    }, 2000);
}

let formSection = document.querySelector('.form');
let formBody = document.querySelector('.form__body');
let mapSection = document.querySelector('.map');

let formHeight = Math.max(
    formBody.scrollHeight, formBody.scrollHeight,
    formBody.offsetHeight, formBody.offsetHeight,
    formBody.clientHeight, formBody.clientHeight,
);

let mapHeight = Math.max(
    mapSection.scrollHeight, mapSection.scrollHeight,
    mapSection.offsetHeight, mapSection.offsetHeight,
    mapSection.clientHeight, mapSection.clientHeight,
);

console.log(formHeight);
console.log(mapHeight);

let mapheightPlused = mapHeight + formHeight;


mapSection.style.cssText += `
 height: ${mapheightPlused}px;

`