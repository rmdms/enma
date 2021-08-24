/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/code.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/code.ts":
/*!*********************!*\
  !*** ./src/code.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
executeExport();
function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
function getValuewithUnit(node) {
    let unit = null;
    switch (node.unit) {
        case 'PIXELS':
            unit = 'px';
            break;
        case 'PERCENT':
            unit = '%';
            break;
        case 'AUTO':
            unit = 'auto';
            break;
    }
    if (unit) {
        if (node.value === undefined) {
            return unit;
        }
        else {
            return node.value + unit;
        }
    }
}
function getSVGContent(node) {
    return __awaiter(this, void 0, void 0, function* () {
        let svg = String.fromCharCode.apply(null, yield node.exportAsync({ format: 'SVG' }));
        let split = svg.split('>');
        let parent = [];
        parent.push(split[0] + '>');
        parent.push(split[split.length - 2] + '>');
        split.shift();
        split.pop();
        split.pop();
        let child = [];
        split.forEach(spl => {
            child.push(spl + '>');
        });
        return child.join();
    });
}
function getTo(node, id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (node.id === id) {
            return node.name;
        }
        else {
            if ("children" in node) {
                let name = undefined;
                for (const child of node.children) {
                    let result = yield getTo(child, id);
                    if (result) {
                        name = result;
                    }
                }
                return name;
            }
        }
    });
}
function getContent(node) {
    return __awaiter(this, void 0, void 0, function* () {
        let datas = {};
        (node.id !== undefined) && (datas["id"] = node.id);
        (node.name !== undefined) && (datas["name"] = node.name);
        (node.x !== undefined && node.y !== undefined) && (datas["position"] = {
            x: Math.floor(node.x),
            y: Math.floor(node.y),
            z: 0
        });
        (node.rotation !== undefined) && (datas["rotation"] = {
            x: 0,
            y: 0,
            z: (node.rotation === -0) ? 0 : node.rotation
        });
        (node.width !== undefined) && (datas["width"] = node.width);
        (node.height !== undefined) && (datas["height"] = node.height);
        if (node.backgrounds && node.backgrounds.length !== 0) {
            if (node.backgrounds[0].type === "SOLID") {
                datas["backgroundColor"] = {
                    r: map_range(node.backgrounds[0].color.r, 0, 1, 0, 255),
                    g: map_range(node.backgrounds[0].color.g, 0, 1, 0, 255),
                    b: map_range(node.backgrounds[0].color.b, 0, 1, 0, 255)
                };
            }
        }
        (node.opacity !== undefined) && (datas["opacity"] = node.opacity);
        if ("children" in node) {
            if (datas["name"] !== "svg") {
                let children = [];
                for (const child of node.children) {
                    const result = yield getContent(child);
                    if (Object.keys(result).length !== 0) {
                        children = children.concat(result);
                    }
                }
                if (children.length !== 0) {
                    datas["children"] = children;
                }
            }
        }
        switch (node.type) {
            case "FRAME":
                if (datas["name"] === "story") {
                    datas["tag"] = "main";
                }
                else if (datas["name"] === "chapter") {
                    datas["tag"] = "section";
                }
                else if (datas["name"] === "modal") {
                    datas["tag"] = "modal";
                }
                else if (datas["name"] === "svg") {
                    datas["tag"] = "svg";
                    datas["bytes"] = yield node.exportAsync({ format: datas["name"].toUpperCase() });
                    datas["format"] = datas["name"];
                    datas["name"] = "vector";
                }
                else if (datas["name"] === "animation-fix" || datas["name"] === "animation-scroll") {
                    datas["tag"] = "animation";
                    const split = datas["name"].split('-');
                    const splitType = split[1];
                    datas["type"] = splitType;
                }
                break;
            case "GROUP":
                if (datas["name"] === "sticky") {
                    datas["tag"] = "sticky";
                }
                else if (datas["name"] === "parallax") {
                    datas["tag"] = "scroller";
                    if (node.effects && node.effects.length > 0) {
                        datas["gap"] = node.effects[0].offset;
                    }
                }
                else if (datas["name"] === "animation-fix" || datas["name"] === "animation-scroll") {
                    datas["tag"] = "animation";
                    const split = datas["name"].split('-');
                    const splitType = split[1];
                    datas["type"] = splitType;
                }
                break;
            case "TEXT":
                if (datas["name"] === "headline") {
                    datas["tag"] = "h2";
                }
                else if (datas["name"] === "paragraphe") {
                    datas["tag"] = "p";
                }
                datas["name"] = "text";
                datas["characters"] = node.characters;
                datas["color"] = {
                    r: map_range(node.fills[0].color.r, 0, 1, 0, 255),
                    g: map_range(node.fills[0].color.g, 0, 1, 0, 255),
                    b: map_range(node.fills[0].color.b, 0, 1, 0, 255)
                };
                datas["fontFamily"] = node.fontName.family;
                datas["fontSize"] = node.fontSize;
                datas["fontWeight"] = node.fontName.style === 'Regular' ? 'normal' : node.fontName.style && node.fontName.style.toLowerCase();
                datas["letterSpacing"] = getValuewithUnit(node.letterSpacing);
                datas["lineHeight"] = getValuewithUnit(node.lineHeight);
                datas["textAlign"] = node.textAlignHorizontal;
                break;
            case "VECTOR":
                if (datas["name"] === "svg") {
                    datas["tag"] = "svg";
                    datas["bytes"] = yield node.exportAsync({ format: datas["name"].toUpperCase() });
                    datas["format"] = datas["name"];
                    datas["name"] = "vector";
                }
                break;
            case "RECTANGLE":
                if (node.fills[0].type === "IMAGE") {
                    const split = datas["name"].split('-');
                    const splitFormat = split[0];
                    const splitIndex = split[1];
                    if (datas["name"] === "jpg" || datas["name"] === "png") {
                        datas["tag"] = "img";
                        datas["bytes"] = yield node.exportAsync({ format: datas["name"].toUpperCase(), constraint: { type: "SCALE", value: 2 } });
                        datas["format"] = datas["name"];
                        datas["name"] = "image";
                    }
                    else if (splitFormat === "jpg" || splitFormat === "png") {
                        datas["tag"] = "img";
                        datas["bytes"] = yield node.exportAsync({ format: splitFormat.toUpperCase(), constraint: { type: "SCALE", value: 2 } });
                        datas["format"] = splitFormat;
                        datas["name"] = "image";
                        datas["index"] = splitIndex;
                    }
                }
                else {
                    if (datas["name"] === "sound-testimony" || datas["name"] === "sound-ambient" || datas["name"] === "sound-noise") {
                        datas["tag"] = "sound";
                        if (node.fills && node.fills.length !== 0) {
                            if (node.fills[0].type === "SOLID") {
                                datas["backgroundColor"] = {
                                    r: map_range(node.fills[0].color.r, 0, 1, 0, 255),
                                    g: map_range(node.fills[0].color.g, 0, 1, 0, 255),
                                    b: map_range(node.fills[0].color.b, 0, 1, 0, 255)
                                };
                            }
                        }
                    }
                    else if (datas["name"] === "rectangle") {
                        datas["tag"] = "div";
                        if (node.fills && node.fills.length !== 0) {
                            if (node.fills[0].type === "SOLID") {
                                datas["backgroundColor"] = {
                                    r: map_range(node.fills[0].color.r, 0, 1, 0, 255),
                                    g: map_range(node.fills[0].color.g, 0, 1, 0, 255),
                                    b: map_range(node.fills[0].color.b, 0, 1, 0, 255)
                                };
                            }
                        }
                    }
                }
                break;
        }
        if (node.reactions && node.reactions.length !== 0) {
            if (node.reactions[0].action.navigation === "NAVIGATE") {
                const children = [Object.assign({}, datas)];
                datas["children"] = children;
                datas["tag"] = "link";
                datas["name"] = "action";
                datas["to"] = yield getTo(figma.currentPage, node.reactions[0].action.destinationId);
            }
            else if (node.reactions[0].action.navigation === "OVERLAY") {
                const children = [Object.assign({}, datas)];
                datas["children"] = children;
                datas["tag"] = "overlay";
                datas["name"] = "action";
                datas["trigger"] = node.reactions[0].trigger.type.toLowerCase();
                datas["overlay"] = yield getTo(figma.currentPage, node.reactions[0].action.destinationId);
                datas = [Object.assign({}, datas), yield getContent(figma.getNodeById(node.reactions[0].action.destinationId))];
            }
        }
        console.log(node.name, datas);
        return datas;
    });
}
function executeExport() {
    return __awaiter(this, void 0, void 0, function* () {
        const datas = yield getContent(figma.currentPage);
        console.log('datas');
        console.log(datas);
        figma.showUI(__html__, { visible: false });
        figma.ui.postMessage(datas);
    });
}
figma.ui.onmessage = (response) => __awaiter(this, void 0, void 0, function* () {
    if (Object.keys(response).length === 0) {
        figma.closePlugin("Error 🙈");
    }
    else {
        figma.closePlugin("Updated 🎉");
    }
});


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0EsMkJBQTJCLCtEQUErRCxnQkFBZ0IsRUFBRSxFQUFFO0FBQzlHO0FBQ0EsbUNBQW1DLE1BQU0sNkJBQTZCLEVBQUUsWUFBWSxXQUFXLEVBQUU7QUFDakcsa0NBQWtDLE1BQU0saUNBQWlDLEVBQUUsWUFBWSxXQUFXLEVBQUU7QUFDcEcsK0JBQStCLHFGQUFxRjtBQUNwSDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEVBQTBFLGdCQUFnQjtBQUMxRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkRBQTZELHNDQUFzQztBQUNuRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2REFBNkQsc0NBQXNDO0FBQ25HO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRUFBaUUsbURBQW1ELDBCQUEwQixFQUFFO0FBQ2hKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRUFBaUUsaURBQWlELDBCQUEwQixFQUFFO0FBQzlJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0Q7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtEO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLGlCQUFpQjtBQUNqRDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyIsImZpbGUiOiJjb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvY29kZS50c1wiKTtcbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuZXhlY3V0ZUV4cG9ydCgpO1xuZnVuY3Rpb24gbWFwX3JhbmdlKHZhbHVlLCBsb3cxLCBoaWdoMSwgbG93MiwgaGlnaDIpIHtcbiAgICByZXR1cm4gbG93MiArIChoaWdoMiAtIGxvdzIpICogKHZhbHVlIC0gbG93MSkgLyAoaGlnaDEgLSBsb3cxKTtcbn1cbmZ1bmN0aW9uIGdldFZhbHVld2l0aFVuaXQobm9kZSkge1xuICAgIGxldCB1bml0ID0gbnVsbDtcbiAgICBzd2l0Y2ggKG5vZGUudW5pdCkge1xuICAgICAgICBjYXNlICdQSVhFTFMnOlxuICAgICAgICAgICAgdW5pdCA9ICdweCc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnUEVSQ0VOVCc6XG4gICAgICAgICAgICB1bml0ID0gJyUnO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0FVVE8nOlxuICAgICAgICAgICAgdW5pdCA9ICdhdXRvJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBpZiAodW5pdCkge1xuICAgICAgICBpZiAobm9kZS52YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5pdDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLnZhbHVlICsgdW5pdDtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIGdldFNWR0NvbnRlbnQobm9kZSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGxldCBzdmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIHlpZWxkIG5vZGUuZXhwb3J0QXN5bmMoeyBmb3JtYXQ6ICdTVkcnIH0pKTtcbiAgICAgICAgbGV0IHNwbGl0ID0gc3ZnLnNwbGl0KCc+Jyk7XG4gICAgICAgIGxldCBwYXJlbnQgPSBbXTtcbiAgICAgICAgcGFyZW50LnB1c2goc3BsaXRbMF0gKyAnPicpO1xuICAgICAgICBwYXJlbnQucHVzaChzcGxpdFtzcGxpdC5sZW5ndGggLSAyXSArICc+Jyk7XG4gICAgICAgIHNwbGl0LnNoaWZ0KCk7XG4gICAgICAgIHNwbGl0LnBvcCgpO1xuICAgICAgICBzcGxpdC5wb3AoKTtcbiAgICAgICAgbGV0IGNoaWxkID0gW107XG4gICAgICAgIHNwbGl0LmZvckVhY2goc3BsID0+IHtcbiAgICAgICAgICAgIGNoaWxkLnB1c2goc3BsICsgJz4nKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjaGlsZC5qb2luKCk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBnZXRUbyhub2RlLCBpZCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGlmIChub2RlLmlkID09PSBpZCkge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUubmFtZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChcImNoaWxkcmVuXCIgaW4gbm9kZSkge1xuICAgICAgICAgICAgICAgIGxldCBuYW1lID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0geWllbGQgZ2V0VG8oY2hpbGQsIGlkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufVxuZnVuY3Rpb24gZ2V0Q29udGVudChub2RlKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgbGV0IGRhdGFzID0ge307XG4gICAgICAgIChub2RlLmlkICE9PSB1bmRlZmluZWQpICYmIChkYXRhc1tcImlkXCJdID0gbm9kZS5pZCk7XG4gICAgICAgIChub2RlLm5hbWUgIT09IHVuZGVmaW5lZCkgJiYgKGRhdGFzW1wibmFtZVwiXSA9IG5vZGUubmFtZSk7XG4gICAgICAgIChub2RlLnggIT09IHVuZGVmaW5lZCAmJiBub2RlLnkgIT09IHVuZGVmaW5lZCkgJiYgKGRhdGFzW1wicG9zaXRpb25cIl0gPSB7XG4gICAgICAgICAgICB4OiBNYXRoLmZsb29yKG5vZGUueCksXG4gICAgICAgICAgICB5OiBNYXRoLmZsb29yKG5vZGUueSksXG4gICAgICAgICAgICB6OiAwXG4gICAgICAgIH0pO1xuICAgICAgICAobm9kZS5yb3RhdGlvbiAhPT0gdW5kZWZpbmVkKSAmJiAoZGF0YXNbXCJyb3RhdGlvblwiXSA9IHtcbiAgICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgICB5OiAwLFxuICAgICAgICAgICAgejogKG5vZGUucm90YXRpb24gPT09IC0wKSA/IDAgOiBub2RlLnJvdGF0aW9uXG4gICAgICAgIH0pO1xuICAgICAgICAobm9kZS53aWR0aCAhPT0gdW5kZWZpbmVkKSAmJiAoZGF0YXNbXCJ3aWR0aFwiXSA9IG5vZGUud2lkdGgpO1xuICAgICAgICAobm9kZS5oZWlnaHQgIT09IHVuZGVmaW5lZCkgJiYgKGRhdGFzW1wiaGVpZ2h0XCJdID0gbm9kZS5oZWlnaHQpO1xuICAgICAgICBpZiAobm9kZS5iYWNrZ3JvdW5kcyAmJiBub2RlLmJhY2tncm91bmRzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgaWYgKG5vZGUuYmFja2dyb3VuZHNbMF0udHlwZSA9PT0gXCJTT0xJRFwiKSB7XG4gICAgICAgICAgICAgICAgZGF0YXNbXCJiYWNrZ3JvdW5kQ29sb3JcIl0gPSB7XG4gICAgICAgICAgICAgICAgICAgIHI6IG1hcF9yYW5nZShub2RlLmJhY2tncm91bmRzWzBdLmNvbG9yLnIsIDAsIDEsIDAsIDI1NSksXG4gICAgICAgICAgICAgICAgICAgIGc6IG1hcF9yYW5nZShub2RlLmJhY2tncm91bmRzWzBdLmNvbG9yLmcsIDAsIDEsIDAsIDI1NSksXG4gICAgICAgICAgICAgICAgICAgIGI6IG1hcF9yYW5nZShub2RlLmJhY2tncm91bmRzWzBdLmNvbG9yLmIsIDAsIDEsIDAsIDI1NSlcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIChub2RlLm9wYWNpdHkgIT09IHVuZGVmaW5lZCkgJiYgKGRhdGFzW1wib3BhY2l0eVwiXSA9IG5vZGUub3BhY2l0eSk7XG4gICAgICAgIGlmIChcImNoaWxkcmVuXCIgaW4gbm9kZSkge1xuICAgICAgICAgICAgaWYgKGRhdGFzW1wibmFtZVwiXSAhPT0gXCJzdmdcIikge1xuICAgICAgICAgICAgICAgIGxldCBjaGlsZHJlbiA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSB5aWVsZCBnZXRDb250ZW50KGNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKHJlc3VsdCkubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IGNoaWxkcmVuLmNvbmNhdChyZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChjaGlsZHJlbi5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YXNbXCJjaGlsZHJlblwiXSA9IGNoaWxkcmVuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKG5vZGUudHlwZSkge1xuICAgICAgICAgICAgY2FzZSBcIkZSQU1FXCI6XG4gICAgICAgICAgICAgICAgaWYgKGRhdGFzW1wibmFtZVwiXSA9PT0gXCJzdG9yeVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFzW1widGFnXCJdID0gXCJtYWluXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGRhdGFzW1wibmFtZVwiXSA9PT0gXCJjaGFwdGVyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YXNbXCJ0YWdcIl0gPSBcInNlY3Rpb25cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZGF0YXNbXCJuYW1lXCJdID09PSBcIm1vZGFsXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YXNbXCJ0YWdcIl0gPSBcIm1vZGFsXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGRhdGFzW1wibmFtZVwiXSA9PT0gXCJzdmdcIikge1xuICAgICAgICAgICAgICAgICAgICBkYXRhc1tcInRhZ1wiXSA9IFwic3ZnXCI7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFzW1wiYnl0ZXNcIl0gPSB5aWVsZCBub2RlLmV4cG9ydEFzeW5jKHsgZm9ybWF0OiBkYXRhc1tcIm5hbWVcIl0udG9VcHBlckNhc2UoKSB9KTtcbiAgICAgICAgICAgICAgICAgICAgZGF0YXNbXCJmb3JtYXRcIl0gPSBkYXRhc1tcIm5hbWVcIl07XG4gICAgICAgICAgICAgICAgICAgIGRhdGFzW1wibmFtZVwiXSA9IFwidmVjdG9yXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGRhdGFzW1wibmFtZVwiXSA9PT0gXCJhbmltYXRpb24tZml4XCIgfHwgZGF0YXNbXCJuYW1lXCJdID09PSBcImFuaW1hdGlvbi1zY3JvbGxcIikge1xuICAgICAgICAgICAgICAgICAgICBkYXRhc1tcInRhZ1wiXSA9IFwiYW5pbWF0aW9uXCI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNwbGl0ID0gZGF0YXNbXCJuYW1lXCJdLnNwbGl0KCctJyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNwbGl0VHlwZSA9IHNwbGl0WzFdO1xuICAgICAgICAgICAgICAgICAgICBkYXRhc1tcInR5cGVcIl0gPSBzcGxpdFR5cGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkdST1VQXCI6XG4gICAgICAgICAgICAgICAgaWYgKGRhdGFzW1wibmFtZVwiXSA9PT0gXCJzdGlja3lcIikge1xuICAgICAgICAgICAgICAgICAgICBkYXRhc1tcInRhZ1wiXSA9IFwic3RpY2t5XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGRhdGFzW1wibmFtZVwiXSA9PT0gXCJwYXJhbGxheFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFzW1widGFnXCJdID0gXCJzY3JvbGxlclwiO1xuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5lZmZlY3RzICYmIG5vZGUuZWZmZWN0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhc1tcImdhcFwiXSA9IG5vZGUuZWZmZWN0c1swXS5vZmZzZXQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZGF0YXNbXCJuYW1lXCJdID09PSBcImFuaW1hdGlvbi1maXhcIiB8fCBkYXRhc1tcIm5hbWVcIl0gPT09IFwiYW5pbWF0aW9uLXNjcm9sbFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFzW1widGFnXCJdID0gXCJhbmltYXRpb25cIjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3BsaXQgPSBkYXRhc1tcIm5hbWVcIl0uc3BsaXQoJy0nKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3BsaXRUeXBlID0gc3BsaXRbMV07XG4gICAgICAgICAgICAgICAgICAgIGRhdGFzW1widHlwZVwiXSA9IHNwbGl0VHlwZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiVEVYVFwiOlxuICAgICAgICAgICAgICAgIGlmIChkYXRhc1tcIm5hbWVcIl0gPT09IFwiaGVhZGxpbmVcIikge1xuICAgICAgICAgICAgICAgICAgICBkYXRhc1tcInRhZ1wiXSA9IFwiaDJcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZGF0YXNbXCJuYW1lXCJdID09PSBcInBhcmFncmFwaGVcIikge1xuICAgICAgICAgICAgICAgICAgICBkYXRhc1tcInRhZ1wiXSA9IFwicFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkYXRhc1tcIm5hbWVcIl0gPSBcInRleHRcIjtcbiAgICAgICAgICAgICAgICBkYXRhc1tcImNoYXJhY3RlcnNcIl0gPSBub2RlLmNoYXJhY3RlcnM7XG4gICAgICAgICAgICAgICAgZGF0YXNbXCJjb2xvclwiXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgcjogbWFwX3JhbmdlKG5vZGUuZmlsbHNbMF0uY29sb3IuciwgMCwgMSwgMCwgMjU1KSxcbiAgICAgICAgICAgICAgICAgICAgZzogbWFwX3JhbmdlKG5vZGUuZmlsbHNbMF0uY29sb3IuZywgMCwgMSwgMCwgMjU1KSxcbiAgICAgICAgICAgICAgICAgICAgYjogbWFwX3JhbmdlKG5vZGUuZmlsbHNbMF0uY29sb3IuYiwgMCwgMSwgMCwgMjU1KVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgZGF0YXNbXCJmb250RmFtaWx5XCJdID0gbm9kZS5mb250TmFtZS5mYW1pbHk7XG4gICAgICAgICAgICAgICAgZGF0YXNbXCJmb250U2l6ZVwiXSA9IG5vZGUuZm9udFNpemU7XG4gICAgICAgICAgICAgICAgZGF0YXNbXCJmb250V2VpZ2h0XCJdID0gbm9kZS5mb250TmFtZS5zdHlsZSA9PT0gJ1JlZ3VsYXInID8gJ25vcm1hbCcgOiBub2RlLmZvbnROYW1lLnN0eWxlICYmIG5vZGUuZm9udE5hbWUuc3R5bGUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICBkYXRhc1tcImxldHRlclNwYWNpbmdcIl0gPSBnZXRWYWx1ZXdpdGhVbml0KG5vZGUubGV0dGVyU3BhY2luZyk7XG4gICAgICAgICAgICAgICAgZGF0YXNbXCJsaW5lSGVpZ2h0XCJdID0gZ2V0VmFsdWV3aXRoVW5pdChub2RlLmxpbmVIZWlnaHQpO1xuICAgICAgICAgICAgICAgIGRhdGFzW1widGV4dEFsaWduXCJdID0gbm9kZS50ZXh0QWxpZ25Ib3Jpem9udGFsO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlZFQ1RPUlwiOlxuICAgICAgICAgICAgICAgIGlmIChkYXRhc1tcIm5hbWVcIl0gPT09IFwic3ZnXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YXNbXCJ0YWdcIl0gPSBcInN2Z1wiO1xuICAgICAgICAgICAgICAgICAgICBkYXRhc1tcImJ5dGVzXCJdID0geWllbGQgbm9kZS5leHBvcnRBc3luYyh7IGZvcm1hdDogZGF0YXNbXCJuYW1lXCJdLnRvVXBwZXJDYXNlKCkgfSk7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFzW1wiZm9ybWF0XCJdID0gZGF0YXNbXCJuYW1lXCJdO1xuICAgICAgICAgICAgICAgICAgICBkYXRhc1tcIm5hbWVcIl0gPSBcInZlY3RvclwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJSRUNUQU5HTEVcIjpcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5maWxsc1swXS50eXBlID09PSBcIklNQUdFXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3BsaXQgPSBkYXRhc1tcIm5hbWVcIl0uc3BsaXQoJy0nKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3BsaXRGb3JtYXQgPSBzcGxpdFswXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3BsaXRJbmRleCA9IHNwbGl0WzFdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YXNbXCJuYW1lXCJdID09PSBcImpwZ1wiIHx8IGRhdGFzW1wibmFtZVwiXSA9PT0gXCJwbmdcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YXNbXCJ0YWdcIl0gPSBcImltZ1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YXNbXCJieXRlc1wiXSA9IHlpZWxkIG5vZGUuZXhwb3J0QXN5bmMoeyBmb3JtYXQ6IGRhdGFzW1wibmFtZVwiXS50b1VwcGVyQ2FzZSgpLCBjb25zdHJhaW50OiB7IHR5cGU6IFwiU0NBTEVcIiwgdmFsdWU6IDIgfSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFzW1wiZm9ybWF0XCJdID0gZGF0YXNbXCJuYW1lXCJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YXNbXCJuYW1lXCJdID0gXCJpbWFnZVwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHNwbGl0Rm9ybWF0ID09PSBcImpwZ1wiIHx8IHNwbGl0Rm9ybWF0ID09PSBcInBuZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhc1tcInRhZ1wiXSA9IFwiaW1nXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhc1tcImJ5dGVzXCJdID0geWllbGQgbm9kZS5leHBvcnRBc3luYyh7IGZvcm1hdDogc3BsaXRGb3JtYXQudG9VcHBlckNhc2UoKSwgY29uc3RyYWludDogeyB0eXBlOiBcIlNDQUxFXCIsIHZhbHVlOiAyIH0gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhc1tcImZvcm1hdFwiXSA9IHNwbGl0Rm9ybWF0O1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YXNbXCJuYW1lXCJdID0gXCJpbWFnZVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YXNbXCJpbmRleFwiXSA9IHNwbGl0SW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhc1tcIm5hbWVcIl0gPT09IFwic291bmQtdGVzdGltb255XCIgfHwgZGF0YXNbXCJuYW1lXCJdID09PSBcInNvdW5kLWFtYmllbnRcIiB8fCBkYXRhc1tcIm5hbWVcIl0gPT09IFwic291bmQtbm9pc2VcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YXNbXCJ0YWdcIl0gPSBcInNvdW5kXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5maWxscyAmJiBub2RlLmZpbGxzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub2RlLmZpbGxzWzBdLnR5cGUgPT09IFwiU09MSURcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhc1tcImJhY2tncm91bmRDb2xvclwiXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHI6IG1hcF9yYW5nZShub2RlLmZpbGxzWzBdLmNvbG9yLnIsIDAsIDEsIDAsIDI1NSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnOiBtYXBfcmFuZ2Uobm9kZS5maWxsc1swXS5jb2xvci5nLCAwLCAxLCAwLCAyNTUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYjogbWFwX3JhbmdlKG5vZGUuZmlsbHNbMF0uY29sb3IuYiwgMCwgMSwgMCwgMjU1KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChkYXRhc1tcIm5hbWVcIl0gPT09IFwicmVjdGFuZ2xlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFzW1widGFnXCJdID0gXCJkaXZcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub2RlLmZpbGxzICYmIG5vZGUuZmlsbHMubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUuZmlsbHNbMF0udHlwZSA9PT0gXCJTT0xJRFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFzW1wiYmFja2dyb3VuZENvbG9yXCJdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcjogbWFwX3JhbmdlKG5vZGUuZmlsbHNbMF0uY29sb3IuciwgMCwgMSwgMCwgMjU1KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGc6IG1hcF9yYW5nZShub2RlLmZpbGxzWzBdLmNvbG9yLmcsIDAsIDEsIDAsIDI1NSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiOiBtYXBfcmFuZ2Uobm9kZS5maWxsc1swXS5jb2xvci5iLCAwLCAxLCAwLCAyNTUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLnJlYWN0aW9ucyAmJiBub2RlLnJlYWN0aW9ucy5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgIGlmIChub2RlLnJlYWN0aW9uc1swXS5hY3Rpb24ubmF2aWdhdGlvbiA9PT0gXCJOQVZJR0FURVwiKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hpbGRyZW4gPSBbT2JqZWN0LmFzc2lnbih7fSwgZGF0YXMpXTtcbiAgICAgICAgICAgICAgICBkYXRhc1tcImNoaWxkcmVuXCJdID0gY2hpbGRyZW47XG4gICAgICAgICAgICAgICAgZGF0YXNbXCJ0YWdcIl0gPSBcImxpbmtcIjtcbiAgICAgICAgICAgICAgICBkYXRhc1tcIm5hbWVcIl0gPSBcImFjdGlvblwiO1xuICAgICAgICAgICAgICAgIGRhdGFzW1widG9cIl0gPSB5aWVsZCBnZXRUbyhmaWdtYS5jdXJyZW50UGFnZSwgbm9kZS5yZWFjdGlvbnNbMF0uYWN0aW9uLmRlc3RpbmF0aW9uSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobm9kZS5yZWFjdGlvbnNbMF0uYWN0aW9uLm5hdmlnYXRpb24gPT09IFwiT1ZFUkxBWVwiKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hpbGRyZW4gPSBbT2JqZWN0LmFzc2lnbih7fSwgZGF0YXMpXTtcbiAgICAgICAgICAgICAgICBkYXRhc1tcImNoaWxkcmVuXCJdID0gY2hpbGRyZW47XG4gICAgICAgICAgICAgICAgZGF0YXNbXCJ0YWdcIl0gPSBcIm92ZXJsYXlcIjtcbiAgICAgICAgICAgICAgICBkYXRhc1tcIm5hbWVcIl0gPSBcImFjdGlvblwiO1xuICAgICAgICAgICAgICAgIGRhdGFzW1widHJpZ2dlclwiXSA9IG5vZGUucmVhY3Rpb25zWzBdLnRyaWdnZXIudHlwZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIGRhdGFzW1wib3ZlcmxheVwiXSA9IHlpZWxkIGdldFRvKGZpZ21hLmN1cnJlbnRQYWdlLCBub2RlLnJlYWN0aW9uc1swXS5hY3Rpb24uZGVzdGluYXRpb25JZCk7XG4gICAgICAgICAgICAgICAgZGF0YXMgPSBbT2JqZWN0LmFzc2lnbih7fSwgZGF0YXMpLCB5aWVsZCBnZXRDb250ZW50KGZpZ21hLmdldE5vZGVCeUlkKG5vZGUucmVhY3Rpb25zWzBdLmFjdGlvbi5kZXN0aW5hdGlvbklkKSldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKG5vZGUubmFtZSwgZGF0YXMpO1xuICAgICAgICByZXR1cm4gZGF0YXM7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBleGVjdXRlRXhwb3J0KCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGNvbnN0IGRhdGFzID0geWllbGQgZ2V0Q29udGVudChmaWdtYS5jdXJyZW50UGFnZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdkYXRhcycpO1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhcyk7XG4gICAgICAgIGZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB2aXNpYmxlOiBmYWxzZSB9KTtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoZGF0YXMpO1xuICAgIH0pO1xufVxuZmlnbWEudWkub25tZXNzYWdlID0gKHJlc3BvbnNlKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgaWYgKE9iamVjdC5rZXlzKHJlc3BvbnNlKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZmlnbWEuY2xvc2VQbHVnaW4oXCJFcnJvciDwn5mIXCIpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZmlnbWEuY2xvc2VQbHVnaW4oXCJVcGRhdGVkIPCfjolcIik7XG4gICAgfVxufSk7XG4iXSwic291cmNlUm9vdCI6IiJ9