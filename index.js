"use strict";
// This code is part of Strilab, which is licensed under the MIT License.
// Copyright (c) 2019 Chiphyr <alexmcp@protonmail.com>
exports.__esModule = true;
var fs_1 = require("fs");
function parseSync(file) {
    var strings = {};
    if (!file.endsWith(".strl") ||
        !file.endsWith(".strl/") ||
        !file.endsWith(".strl\\"))
        throw new Error("The file provided does not have the .strl file extension. This error was thrown for security.");
    var fileCont = fs_1.readFileSync("" + file, "utf8");
    if (!fileCont)
        throw new Error(file + " could not be read.");
    fileCont = fileCont.split("\n");
    fileCont.forEach(function (line) {
        if (line.startsWith("#"))
            return;
        var _a = line.split(" "), name = _a[0], words = _a.slice(1);
        var joined = words.join(" ");
        return (strings[name] = { words: words, joined: joined, name: name });
    });
    return strings;
}
exports.parseSync = parseSync;
function parseFolderSync(folder) {
    var strings = {};
    var dirCont = fs_1.readdirSync(folder);
    if (!dirCont)
        throw new Error(folder + " could not be read.");
    dirCont.forEach(function (file) {
        var parsed = parseSync(folder + "/" + file);
        return (strings[file.replace(".strl", "")] = parsed);
    });
    return strings;
}
exports.parseFolderSync = parseFolderSync;
var Reader = /** @class */ (function () {
    function Reader(config) {
        if (!config)
            throw new Error("A config object was not passed.");
        if (!config.folder)
            throw new Error("A folder property of the config object must exist.");
        this.config = config;
        this.strings = {};
        this.load();
    }
    Reader.prototype.load = function () {
        return (this.strings = parseFolderSync(this.config.folder));
    };
    Reader.prototype.get = function (locale, string) {
        if (!locale || !string)
            throw new Error("Locale [1] and string [2] must both be passed.");
        return this.strings[locale][string] || null;
    };
    return Reader;
}());
exports.Reader = Reader;
