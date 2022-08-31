let body = document.querySelector('body');

let slides = document.querySelectorAll('.image-office__slide');
let slideImages = document.querySelectorAll('.image-office__slide img');
let allSliders = document.querySelectorAll('.map__office')


let gallery = document.querySelector('.gallery');
let closeGallery = document.querySelector('.gallery__close');
let gallerySlider = document.querySelector('.gallery__slider');
let gallerySliderWrapper = document.querySelector('.gallery__slider-body');
let galleryThumbsWrapper = document.querySelector('.gallery__thumbs-wrapper');

// chechking mobile devices
const isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

// office image slider
if (slides) {
    for (let i = 0; i < allSliders.length; i++) {
        new Swiper(`._n${i} .image-office`, {
            navigation: {
                prevEl: `._n${i} .image-office__prev`,
                nextEl: `._n${i} .image-office__next`,
            },
            pagination: {
                el: `._n${i} .image-office__pagination`,
                type: 'fraction',
            },
        })
    }

    // open gallery
    slideImages.forEach(img => {
        img.addEventListener('click', () => {
            const images = img.closest('.swiper-wrapper').querySelectorAll('.swiper-slide');

            images.forEach(item => {
                let clone = item.cloneNode(true);
                let cloneThumb = item.cloneNode(true);

                gallerySliderWrapper.append(clone);
                galleryThumbsWrapper.append(cloneThumb);
            })

            body.classList.add('_noscroll');
            gallery.classList.add('_open');
        });
    })
}

// gallery slider
if (gallerySlider) {
    new Swiper('.gallery__slider', {
        navigation: {
            prevEl: '.gallery__prev',
            nextEl: '.gallery__next',
        },
        mousewheel: true,
        thumbs: {
            swiper: {
                el: '.gallery__thumbs',
                slidesPerView: 'auto',
            },
        }
    })
}

// close gallery
if (closeGallery) {
    closeGallery.addEventListener('click', () => {
        body.classList.remove('_noscroll');
        gallery.classList.remove('_open');

        setTimeout(() => {
            gallery.querySelectorAll('.swiper-slide').forEach(slide => {
                slide.remove();
            })
        }, 200);
    });
}

const ofices = document.querySelectorAll('.map__office');
const choosedOfices = document.querySelector('.map__offices-choosed');

let totalKvadrat = document.querySelector('.total-kvadrat');
let totalPrice = document.querySelector('.total-cena');

// add min height to map content
if (window.innerWidth > 1024) {
    let height = [];
    ofices.forEach(item => {
        let maxHeight = Math.max(
            item.scrollHeight, item.scrollHeight,
            item.offsetHeight, item.offsetHeight,
            item.clientHeight, item.clientHeight,
        );
        height.push(maxHeight);
    })
    let sortedHeight = height.sort((min, max) => { return max - min });
    document.querySelector('.map__content').style.minHeight = sortedHeight[0] + 'px';
}


// add offices to view
function addObject(obj) {
    obj.querySelector('.map__office-actions').classList.add('_change');

    document.querySelector('.map__offices-total').classList.add('_active');
    const name = obj.querySelector('.map__office-name').textContent;

    let kvadrat = obj.querySelector('.kvadrat').textContent;
    if (/,/.test(kvadrat)) {
        kvadrat = +kvadrat.replace(',', '.');
    }
    else {
        kvadrat = +kvadrat;
    }

    let price = obj.querySelector('.cena').textContent;
    if (/,/.test(price)) {
        price = +price.replace(',', '.');
    }
    else {
        price = +price;
    }


    const index = obj.dataset.index;

    let choosed = ` <div class="choosed" data-index="${index}">
                            <label class="choosed-name">${name}</label>
                            <div><span class="kvadrat">${kvadrat}</span>&nbsp м2</div>
                            <div><span class="cena">${price}</span>&nbsp млн</div>
                            <button class="choosed__remove">
                                <img src="https://bf59.ru/wp-content/themes/offices/assets/img/svg/close.svg" alt="">
                            </button>
                        </div>`;
    choosedOfices.insertAdjacentHTML('beforeend', choosed);

    calcTotalPlus(price, kvadrat);
    addOfficesToForm(obj);
}

