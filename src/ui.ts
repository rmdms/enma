import './ui.css';
import axios from 'axios';
import fs from 'fs';

let trees = [];

async function getSha(token, trees, path, i=0) {
    const levels = path.split('/');
    let url = null;
    let sha = null;
    let commit = null;
    if (Array.isArray(trees)) {
        trees.forEach(tree => {
            if (tree.path === levels[i]) {
                url = tree.url;
                sha = tree.sha;
            }
        });
        i++;
    } else {
        url = trees.url;
        sha = trees.sha;
    }
    if (url !== null) {
        // return Promise.reject(new Error());
        commit = await axios.get(url, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `Basic ${token}`
            },
        });
    }
    if (i === levels.length) {
        return sha;
    } else {
        if (commit === null) {
            return Promise.reject(new Error());
        } else {
            return await getSha(token, commit.data.tree, path, i);
        }
    }
}

function getRandomString(length) {
    let randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

async function recursive(datas, name = null) {
    if (datas.name === "image" || datas.name === "vector") {
        // NAME
        if (typeof datas.index !== 'undefined' && name !== null) {
            datas.fileName = `${name}-${datas.index}.${datas.format}`;
        } else {
            datas.fileName = `${getRandomString(10)}.${datas.format}`;
        }
        // GITHUB
        const username = 'rmdms';
        const password = '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';
        const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
        const url = 'https://api.github.com/repos/rmdms/relate/';
        const path = `assets/datas/images/${datas.fileName}`;

        await axios.get(`${url}commits`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `Basic ${token}`
            },
        }).then(async (commits) => {
            return await getSha(token, commits.data[0].commit.tree, path);
        }).then(async (sha) => {
            console.log('put')
            return await axios.put(`${url}contents/${path}`, {
                message: ':rocket: Update content via Figma',
                content: Buffer.from(datas.bytes).toString("base64"),
                sha: sha
            }, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': `Basic ${token}`
                },
            });
        })
        delete datas.bytes;
    }
    // Children
    if ("children" in datas) {
        if (datas.tag === "animation") {
            datas.fileName = getRandomString(10);
            for (const child of datas.children) {
                await recursive(child, datas.fileName);
            }
        } else {
            for (const child of datas.children) {
                await recursive(child);
            }
        }
    }
}

async function getTreeGithub(datas, name = null) {
    if (datas.name === "image" || datas.name === "vector") {
        // NAME
        if (typeof datas.index !== 'undefined' && name !== null) {
            datas.fileName = `${name}-${datas.index}.${datas.format}`;
        } else {
            datas.fileName = `${getRandomString(10)}.${datas.format}`;
        }

        trees.push({
            name: datas.fileName,
            jsonB64: Buffer.from(datas.bytes).toString("base64")
        })
        delete datas.bytes;
    }
    // Children
    if ("children" in datas) {
        if (datas.tag === "animation") {
            datas.fileName = getRandomString(10);
            for (const child of datas.children) {
                await getTreeGithub(child, datas.fileName);
            }
        } else {
            for (const child of datas.children) {
                await getTreeGithub(child);
            }
        }
    }
}

