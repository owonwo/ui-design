const config = {
    duration: 700,
    activeClassName: 'active',
}

const _ = (selector) => document.querySelector(selector);

const Button = () => {
    let btn = document.querySelector('.anim-btn'),
        SVGPath = btn.querySelector('.anim-btn-path'),
        offset = SVGPath.getAttribute('stroke-dasharray');

    return {
        getStrokeOffset() {
            return +SVGPath.getAttribute('stroke-dashoffset');
        },
        setProgress(progress = offset) {
            console.trace(progress);
            SVGPath.style.strokeDashoffset = progress;
        },
        active() {
            btn.classList.add(config.activeClassName);
        },
        disable() {
            btn.classList.remove(config.activeClassName);
        }
    }
}

function getInputs() {
    return document.querySelectorAll('form input');
}

window.addEventListener('load', () => {
    buildCartQuantity();
    Unveil.init(2);
    buildSVGProgress();
})

function buildCartQuantity() {
    let button = document.querySelector('#inc-holder');
    if(!button) return ;
    button.addEventListener('click', () => {
        button.classList.toggle('is-set');
    });
}

function buildSVGProgress() {
    let inputs = [].slice.call(getInputs()),
        remains = 0;
    if (inputs.length < 1) return;
    btn = Button();

    const filled = () => inputs.filter(input => input.value.length > 0).length;
    const isCompleted = () => inputs.length === filled();
    const progress = () => {
        let offset = btn.getStrokeOffset();
        let count = inputs.length,
            value = offset / count;

        return value === Infinity ? 0 : Math.abs((value * filled()) - offset);
    }
    const validateInputs = () => {
        btn.setProgress(progress());
        isCompleted() ? setTimeout(() => btn.active(), config.duration) : btn.disable();
    }

    inputs.map(e => e.addEventListener('keyup', validateInputs));
}


const Unveil = {
    shutters: [],
    init(count) {
        count = count || 5;
        const mainEl = _('.wg-window'),
            holder = mainEl.querySelector('.holder'),
            button = mainEl.querySelector('button');
        if(!mainEl) return false;
        holder.height = holder.clientHeight;

        this.shutters = this.addShutters(count, holder);
        console.log(this.shutters);
        this.addButton(button);
    },
    addButton(button) {
        button.addEventListener('click', this.flipShutters.bind(this));
    },
    flipShutters() {
        // console.log(this.shutters);
        this.shutters.map((el) => el.initFlip());
    },
    addShutters(count, holder) {
        return Array(count).fill("").map((e) => {
                const div = this.addElementPrototype(document.createElement('div'));
                const calculateHeight = () => {
                    return Math.abs((holder.height / count)) + 'px'
                }
                div.css({
                    backgroundColor: 'blue',
                    height: calculateHeight()
                }).setup();
                holder.appendChild(div);
                return div;
            })
    },
    addElementPrototype(el) {
        let clockwise = false;
        
        el.__proto__ = Object.assign(el.__proto__, {
            setup(value) {
                clockwise = !clockwise
            },
            css(obj) {
                Object.entries(obj).map(([key, value]) =>  {
                    this.style[key] = value;
                });
                return this;
            },
            initFlip() {
                (clockwise) ? this.flip(true) : this.flip(false);
            },
            flip(clockwise) {
                this.css({
                    transform: clockwise ? 'rotateX(90deg)' : 'rotateX(-90deg)'
                });
            },
        });

        return el;
    }
}