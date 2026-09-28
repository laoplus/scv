export function onPageTransitionStart() {
    console.time("transition");
    console.log("Page transition start");
    const main = document.querySelector("main");
    if (!main) throw new Error("Missing main element");
    main.classList.add("page-transition");
}
