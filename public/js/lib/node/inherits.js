define(function () {
    return function (Child, Parent) {
        function F() {}

        F.prototype = Child._super = Parent.prototype;
        Child.prototype = new F();
    }
});
