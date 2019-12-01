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

const clickEvent = (elms, activeClass = "is-active") => fn => {
  const navLinks = elms;
  navLinks.forEach(el =>
    el.addEventListener("click", evt => {
      navLinks.forEach(e => e.classList.remove(activeClass));
      el.classList.add(activeClass);
      fn(el);
    })
  );
};

const showMenu = () => {
  const buttons = $$('[data-toggle=menu]');
  
  const toggleMenu = () => {
    const zUpper = $('.z-upper')
    const menuArea = $('.ax_menu_area');

    zUpper.classList.toggle('expand');
    menuArea.classList.toggle('expand')
  }

  [...buttons].map(e => e.addEventListener('click', toggleMenu));
  // buttons[0].click();
  
  clickEvent(
    $$(".fancy-menu li"),
    "active"
  )(function(current) {
    console.log(current);
  });
}
window.addEventListener('load', () => {
  doStuff()
  showMenu()
})