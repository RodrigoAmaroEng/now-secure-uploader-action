const core = require('@actions/core')
const github = require('@actions/github')
const fetch = require('node-fetch')
const fs = require('fs')

async function run() {
    try {
        const nowSecureToken = core.getInput('token');
        const filePath = core.getInput('artifact_path')
        const stats = fs.statSync(filePath);
        const fileSizeInBytes = stats.size;
        let readStream = fs.createReadStream(filePath);
        await fetch('https://lab-api.nowsecure.com/build/', {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + nowSecureToken,
                "Content-length": fileSizeInBytes
            },
            body: readStream
        }).then(data => data.json())
            .then(resp => {
                console.log(resp)
            })
            .catch(error => core.setFailed(error.message))

    } catch (error) {
        core.setFailed(error.message);
    }
}

run()