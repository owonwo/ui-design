const $ = (s, el = document) => el.querySelector(s)
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s))

const toggleClass = (classname, el) => el.classList.toggle(classname);
Element.prototype.setStyle = function setStyle(props) {
    Object.entries(props).forEach(([prop, value]) => {
        this.style[prop] = value
    })
}

const animateProductCards = (classname, arrayofElems, duration = 300) => {
    let count = 0;
    const intervalId = setInterval(() => {
        if (count == (arrayofElems.length - 1)) {
            clearInterval(intervalId)
        }
        toggleClass(classname, arrayofElems[count]);
        count += 1;
    }, duration);
}

const doStuff = () => {
  const leftPane = $(".ax_left");
  const rightPane = $(".ax_right");
  const { width, height } = leftPane.getBoundingClientRect();

  leftPane.addEventListener("click", () => {
    const figure = leftPane.querySelector(".ax_product_image");
    toggleClass("preview", leftPane);
    toggleClass("preview", rightPane);
    setTimeout(() => {
        animateProductCards("slide-in", $$("figure", rightPane), 100);
    }, 1000);

    if (leftPane.classList.contains("preview")) {
      figure.setStyle({ width: width + "px", height: height + "px" });
    } else {
      figure.setStyle({
        width: width * 0.6 + "px",
        height: height * 0.4 + "px"
      });
    }
  });
  console.log({ width, height });
};

const fnX = (state, ii, { activeClass }) => {
  if (state) {
    ii.classList.add(activeClass)
  } else {
    ii.classList.remove(activeClass);
  }
}

const clickEvent = (elms, activeClass = "is-active", functor = fnX ) => fn => {
  const navLinks = elms;
  const meta = { activeClass, index: 0, event: new CustomEvent('laugh'), lastIndex: 0 };
  
  const getLastActive = next => (c, i) => {
    if (c.classList.contains(activeClass))
      meta.lastIndex = i;

    next(c, i)
  }

  navLinks.forEach((el, index) =>
    el.addEventListener("click", evt => {
      meta.event = evt;
      meta.index = index;

      // remove active from other
      navLinks.forEach(getLastActive((others) => {
        functor(false, others, meta)
      }));

      // add active
      functor(true, el, meta);
      fn(el, meta);
    })
  );
  return index => navLinks[index].click(); 
};

const showMenu = () => {
  const buttons = $$('[data-toggle=menu]');
  const navigations = $$(".fancy-menu li");
  const toggleMenu = () => {
    const zUpper = $('.z-upper')
    const menuArea = $('.ax_menu_area');

    zUpper.classList.toggle('expand');
    menuArea.classList.toggle('expand')

    // click the first one when not active
    console.log($(".fancy-menu li.active"));
    if (!$('.fancy-menu li.active')) 
      navigations[0].click();
  }

  [...buttons].map(e => e.addEventListener('click', toggleMenu));
  buttons[0].click();
  
  clickEvent(
    navigations,
    "active"
  )((current, { index }) => slideNow(index));
}

window.addEventListener('load', () => {
  doStuff()
  showMenu()
  // animates the slide in the menu 
  const handleChange = (state, el, { lastIndex, index, activeClass }) => {
    if (index === 0) {
      el.classList.add(activeClass)
    } else if (lastIndex > index) {
      el.classList.remove(activeClass);
    }
  }

  window.slideNow = clickEvent(
    $$(".ax_menu_area .slide-item"), 
    'reveal',
    handleChange
  )((current, { index }) => {
    // console.log(current, index);
    // e.classList.add("reveal");
  });
})
