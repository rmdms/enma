executeExport()

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function getValuewithUnit(node) {
    let unit = null;
    switch(node.unit) {
        case 'PIXELS':
            unit = 'px'
            break;
        case 'PERCENT':
            unit = '%'
            break;
        case 'AUTO':
            unit = 'auto'
            break;
    }
    if (unit) {
        if (node.value === undefined) {
            return unit
        } else {
            return node.value + unit
        }
    }
}

async function getSVGContent(node) {
    let svg = String.fromCharCode.apply(null, await node.exportAsync({ format: 'SVG' }));
    let split = svg.split('>');
    let parent = [];
    parent.push(split[0] + '>');
    parent.push(split[split.length-2] + '>');
    split.shift();
    split.pop();
    split.pop();
    let child = [];
    split.forEach(spl => {
        child.push(spl + '>');
    });
    return child.join();
}

async function getTo(node, id) {
    if (node.id === id) {
        return node.name;
    } 
    else {
        if ("children" in node) {
            let name = undefined;
            for (const child of node.children) {
                let result = await getTo(child, id);
                if (result) {
                    name = result;
                }
            }
            return name;
        }
    }
}

async function getContent(node) {
    let datas = {};
    // id
    (node.id !== undefined) && (datas["id"] = node.id);
    // Name
    (node.name !== undefined) && (datas["name"] = node.name);
    // Position
    (node.x !== undefined && node.y !== undefined) && (datas["position"] = {
        x: Math.floor(node.x),
        y: Math.floor(node.y),
        z: 0
    });
    // Rotation
    (node.rotation !== undefined) && (datas["rotation"] = {
        x: 0,
        y: 0,
        z: (node.rotation === -0) ? 0 : node.rotation
    });
    // Width
    (node.width !== undefined) && (datas["width"] = node.width);
    // Height
    (node.height !== undefined) && (datas["height"] = node.height);
    // Background
    // console.log(node.name, node)
    if (node.backgrounds && node.backgrounds.length !== 0) {
        if (node.backgrounds[0].type === "SOLID") {       
            datas["backgroundColor"] = {
                r: map_range(node.backgrounds[0].color.r, 0, 1, 0, 255),
                g: map_range(node.backgrounds[0].color.g, 0, 1, 0, 255),
                b: map_range(node.backgrounds[0].color.b, 0, 1, 0, 255)
            };
        }
    } 
    // Opacity
    (node.opacity !== undefined) && (datas["opacity"] = node.opacity);
    // Children
    if ("children" in node) {
        if (datas["name"] !== "svg") {
            let children = [];
            for (const child of node.children) {
                const result = await getContent(child);
                if (Object.keys(result).length !== 0) {
                    children = children.concat(result); 
                }
            }
            if (children.length !== 0) {
                datas["children"] = children;
            }
        }
    }
    // console.log(node.name, datas["children"])
    // Tag
    switch(node.type) {
        case "FRAME":
            if (datas["name"] === "story") {
                datas["tag"] = "main";
            } else if (datas["name"] === "chapter") {
                datas["tag"] = "section";
            } else if (datas["name"] === "modal") {
                datas["tag"] = "modal";
            } else if (datas["name"] === "svg") {
                datas["tag"] = "svg";
                datas["bytes"] = await node.exportAsync({ format: datas["name"].toUpperCase() });
                datas["format"] = datas["name"];
                datas["name"] = "vector";
            } else if (datas["name"] === "animation-fix" || datas["name"] === "animation-scroll") {
                datas["tag"] = "animation";
                const split = datas["name"].split('-');
                const splitType = split[1];
                datas["type"] = splitType;
            }
            break;
        case "GROUP":
            if (datas["name"] === "sticky") {
                datas["tag"] = "sticky";
            } else if (datas["name"] === "parallax") {
                datas["tag"] = "scroller";
                if (node.effects && node.effects.length > 0) {
                    datas["gap"] = node.effects[0].offset;
                }
            } else if (datas["name"] === "animation-fix" || datas["name"] === "animation-scroll") {
                datas["tag"] = "animation";
                const split = datas["name"].split('-');
                const splitType = split[1];
                datas["type"] = splitType;
            }
            break;
        case "TEXT":
            if (datas["name"] === "headline") {
                datas["tag"] = "h2";
            } else if (datas["name"] === "paragraphe") {
                datas["tag"] = "p";
            }
            datas["name"] = "text";
            datas["characters"] = node.characters            
            datas["color"] = {
                r: map_range(node.fills[0].color.r, 0, 1, 0, 255),
                g: map_range(node.fills[0].color.g, 0, 1, 0, 255),
                b: map_range(node.fills[0].color.b, 0, 1, 0, 255)
            };
            datas["fontFamily"] = node.fontName.family
            datas["fontSize"] = node.fontSize
            datas["fontWeight"] = node.fontName.style === 'Regular' ? 'normal' : node.fontName.style && node.fontName.style.toLowerCase();
            datas["letterSpacing"] = getValuewithUnit(node.letterSpacing);
            datas["lineHeight"] = getValuewithUnit(node.lineHeight);
            datas["textAlign"] = node.textAlignHorizontal;
            break;
        case "VECTOR":
            if (datas["name"] === "svg") {
                datas["tag"] = "svg";
                datas["bytes"] = await node.exportAsync({ format: datas["name"].toUpperCase() });
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
                    datas["bytes"] = await node.exportAsync({ format: datas["name"].toUpperCase(), constraint: { type: "SCALE", value: 2 } });
                    datas["format"] = datas["name"];
                    datas["name"] = "image";
                } else if (splitFormat === "jpg" || splitFormat === "png") {
                    datas["tag"] = "img";                    
                    datas["bytes"] = await node.exportAsync({ format: splitFormat.toUpperCase(), constraint: { type: "SCALE", value: 2 } });
                    datas["format"] = splitFormat;
                    datas["name"] = "image";
                    datas["index"] = splitIndex;
                }
            } else {
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
                } else if (datas["name"] === "rectangle") {
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
    // Actions
    if (node.reactions && node.reactions.length !== 0) {
        if (node.reactions[0].action.navigation === "NAVIGATE") {
            const children = [{ ...datas }];
            datas["children"] = children;
            datas["tag"] = "link";
            datas["name"] = "action";
            datas["to"] = await getTo(figma.currentPage, node.reactions[0].action.destinationId);
        } else if (node.reactions[0].action.navigation === "OVERLAY") {
            const children = [{ ...datas }];
            datas["children"] = children;
            datas["tag"] = "overlay";
            datas["name"] = "action";
            datas["trigger"] = node.reactions[0].trigger.type.toLowerCase();
            datas["overlay"] = await getTo(figma.currentPage, node.reactions[0].action.destinationId);
            datas = [{ ...datas }, await getContent(figma.getNodeById(node.reactions[0].action.destinationId))];
        } 
    } 
    console.log(node.name, datas)
    return datas;
}

async function executeExport() {
    const datas = await getContent(figma.currentPage);
    console.log('datas')
    console.log(datas)
    figma.showUI(__html__, {visible: false});
    figma.ui.postMessage(datas);
}

figma.ui.onmessage = async (response) => {
    if (Object.keys(response).length === 0) {
        figma.closePlugin("Error 🙈");
    } else {
        figma.closePlugin("Updated 🎉");
    }
}