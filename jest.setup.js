// jest.setup.js

// Polyfill TextEncoder/TextDecoder for Node
global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;
