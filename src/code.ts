
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

async function getContent(node) {
    let datas = {};
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
                    children.push(result);
                }
            }
            if (children.length !== 0) {
                datas["children"] = children;
            }
        }
    }
    // Tag
    switch(node.type) {
        case "FRAME":
            if (datas["name"] === "story") {
                datas["tag"] = "main";
            } else if (datas["name"] === "chapter") {
                datas["tag"] = "section";
            } else if (datas["name"] === "svg") {
                datas["tag"] = "svg";
                datas["bytes"] = await node.exportAsync({ format: datas["name"].toUpperCase() });
                datas["format"] = datas["name"];
                datas["name"] = "vector";
            }
            break;
        case "GROUP":
            if (datas["name"] === "sticky" || datas["name"] === "parallax") {
                datas["tag"] = "div";
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
            datas["fontWeight"] = node.fontName.style === 'Regular' ? 'normal' : node.fontName.style;
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
                if (datas["name"] === "jpg" || datas["name"] === "png") {
                    datas["tag"] = "img";                    
                    datas["bytes"] = await node.exportAsync({ format: datas["name"].toUpperCase(), constraint: { type: "SCALE", value: 3.4 } });
                    datas["format"] = datas["name"];
                    datas["name"] = "image";
                }
            }
            break;
    }
    // console.log(node)
    return datas;
}

async function executeExport() {
    const datas = await getContent(figma.currentPage);
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