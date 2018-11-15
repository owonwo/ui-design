const config = {
    duration: 700,
    activeClassName: 'active',
}

const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

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
        // console.log(this.shutters);
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
        bounceOut: () => {
            x.style.left = 0;
            return Identity(x);
        }
    }
}


const hideIcon = (el) => {
    setTimeout(() => el.style.visibility = "hidden", 300);
    return el;
}

const bounceOut = (el) => {
    el.style.left = 0;
    el.style.borderColor = '#FFFFFF';
    return el;
}


const IconHolder = () => {
    let left = 0;
    const holder = document.querySelector('.wg-ss__icon_holder');
    let icons = [].slice.call(holder.children).map(x => Identity(x));

    return {
        init() {
            console.time('ICONS TIME')
            icons.map((e, index) => {
                e.map((x) => {
                    x.style.left = `${left}px`
                    if(index > 0) 
                        x.style.borderColor = `#777777`
                    left += 5;
                });
                return e;
            }).reverse().map((e, key) => {
                e.map(x => x.style.zIndex = key);
            });
            console.timeEnd('ICONS TIME')
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
            email: {value:'', regexp: /^.+@.+\..+$/},
            password: {value: '', regexp: /[A-z0-9_-]+/},
        };
    let counter = 0;
    /**
     * @return String
     */
    const current = () => Object.keys(fields)[counter];
    const getRegExp = () =>  {
        const input = fields[current()];
        return input.regexp.test(input.value);
    }
    const isFinished = () => counter > (Object.keys(fields).length - 1);
    window.isFinished = isFinished;

    const changeLabel = () => {
        label.innerText = current();
    }
    const makeDots = () => '<span class="dots"></span>';

    return {
        init() {
            changeLabel();
            ssInput.appendChild(input);
            iconHolder.init();

            ssInput.addEventListener('click', ( ) => {
                input.focus();
                input.addEventListener('keyup', (event) => {
                    if(event.keyCode === 13) {
                        this.send.bind(this)()
                        return
                    }

                    const currentField = fields[current()];

                    if(current() === 'password') {
                        currentField.value = [].slice.call(input.value).join('');
                        span.innerHTML = currentField.value.split("").map(makeDots).join('');
                    } else {
                        span.innerText = currentField.value = [].slice.call(input.value).join('');
                    }
                });
            });
            submitButton.addEventListener('click', this.send.bind(this));
        },
        send() {
            const slideRight = (el) => {
                const offset = Math.abs(ssInput.clientWidth);
                el.style.transform = `translateX(${offset}px) rotate(-16deg)`;
                return el;
            }

            const shakeButton = () => {
                ssInput.classList.add('wiggle')
                submitButton.classList.add('shake')

                setTimeout(() => {
                    ssInput.classList.remove('wiggle')
                    submitButton.classList.remove('shake');
                }, 600);
            }

            const submit = () => {
                if (!isFinished()) {
                    counter += 1;
                    changeLabel();
                }

                console.log(current(), counter);
                console.log('called!');
            }

            const clearText = () => {
                setTimeout(() => {
                    input.value = ""
                    span.innerText = ""
                }, 150);
            }

            this.validate()
                .then(() => {
                    if (!isFinished()) {
                        iconHolder.fetchIcon(counter)
                         .map(slideRight)
                         .map(hideIcon)
                        
                        setTimeout(() => {
                            iconHolder.fetchIcon(counter).map(bounceOut);
                        }, 300);
                    }
                })
                .then(clearText).then(submit)
                .catch(err => {
                    shakeButton();
                    console.log(err);
                })
        },
        fields() {
            return fields;
        },
        async validate() {
            if (getRegExp()) return "";
            throw Error('Validation Failed!'); 
        }
    }
}