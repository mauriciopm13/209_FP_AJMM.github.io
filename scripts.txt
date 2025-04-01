
window.addEventListener("load", () => {
  const scroller = scrollama();

  scroller
    .setup({
      step: ".step",
      offset: 0.5,
      once: true
    })
    .onStepEnter(response => {
      response.element.classList.add("visible");
    });
});
