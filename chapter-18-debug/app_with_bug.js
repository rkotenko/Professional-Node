var a = 0;

function init() {
    a = 1;
}

function incr() {
    a = a + 1;
}
init();
console.log('a before: %d', a);

incr();
console.log('a after: %d', a);