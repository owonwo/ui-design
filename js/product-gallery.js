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

window.addEventListener('load', doStuff)