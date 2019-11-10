const $ = (s) => document.querySelector(s)
const $$ = (s) => document.querySelectorAll(s)

const toggleClass = (classname, el) => el.classList.toggle(classname);
Element.prototype.setStyle = function setStyle(props) {
    Object.entries(props).forEach(([prop, value]) => {
        this.style[prop] = value
    })
}

const doStuff = () => {
    const leftPane = $('.ax_left');
    const rightPane = $('.ax_right');
    const { width, height } = leftPane.getBoundingClientRect();

    leftPane.addEventListener('click', () => {
        const figure = leftPane.querySelector('.ax_product_image');
        toggleClass('preview', leftPane);
        toggleClass('preview', rightPane);

        if (leftPane.classList.contains('preview')) {
            figure.setStyle({ width: width+'px', height: height+'px' })
        } else {
            figure.setStyle({ width: (width * .6)+'px' , height: (height * .4)+'px' })
        }

    })
    console.log({ width, height });
}

window.addEventListener('load', doStuff)