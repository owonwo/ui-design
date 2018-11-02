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