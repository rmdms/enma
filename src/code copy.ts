import Blob from 'node-blob';

executeExport()



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
        // Opacity
        (node.opacity !== undefined) && (datas["opacity"] = node.opacity);
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
        // Tag
        switch(node.type) {
            case "FRAME":
                if (datas["name"] === "story") {
                    datas["tag"] = "main";
                } else if (datas["name"] === "chapter") {
                    datas["tag"] = "section";
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
                break;
            case "VECTOR":
                if (datas["name"] === "svg") {
                    datas["tag"] = "svg";
                    datas["content"] = String.fromCharCode.apply(null, await node.exportAsync({ format: 'SVG' }));
                }
                break;
            case "RECTANGLE":
                if (node.fills[0].type === "IMAGE") {
                    if (datas["name"] === "jpg" || datas["name"] === "png") {
                        datas["tag"] = "img";                    
                        datas["blob"] = new Blob([await node.exportAsync({ format: datas["name"].toUpperCase() }).buffer], { type: 'image/png' });
                    }
                    console.log(datas["blob"])
                }
                break;
        }


        // if (node.name === "sad 1") {
        //     // node.exportAsync({format: 'SVG'}).then(res => console.log(String.fromCharCode.apply(null, res))).catch(err => console.error(err));
        // }

        // if (node.name === "background 1") {
        //     node.exportAsync({format: 'JPG'}).then(res => console.log("ok", res)).catch(err => console.error(err));
        // }

        // switch(node.type) {
        //     case "PAGE":
        //         datas["type"] = "page"
        //         break
        //     case "FRAME":
        //         datas["type"] = "frame"
        //         break
        //     case "GROUP":
        //         datas["type"] = "group"
        //         break
        //     case "TEXT":
        //         datas["type"] = "text"
        //         datas["characters"] = node.characters
        //         datas["fontSize"] = node.fontSize
        //         datas["fontFamily"] = node.fontName.family
        //         datas["fontWeight"] = node.fontName.style === 'Regular' ? 'normal' : node.fontName.style;
        //         datas["color"] = {
        //             r: map_range(node.fills[0].color.r, 0, 1, 0, 255),
        //             g: map_range(node.fills[0].color.g, 0, 1, 0, 255),
        //             b: map_range(node.fills[0].color.b, 0, 1, 0, 255)
        //         }
        //         let unit = null;
        //         switch(node.letterSpacing.unit) {
        //             case 'PIXELS':
        //                 unit = 'px'
        //                 break;
        //             case 'PERCENT':
        //                 unit = '%'
        //                 break;
        //             case 'AUTO':
        //                 unit = 'auto'
        //                 break;
        //         }
        //         if (unit) {
        //             if (node.letterSpacing.value === undefined) {
        //                 datas["letterSpacing"] = unit
        //             } else {
        //                 datas["letterSpacing"] = node.letterSpacing.value + unit
        //             }
        //         }
        //         unit = null;
        //         switch(node.lineHeight.unit) {
        //             case 'PIXELS':
        //                 unit = 'px'
        //                 break;
        //             case 'PERCENT':
        //                 unit = '%'
        //                 break;
        //             case 'AUTO':
        //                 unit = 'auto'
        //                 break;
        //         }
        //         if (unit) {
        //             if (node.lineHeight.value === undefined) {
        //                 datas["lineHeight"] = unit
        //             } else {
        //                 datas["lineHeight"] = node.lineHeight.value + unit
        //             }
        //         }
        //         datas["textAlign"] = node.textAlignHorizontal
        //         break
        //     case "RECTANGLE":
        //         for (const paint of node.fills) {
        //             if (paint.type === "IMAGE") {
        //                 datas["type"] = "image"
        //                 const image = figma.getImageByHash(paint.imageHash)
        //                 const bytes = await image.getBytesAsync()
        //                 datas["bytes"] = bytes
        //             }
        //         }
        //         break
        //     case "VECTOR":
        //         break
        // }
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