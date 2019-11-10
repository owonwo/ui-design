const $ = (s) => document.querySelector(s)
const $$ = (s) => document.querySelectorAll(s)

const toggleClass = (classname, el) => el.classList.toggle(classname);
Element.prototype.setStyle = function setStyle(props) {
    Object.entries(props).forEach(([prop, value]) => {
        this.style[prop] = value
    })
}

const doStuff = () => {
    const leftSide = $('.ax_left');
    const { width, height } = leftSide.getBoundingClientRect();

    leftSide.addEventListener('click', () => {
        const figure = leftSide.querySelector('.ax_product_image');
        toggleClass('preview', leftSide);
        
        console.log(height);
        if (leftSide.classList.contains('preview')) {
            figure.setStyle({ width: width+'px', height: height+'px' })
        } else {
            figure.setStyle({ width: (width * .6)+'px' , height: (height * .4)+'px' })
        }

    })
    console.log({ width, height });
}

window.addEventListener('load', doStuff)