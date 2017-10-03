const arr = [
    {
        foo: true,
        goo: false
    },
    {
        foo: false,
        foh: true
    }
].map(function (item) {
    return {
        fff: item.foo
    };
});
console.log(arr);
//[{foo: true},{foo: false}]