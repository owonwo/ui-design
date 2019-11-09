const config = {
    duration: 700,
    activeClassName: 'active',
}

const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

const delay = (time) => (result) => new Promise(resolve => setTimeout(() => resolve(result), time));

const trace = (x) => {
    console.log(x);
    return x;
}

const logErr = (err) => {
    err => console.warn("Validation Failed!", err);
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
    Unveil.init(10);
    const bigButton = buildCartQuantity();
    if(bigButton) bigButton.init();
    buildSVGProgress();
});

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
        const mainEl = _('.wg-window:nth-child(2)');
        if(!mainEl) return false;

        const holder = mainEl.querySelector('.holder'),
            button = mainEl.querySelector('button');

        holder.height = holder.clientHeight;
        this.shutters = this.addShutters(count, holder);
        this.shutters.forEach(e => {
            this.observer.observe(e);
        })
        this.addButton(button);
    },
    observer: (function() {
        return new IntersectionObserver((entries) => {
            entries.map((entry) => {
                if (entry.intersectionRatio > 0) {
                    entry.target.initFlip();
                } else {
                    entry.target.style.transform = "";
                }
            })
        })
    })(),
    addButton(button) {
        button.addEventListener('click', () => {
            this.flipShutters()
            button.classList.add('one-side-fall')
            setTimeout(() => button.style.opacity = 0, 800);
        });
    },
    flipShutters() {
        this.shutters.map((el) => el.initFlip());
    },
    addShutters(count, holder) {
        return Array(count).fill("").map((e, index) => {
                const div = this.addElementPrototype(document.createElement('div'));
                const calculateHeight = () => {
                    return Math.abs((holder.height / count)) + 'px'
                }
                div.css({
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

const Identity = (x) => {
    return {
        map: (fun) => {
            return Identity(fun(x))
        },
        delay: async (duration) => {
            await delay(duration)();
            return Identity(x)
        },
        bounceOut: () => {
            x.style.left = 0;
            return Identity(x);
        }
    }
}

const IconAnimation = Object.freeze({
    hide: (el) => {
        el.style.visibility = "hidden"
        return el;
    },
    bounceOut: (el) => {
        el.style.left = 0;
        el.style.borderColor = '#FFFFFF';
        el.style.opacity = 1;
        return el;
    },
    slideRight: (offset) => (el) => {
        el.style.transform = `translateX(${offset}px) rotateY(180deg)`;
        el.style.opacity = 0;
        return el;
    }
});

const IconHolder = () => {
    let left = 0;
    const holder = document.querySelector('.wg-ss__icon_holder');
    let icons = [].slice.call(holder.children).map(x => Identity(x));

    return {
        init() {
            icons.map((e, index) => {
                e.map((x) => {
                    x.style.left = `${left}px`
                    if(index > 0) {
                        x.style.borderColor = `#FFFFFF`
                        x.style.opacity = '0.1'
                    }
                    left += 5;
                });
                return e;
            }).reverse().map((e, index) => {
                e.map(x => {
                    x.style.zIndex = index
                })
            });
        },
        fetchIcon(index) {
            if(typeof index === 'number') {
                return icons[+index];
            } else {
                throw Error('invalid index arguemnt, excepted a Number got '+ typeof index)
            }
        }
    }
}

function FormError (message, code) {
    this.message = message
    this.code = code
    this.name = "Form Error"
}

const SS = () => {
    const ssInput = document.querySelector('.wg-ss__input'),
        span = document.querySelector('#enter'),
        input = document.createElement('input');
        icon = ssInput.querySelector('.wg-ss__icon'),
        label = ssInput.querySelector('.wg-ss__text_holder > label'),
        submitButton = ssInput.querySelector('.wg-ss__submit'),
        iconHolder = IconHolder();
        fields = {
            "full name": {value: '', regexp: /.+/}, 
            "age": { value: '', regexp: /.+/ },
            email: {value:'', regexp: /^.+@.+\..+$/},
            password: {value: '', regexp: /[A-z0-9_-]+/},
        };
    let counter = 0;
    const EVENTS = {};
    const getOffset = () => Math.abs(ssInput.clientWidth);
    const current = () => Object.keys(fields)[counter];
    const getRegExp = () =>  {
        const input = fields[current()];
        return input.regexp.test(input.value);
    }
    const isFinished = () => counter > (Object.keys(fields).length - 1);
    const changeLabel = () => label.innerText = current();
    const hideLabel = () => label.style.display = 'none';
    const makeDots = () => '<span class="dots"></span>';
    const updateWidth = (width) => {
        let holder = document.querySelector('.wg-ss__text_holder');
        ssInput.style.width = typeof width !== 'undefined' ? width : `${(holder.clientWidth + 100)}px`;
    }
   
    const shakeButton = () => {
        ssInput.classList.add('wiggle')
        submitButton.classList.add('shake')

        setTimeout(() => {
            ssInput.classList.remove('wiggle')
            submitButton.classList.remove('shake');
        }, 600);
    }

    const animateCurrentIcon = () => {
        iconHolder
            .fetchIcon(counter)
            .map(IconAnimation.slideRight(getOffset()))
            .delay(1000).then((icon) => {
                icon.map(IconAnimation.hide).delay(300)
                    .then(icon => icon.map(resizeInput))
            });
    }
    const animateNexIcon = () => {
        const next = counter
        isFinished() ||
            iconHolder.fetchIcon(next).delay(300)
                .then(icon => icon.map(IconAnimation.bounceOut));
    }

    const submit = () => {
        if (!isFinished()) {
            animateCurrentIcon();
            (counter += 1)
            animateNexIcon();
        }
        if (isFinished())
            throw new FormError('Field fields Finished!', 54);
    }

    const resizeInput = () => {
        updateWidth();
        Promise.resolve().then(delay(1000))
            .then(() => updateWidth('auto'))
    }

    const clearText = () => {
        input.value = ""
        span.innerText = ""
    }
    const playFinalAnimation = () => {
        clearText();
        resizeInput();
        hideLabel();
    }

    return {
        init() {
            debugger

            changeLabel();
            iconHolder.init();
            ssInput.appendChild(input);

            ssInput.addEventListener('click', this.focusIn.bind(this));
            submitButton.addEventListener('click', this.send.bind(this));
            input.addEventListener('blur', () => ssInput.classList.remove('focused'))
            return this;
        },
        focusIn() {
            input.focus();
            ssInput.classList.add('focused');
            input.addEventListener('keyup', this.typeIn.bind(this));
        },
        typeIn(event) {
            if (event.keyCode === 13) {
                this.send.bind(this)()
                return;
            }
            const currentField = fields[current()];

            if (current() === 'password') {
                currentField.value = [].slice.call(input.value).join('');
                span.innerHTML = currentField.value.split("").map(makeDots).join('');
            } else {
                span.innerHTML = currentField.value = [].slice.call(input.value).join('').replace(' ', '&nbsp;');
            }
            updateWidth()
        },
        send() {
            (isFinished()) ||
            this.validate()
                .then(submit)
                .then(delay(120))
                .then(changeLabel)
                .then(clearText)
                .catch(err => {
                    if(err.code === 54) {
                        this.destruct();
                    }else {
                        shakeButton();
                    }
                    this.fireEvent('error', err);
                });
        },
        async validate() {
            if (getRegExp()) return "";
            throw Error('Validation Failed for field: ' + current()); 
        },
        on(action, callback) {
            EVENTS[action] = callback;
            return this;    
        },
        fireEvent(eventname, ...args) {
            if(Object.keys(EVENTS).includes(eventname))
            switch(eventname) {
                case "complete":
                    args = [fields];
                default:
                EVENTS[eventname].apply(this, [...args]);
            }
        },
        destruct() {
            Promise.resolve().then(playFinalAnimation).then(delay(300))
            .then(() => {
                ssInput.classList.remove('focused');
                ssInput.classList.add('finished')
            });
            ssInput.removeEventListener('click', this.focusIn.bind(this))
            submitButton.removeEventListener('click', this.send.bind(this))
            input.outerHTML = ""
            submitButton.outerHTML = ""
            this.fireEvent('complete');
        }
    }
}