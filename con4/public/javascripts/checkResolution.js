let mql1 = window.matchMedia("(min-width: 1366px)");
let mql2 = window.matchMedia("(min-height: 768px)");

if(!mql1.matches || !mql2.matches) {
    alert("Your screen's resolution is not supported. The game may not work as expected.");
}