// remove offices from view
function removeObject(obj) {
    const index = obj.dataset.index;


    let kvadrat = obj.querySelector('.kvadrat').textContent;
    if (/,/.test(kvadrat)) {
        kvadrat = +kvadrat.replace(',', '.');
    }
    else {
        kvadrat = +kvadrat;
    }

    let price = obj.querySelector('.cena').textContent;
    if (/,/.test(price)) {
        price = +price.replace(',', '.');
    }
    else {
        price = +price;
    }

    obj.querySelector('.map__office-actions').classList.remove('_change');
    choosedOfices.querySelector(`[data-index="${index}"]`).remove();

    calcTotalMinus(price, kvadrat);
    closeTotal();
    removeOfficesFromForm(index);
    removeFromFormVsible(obj.dataset.index);
}

// close total block in no offices in
function closeTotal() {
    setTimeout(() => {
        if (!document.querySelector('.choosed')) {
            document.querySelector('.map__offices-total').classList.remove('_active');
            if (window.innerWidth <= 640) {
                document.querySelector('.map__offices-flex').classList.remove('_active');
            }
        }
    }, 300);
}

// add choosed offices to form
function addOfficesToForm(obj) {
    const container = document.querySelector('.form__offices');
    let input = document.querySelector(`input[name="office-${obj.dataset.index}"]`);
    input.setAttribute('data-id', obj.dataset.index);
    input.value = obj.querySelector('.map__office-name').textContent;
    addIntoFormVsible(obj);
}

// add  visible offices info form
function addIntoFormVsible(obj) {
    let formOfficeContainer = document.querySelector('.form__choosed-offices-items');
    let formOfficesBlock = document.querySelector('.form__choosed-offices');

    let kvadrat = obj.querySelector('.kvadrat').textContent;
    if (/,/.test(kvadrat)) {
        kvadrat = +kvadrat.replace(',', '.');
    }
    else {
        kvadrat = +kvadrat;
    }

    let cena = obj.querySelector('.cena').textContent;
    if (/,/.test(cena)) {
        cena = +cena.replace(',', '.');
    }
    else {
        cena = +cena;
    }

    let item = `<div class="form__office-added" data-index="${obj.dataset.index}" data-cena="${cena}" data-kvadrat="${kvadrat}">
                    <span>${obj.querySelector('.map__office-name').textContent}</span>
                    <button class="form__office-remove">
                        <img src="https://bf59.ru/wp-content/themes/offices/assets/img/svg/close.svg" alt="">
                    </button>
                </div>`;

    if (!formOfficesBlock.classList.contains('_active')) {
        formOfficesBlock.classList.add('_active');
    }
    formOfficeContainer.insertAdjacentHTML('beforeend', item);
}

// add  visible offices from form
function removeFromFormVsible(index) {
    let formOfficesBlock = document.querySelector('.form__choosed-offices');
    formOfficesBlock.querySelector(`[data-index="${index}"]`).remove();
    setTimeout(() => {
        if (!document.querySelector('.form__office-added')) {
            formOfficesBlock.classList.remove('_active');
        }
    }, 300);
}

// remove choosed offices from form
function removeOfficesFromForm(index) {
    let input = document.querySelector(`input[name="office-${index}"]`);
    input.value = '';
    input.removeAttribute(`data-id`)
}

// calc total when adding offices
function calcTotalPlus(currPrice, currKvadrat) {
    let totalkv = totalKvadrat.textContent;
    if (/,/.test(totalkv)) {
        totalkv = +totalkv.replace(',', '.');
    }
    else {
        totalkv = +totalkv;
    }
    totalkv += currKvadrat;
    totalKvadrat.textContent = +totalkv.toFixed(1);;


    let totalPr = totalPrice.textContent;
    if (/,/.test(totalPr)) {
        totalPr = +totalPr.replace(',', '.');
    }
    else {
        totalPr = +totalPr;
    }
    totalPr += currPrice;
    totalPrice.textContent = +totalPr.toFixed(1);
}

// calc total when removing offices
function calcTotalMinus(currPrice, currKvadrat) {
    let totalkv = totalKvadrat.textContent;
    if (/,/.test(totalkv)) {
        totalkv = +totalkv.replace(',', '.');
    }
    else {
        totalkv = +totalkv;
    }
    totalkv -= currKvadrat;
    totalKvadrat.textContent = +totalkv.toFixed(1);


    let totalPr = totalPrice.textContent;
    if (/,/.test(totalPr)) {
        totalPr = +totalPr.replace(',', '.');
    }
    else {
        totalPr = +totalPr;
    }
    totalPr -= currPrice;
    totalPrice.textContent = +totalPr.toFixed(1);
}

// show offices hovering on map items
const paths = document.querySelectorAll('[data-path]');
let allowHover = true;
document.addEventListener('mouseover', function (e) {
    const targetEl = e.target;
    if (targetEl.classList.contains('path') && !targetEl.classList.contains('nooffice') && !isMobile.any()) {
        if (allowHover == true) {
            showOffices(targetEl);
        }
        targetEl.classList.add('_active')
    }
})

