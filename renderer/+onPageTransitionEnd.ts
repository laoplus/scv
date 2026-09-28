export function onPageTransitionEnd() {
    console.timeEnd("transition");
    console.log("Page transition end");
    const main = document.querySelector("main");
    if (!main) throw new Error("Missing main element");
    main.classList.remove("page-transition");
}
