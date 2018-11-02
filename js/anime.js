const config = {
    duration: 700,
    activeClassName: 'active',
}

const Button = () => {
    let btn = document.querySelector('.anim-btn'),
        SVGPath = btn.querySelector('.anim-btn-path'),
        offset = SVGPath.getAttribute('stroke-dasharray');

    return {
        getStrokeOffset() {
            return +SVGPath.getAttribute('stroke-dashoffset');
        },
        setProgress(progress = offset) {
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

const buildCartQuantity = () => {
    let quantity = 0;
    const button = document.querySelector('#inc-holder');
    if(!button) return false;

    let plusButton = button.querySelector('#plus'),
        minusButton = button.querySelector('#minus')
        quantityCounter = button.querySelector('#quantity');

    return {
        quantityIsZero() {
            return quantity === 0;
        },
        increment: () => quantity++,
        decrement: () => !(quantity > 0) || quantity--,
        init() {
            button.addEventListener('click', () => {
                if(!this.quantityIsZero() && quantity > 0) {
                    button.classList.add('is-set')
                }else{
                    button.classList.remove('is-set');
                }
            });
            plusButton.addEventListener('click',(e) => {
                this.increment();
                this.updateQuantity()
            })
            minusButton.addEventListener('click',(e) => {
                this.decrement();
                this.updateQuantity();
            })
        },
        updateQuantity() {
            quantityCounter.innerText = quantity;
        }
    }
}

window.addEventListener('load', () => {
    const bigButton = buildCartQuantity();
    if(bigButton) bigButton.init();

    buildSVGProgress();
})


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