paths.forEach(path => {
    path.addEventListener('mouseleave', function (e) {
        if (!path.classList.contains('_init') && !isMobile.any()) {
            path.classList.remove('_active')
        }
    })
})



// show offices when when click or mouseover in map objects
function showOffices(targetEl) {
    const index = +targetEl.dataset.path;

    const form = document.querySelector('.form');
    if (form.classList.contains('_sent')) {
        form.classList.remove('_sent')
    }

    if (window.innerWidth > 1024) {
        document.querySelector('.map__content-welcom').classList.add('_remove');
    }

    document.querySelector('.map__offices').classList.add('_active');

    const slide = document.querySelector(`.map__office[data-index="${index}"]`);
    allSliders.forEach(item => {
        item.style.opacity = 0;
        item.style.position = 'absolute';
        item.style.pointerEvents = 'none';
    })

    slide.style.opacity = 1;
    slide.style.position = 'relative';
    slide.style.pointerEvents = 'all';
}

$(".form__choose input").inputmask("+7(999)-999-99-99");

document.addEventListener('click', function (e) {
    let targetEl = e.target;

    // add office button
    if (targetEl.classList.contains('map__office-add')) {
        let object = targetEl.closest('.map__office');
        addObject(object)

        if (window.innerWidth <= 640) {
            document.querySelector('.map__offices-flex').classList.add('_active');

            const form = document.querySelector('.form');
            if (form.classList.contains('_sent')) {
                form.classList.remove('_sent')
            }
        }
    }

    // remove office button
    if (targetEl.classList.contains('map__office-delete')) {
        let object = targetEl.closest('.map__office');
        removeObject(object);
    }

    // remove office button ( in choosed block)
    if (targetEl.classList.contains('choosed__remove')) {
        let choosed = targetEl.closest('.choosed')



        let kvadrat = choosed.querySelector('.kvadrat').textContent;
        if (/,/.test(kvadrat)) {
            kvadrat = +kvadrat.replace(',', '.');
        }
        else {
            kvadrat = +kvadrat;
        }

        let price = choosed.querySelector('.cena').textContent;
        if (/,/.test(price)) {
            price = +price.replace(',', '.');
        }
        else {
            price = +price;
        }

        calcTotalMinus(price, kvadrat);
        choosed.remove();

        let index = choosed.dataset.index;
        const slide = document.querySelector(`.map__office[data-index="${index}"]`);
        slide.querySelector('.map__office-actions').classList.remove('_change');

        closeTotal();
        removeOfficesFromForm(index)
        removeFromFormVsible(index);
    }

    // remove office button ( form visible office block)

    if (targetEl.classList.contains('form__office-remove')) {
        let addedOffice = targetEl.closest('.form__office-added')

        let kvadrat = addedOffice.dataset.kvadrat
        if (/,/.test(kvadrat)) {
            kvadrat = +kvadrat.replace(',', '.');
        }
        else {
            kvadrat = +kvadrat;
        }

        let price = addedOffice.dataset.cena;
        if (/,/.test(price)) {
            price = +price.replace(',', '.');
        }
        else {
            price = +price;
        }


        calcTotalMinus(price, kvadrat);


        let index = addedOffice.dataset.index;
        const slide = document.querySelector(`.map__office[data-index="${index}"]`);
        let choosed = document.querySelector(`.choosed[data-index="${index}"]`);

        slide.querySelector('.map__office-actions').classList.remove('_change');
        choosed.remove();

        closeTotal();
        removeOfficesFromForm(index)
        removeFromFormVsible(index);
    }

    // open choose contacs in form
    if (targetEl.classList.contains('form__choose-choosed')) {
        document.querySelector('.form__choose-body').classList.toggle('_active');
        document.querySelector('.form__choose-open').classList.toggle('_rotate');
    }

    // choose contacs in form
    if (targetEl.classList.contains('form__choose-item')) {
        let chosseInput = document.querySelector('.form__choose input');
        chosseInput.placeholder = targetEl.textContent;
        document.querySelector('.form__choose-choosed').textContent = targetEl.textContent;
        document.querySelector('.choosed-messenger ._label').textContent = targetEl.textContent;

        chosseInput.type = targetEl.dataset.type;
        if (targetEl.dataset.mask) {
            $(".form__choose input").inputmask("+7(999)-999-99-99");
        }
        else {
            $(".form__choose input").inputmask('');
        }

        document.querySelectorAll('.form__choose-item').forEach(item => {
            item.classList.remove('_weight');
        });
        targetEl.classList.add('_weight');
    }

    // total more 
    if (targetEl.classList.contains('total-more')) {
        document.querySelector('.map__offices-total-actions').classList.add('_active');
        document.querySelector('.map__offices-choosed').classList.add('_active');
    }

    // total hide 
    if (targetEl.classList.contains('total-hide')) {
        document.querySelector('.map__offices-total-actions').classList.remove('_active');
        document.querySelector('.map__offices-choosed').classList.remove('_active');
    }

    // open the office item in mobile
    if (targetEl.classList.contains('map__office-open')) {
        let theOffice = targetEl.closest('.map__office');

        document.querySelectorAll('.map__office').forEach(item => {
            item.classList.remove('_active');
        });
        document.querySelectorAll('.path').forEach(item => {
            if (!item.classList.contains('sold')) {
                item.style.fill = '#a1a9c6';
            }
        })
        document.querySelector(`.path[data-path="${theOffice.dataset.index}"]`).style.fill = '#53638f';
        theOffice.classList.add('_active')
    }

    // close the office item in mobile
    if (targetEl.classList.contains('map__office-open-remove')) {
        targetEl.closest('.map__office').classList.remove('_active')
    }

    // show more office item info in mobile
    if (targetEl.classList.contains('map__office-actions-more')) {
        targetEl.closest('.map__office').classList.add('_more');
    }

    // hide more office item info in mobile
    if (targetEl.classList.contains('map__office-actions-hide')) {
        targetEl.closest('.map__office').classList.remove('_more');
    }

    // scroll to the office clicking on map object when <=640
    if (targetEl.classList.contains('path') && !targetEl.classList.contains('nooffice')) {
        const index = +targetEl.dataset.path;
        const office = document.querySelector(`.map__office[data-index="${index}"]`);
        const allOffices = document.querySelectorAll('.map__office');


        document.querySelectorAll('.path').forEach(item => {
            if (item.classList.contains('_active')) {
                item.classList.remove('_active')
            }
        })

        if (window.innerWidth <= 1024) {
            allOffices.forEach(item => {
                item.classList.remove('_active');
            })

            targetEl.classList.add('_active');
            allowHover = false
        }
        else {
            if (targetEl.classList.contains('_init')) {
                targetEl.classList.remove('_init');
                targetEl.classList.remove('_active');
                allowHover = true;
            }
            else {
                document.querySelectorAll('.path').forEach(item => {
                    if (item.classList.contains('_init')) {
                        item.classList.remove('_init');
                    }
                })
                targetEl.classList.add('_init');
                targetEl.classList.add('_active');
                allowHover = false;
            }
        }

        if (window.innerWidth <= 640) {
            let cat = office.closest('.map__offices-cat');
            let id = [...cat.parentElement.children].indexOf(cat);

            office.scrollIntoView(true);
            setTimeout(() => {
                tabClick(tabs[id], cat, id)
                office.classList.add('_active');
            }, 300);

            const form = document.querySelector('.form');
            if (form.classList.contains('_sent')) {
                form.classList.remove('_sent')
            }
        }
        else {
            showOffices(targetEl);
        }
    }
})