async function addTreeGithub() {
    // GITHUB
    const username = 'rmdms';
    const password = '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';
    const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
    const url = 'https://api.github.com/repos/rmdms/relate/';
    const path = 'assets/datas/images';

    let old_commit_sha = undefined;
    let new_tree_sha = undefined;
    let new_commit_sha = undefined;

    const refMaster = await axios.get(`${url}git/refs/heads/master`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Basic ${token}`
        },
    })
    old_commit_sha = refMaster.data.object.sha;
    const commits = await axios.get(`${url}commits`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Basic ${token}`
        },
    });
    const shaTrees = await getSha(token, commits.data[0].commit.tree, path);
    console.log(shaTrees)
    let toto = [];
    // trees.forEach(async tree => {
    for (let i = 0; i < trees.length; i++) {
        const tree = trees[i];
        tree.path = `${path}/${tree.name}`;
        tree.mode = "100644";
        tree.type = "blob";
        // tree.content = tree.jsonB64;
        // tree.encoding = "base64"
        const blob = await axios.post(`${url}git/blobs`,{
            content: tree.jsonB64,
            encoding: "base64"
        }, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `Basic ${token}`
            } 
        });
        tree.sha = blob.data.sha;
        delete tree.name;
        delete tree.jsonB64;
        toto.push(tree);
        console.log('blob')
    }
    // });
    const newTree = await axios.post(`${url}git/trees`, {
        tree: toto,
        base_tree: old_commit_sha
    }, {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Basic ${token}`
        },
    });
    new_tree_sha = newTree.data.sha;
    const newCommit = await axios.post(`${url}git/commits`, {
        message: ':rocket: Update content via Figma',
        tree: new_tree_sha,
        parents: [old_commit_sha]
    }, {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Basic ${token}`
        },
    });
    new_commit_sha = newCommit.data.sha;
    const newRefs = await axios.patch(`${url}git/refs/heads/master`, {
        sha: new_commit_sha
    }, {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Basic ${token}`
        },
    });
    console.log('okok')
}

async function cleanGithub() {
    // GITHUB
    const username = 'rmdms';
    const password = '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';
    const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
    const url = 'https://api.github.com/repos/rmdms/relate/';
    const path = 'assets/datas/images';

    let old_commit_sha = undefined;
    let new_tree_sha = undefined;
    let new_commit_sha = undefined;

    const refMaster = await axios.get(`${url}git/refs/heads/master`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Basic ${token}`
        },
    })
    old_commit_sha = refMaster.data.object.sha;
    const commits = await axios.get(`${url}commits`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Basic ${token}`
        },
    });
    const shaTrees = await getSha(token, commits.data[0].commit.tree, path);
    let t = await axios.get(`${url}git/trees/${shaTrees}`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Basic ${token}`
        },
    })
    let trees = t.data.tree;
    trees.forEach(tree => {
        if (tree.path !== "README.md") {
            tree.sha = null;
        }
        tree.path = `${path}/${tree.path}`;
        delete tree.size;
        delete tree.url;
    });
    const newTree = await axios.post(`${url}git/trees`, {
        tree: trees,
        base_tree: old_commit_sha
    }, {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Basic ${token}`
        },
    });
    new_tree_sha = newTree.data.sha;
    const newCommit = await axios.post(`${url}git/commits`, {
        message: `:fire: Delete contents via Figma` ,
        tree: new_tree_sha,
        parents: [old_commit_sha]
    }, {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Basic ${token}`
        },
    });
    new_commit_sha = newCommit.data.sha;
    const newRefs = await axios.patch(`${url}git/refs/heads/master`, {
        sha: new_commit_sha
    }, {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Basic ${token}`
        },
    });
}

window.onmessage = async (event) => {
    // DATAS
    const datas = event.data.pluginMessage;
    // ---
    console.log("clear");
    await cleanGithub();
    console.log("getTree");
    await getTreeGithub(datas);
    console.log("addTree");
    await addTreeGithub();
    // await recursive(datas);
    // JSON
    const jsonStr = JSON.stringify(datas);
    console.log('ui')    
    const jsonB64 = Buffer.from(jsonStr).toString("base64");
    console.log('buffer')
    // GITHUB
    const username = 'rmdms';
    const password = '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';
    // const username = 'melanieterzic';
    // const password = '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';
    const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
    const url = 'https://api.github.com/repos/rmdms/relate/';
    // const url = 'https://api.github.com/repos/melanieterzic/relate/';
    const path = 'assets/datas/content.json';

    await axios.get(`${url}commits`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Basic ${token}`
        },
    }).then(async (commits) => {
        console.log('getSha')
        return await getSha(token, commits.data[0].commit.tree, path);
    }).then(async (sha) => {
        console.log('put')
        return await axios.put(`${url}contents/${path}`, {
            message: ':rocket: Update content via Figma',
            content: jsonB64,
            sha: sha
        }, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `Basic ${token}`
            },
        });
    }).then(response => {
        window.parent.postMessage({ pluginMessage: response.data }, '*')
    }).catch(error => {
        console.log(error)
        window.parent.postMessage({ pluginMessage: error }, '*')
    })
}
