executeExport()

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

async function executeExport() {
    async function traverse(node) {
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
        // Children
        if ("children" in node) {
            let children = []
            for (const child of node.children) {
                const result = await traverse(child)
                if (Object.keys(result).length !== 0) {
                    children.push(result)
                }
            }
            if (children.length !== 0) {
                datas["children"] = children
            }
        }
        // Type
        switch(node.type) {
            case "PAGE":
                datas["type"] = "page"
                break
            case "FRAME":
                datas["type"] = "frame"
                break
            case "GROUP":
                datas["type"] = "group"
                break
            case "TEXT":
                datas["type"] = "text"
                datas["characters"] = node.characters
                datas["fontSize"] = node.fontSize
                datas["fontFamily"] = node.fontName.family
                datas["fontWeight"] = node.fontName.style === 'Regular' ? 'normal' : node.fontName.style;
                datas["color"] = {
                    r: map_range(node.fills[0].color.r, 0, 1, 0, 255),
                    g: map_range(node.fills[0].color.g, 0, 1, 0, 255),
                    b: map_range(node.fills[0].color.b, 0, 1, 0, 255)
                }
                console.log(node)
                break
            case "RECTANGLE":
                for (const paint of node.fills) {
                    if (paint.type === "IMAGE") {
                        datas["type"] = "image"
                        const image = figma.getImageByHash(paint.imageHash)
                        const bytes = await image.getBytesAsync()
                        datas["bytes"] = bytes
                    }
                }
                break
        }
        return datas
    }
    // Datas
    const datas = await traverse(figma.currentPage)
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