// show/hide date in form
const foemDateCheckbox = document.querySelector('.form__date-checkbox');
const foemDate = document.querySelector('.form__date-choose');
if (foemDateCheckbox) {
    foemDateCheckbox.addEventListener('click', function (e) {
        foemDateCheckbox.classList.toggle('_allow');
        foemDate.classList.toggle('_allow');
    })
}

// change some block positions depending of devices width
if (window.innerWidth < 1025) {
    document.querySelector('.map__map').before(document.querySelector('.map__title'));
    document.querySelector('.map__map').append(document.querySelector('.map__offices'));

    document.querySelector('.map__offices-flex').append(document.querySelector('.map__offices-total'));
    document.querySelector('.map__offices-flex').append(document.querySelector('.map__offices-choosed'));
}
if (window.innerWidth < 641) {
    document.querySelector('.map__offices-total-body').after(document.querySelector('.map__offices-choosed'));
}

// office tabs - changeing active tab
const tabs = document.querySelectorAll('.map__offices-tab');
const categories = document.querySelectorAll('.map__offices-cat');
const tabsContent = document.querySelector('.map__offices-body');
for (let i = 0; i < tabs.length; i++) {
    const tab = tabs[i];
    const cat = categories[i];
    tab.addEventListener('click', function () {
        tabClick(tab, cat, i);
    })
}
tabClick(tabs[0], categories[0], 0)

