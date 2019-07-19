const config = require("esnext-scripts");

module.exports = {
    ...config.eslint,
    extends: (config.eslint.extends || []).concat[("plugin:editorconfig/noconflict", "esnext")],
    rules: Object.assign({}, config.eslint.rules, { semi: ["error", "never"] }),
    extends: (config.eslint.plugins || []).concat["editorconfig"]
};
