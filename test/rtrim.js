tests([
    [' abc  ', ' abc'],
    [' abc  \r \n \t \f \v', ' abc'],
    ['_abc_', '_', '_abc'],
    ['_abc_', ['c', '_'], '_ab'],
    ['_abc_', 'c_', '_ab']
]);
