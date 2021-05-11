import './ui.css';
import axios from 'axios';

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

window.onmessage = async (event) => {
    // DATAS
    const datas = event.data.pluginMessage;
    // JSON
    const jsonStr = JSON.stringify(datas);
    const jsonB64 = Buffer.from(jsonStr).toString("base64");
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
        return await getSha(token, commits.data[0].commit.tree, path);
    }).then(async (sha) => {
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