function tabClick(tab, cat, i) {

    tabs.forEach(item => {
        item.classList.remove('_active');
    })
    categories.forEach(item => {
        item.classList.remove('_init');
    })

    tab.classList.add('_active');
    cat.classList.add('_init');
    tabsContent.style.transform = `translate3d(-${(i * 288) + (i * 30)}px,0,0)`;
}

// show form input labels oninput
const labels = document.querySelectorAll('._show-label-oninput ._label');
const inputs = document.querySelectorAll('._show-label-oninput input');
if (inputs && window.innerWidth > 640) {
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        const label = labels[i];

        input.addEventListener('input', function () {
            if (input.value != '') {
                label.style.opacity = 1;
            }
            else {
                label.style.opacity = 0;
            }
        })
    }
}

// form send actions - clear inputs value id sent calc and hide active elements
let form = document.querySelector('.wpcf7');
let submitBtn = document.querySelector('.form__submit-btn');
let submitInput = submitBtn.querySelector('input');

if (form) {
    form.addEventListener('wpcf7submit', function (event) {
        form.querySelector('.wpcf7-response-output').classList.remove('_close');
        setTimeout(() => {
            form.querySelector('.wpcf7-response-output').classList.add('_close');
        }, 3000);

    }, false);

    form.addEventListener('keydown', function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
        }
    });

    form.addEventListener('wpcf7mailsent', function (event) {

        document.querySelector('.form').classList.add('_sent')
        document.querySelector('.map__content-welcom').classList.remove('_remove');
        document.querySelector('.map__offices').classList.remove('_active');
        allowHover = true;

        let inputs = form.querySelectorAll('.form__offices input');
        let visibleOffices = document.querySelectorAll('.form__office-added');
        let choosedOffices = document.querySelectorAll('.choosed');
        let activeActions = document.querySelectorAll('.map__office-actions')

        document.querySelector('.total-kvadrat').textContent = 0;
        document.querySelector('.total-cena').textContent = 0;
        document.querySelector('.map__offices-total').classList.remove('_active');
        document.querySelector('.form__choosed-offices').classList.remove('_active');

        if (window.innerWidth <= 640) {
            document.querySelector('.map__offices-flex').classList.remove('_active');
        }

        activeActions.forEach(act => {
            if (act.classList.contains('_change')) {
                act.classList.remove('_change');
            }
        })
        inputs.forEach(inp => {
            inp.value = '';
            inp.removeAttribute('data-id');
        })
        visibleOffices.forEach(office => {
            office.remove();
        })
        choosedOffices.forEach(office => {
            office.remove();
        })

    }, false);
}

// disable for msubmit if there are no added offices into form
if (submitBtn) {
    submitBtn.addEventListener('mouseover', function () {
        lockSend()
    })

    submitBtn.addEventListener('mouseleave', function () {
        document.querySelector('.form__submit-output').style.opacity = 0;
    })

    submitBtn.addEventListener('click', function () {
        lockSend()
    })

}


function lockSend() {
    if (!document.querySelector('.form__office-added')) {
        submitInput.style.pointerEvents = 'none';
        submitBtn.style.cursor = 'no-drop';
        document.querySelector('.form__submit-output').style.opacity = 1;
    }
    else {
        submitInput.style.pointerEvents = 'all';
        submitBtn.style.cursor = 'pointer';
    }
}

// parallax booter background
const footerImage = document.querySelector('.footer__image');
if (footerImage) {
    let bottom = document.querySelector('.header__image').getBoundingClientRect().height + document.querySelector('.header').getBoundingClientRect().height;


    if (window.innerWidth > 1024 && window.innerHeight > 768) {
        bottom = 600;
    }
    else if (window.innerWidth > 1024 && window.innerHeight <= 660) {
        bottom += 450;
    }

    else if (window.innerWidth <= 1024) {
        bottom = bottom + 300;
    }
    footerImage.style.bottom = -bottom + 'px';


    window.addEventListener('scroll', function (e) {
        if (window.scrollY >= bottom) {
            footerImage.style.bottom = '0px'
        }
        else {
            footerImage.style.bottom = -bottom + 'px'
        }
    })
}

document.querySelector('.map__map svg').addEventListener('mouseleave', function () {
    if (window.innerWidth > 1024) {
        if (allowHover == true) {
            document.querySelector('.map__content-welcom').classList.remove('_remove');
            document.querySelector('.map__offices').classList.remove('_active');
        }
    }
});