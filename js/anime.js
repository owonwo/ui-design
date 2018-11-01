let inputs = {}

function setProgress(offset) {

    let count = Object.keys(inputs).length,
        value = offset / count,
        filled = Object.values(inputs).filter(e => e).length;

    return value === Infinity ? 0 : Math.abs((value * filled) - offset);
}

function animatePath() {
    let 
        btn = document.querySelector('.anim-btn');
        svg = btn.querySelector('.anim-btn-path'),
        offset = svg.getAttribute('stroke-dasharray'),
        new_offset = setProgress(offset);
        svg.style.strokeDashoffset = new_offset; 

    console.log(offset , new_offset);
    setTimeout(function() {
        if(0 === new_offset) {
            btn.classList.add('active');    
        }else {
            btn.classList.remove('active');
        }
    }, 700)
}

function isComplete() {
    inputs[this.id] = (this.value.length > 0);
    animatePath();
}

function getInputs() {
    let lobb = document.querySelectorAll('input');
    for(let input of lobb) {
        inputs[input.id] = false,
        input.addEventListener('keyup', isComplete);
    }
}

window.addEventListener('load', () => {
    getInputs();
})