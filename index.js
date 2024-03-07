const steamworks = require('steamworks.js');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function isSteamRunning() {
    try {
        // Run platform-specific command to check if Steam process is running
        const output = process.platform === 'win32' ?
            execSync('tasklist /FI "IMAGENAME eq steam.exe"').toString() :
            execSync('pgrep steam').toString();
        return output.includes('steam');
    } catch (error) {
        console.error('Error occurred while checking if Steam is running:', error);
        return false;
    }
}

async function initializeSteamworks(appId) {
    return new Promise((resolve, reject) => {
        const client = steamworks.init(appId);
        if (client) {
            console.log('Steamworks initialized successfully!');
            resolve(client);
        } else {
            reject(new Error('Failed to initialize Steamworks.'));
        }
    });
}

// Check if Steam is running before proceeding
if (!isSteamRunning()) {
    console.log('Steam is not running. Please start Steam and try again.');
    rl.close();
} else {
    rl.question("Enter the App ID: ", async (appIdInput) => {
        const appId = parseInt(appIdInput);

        try {
            await initializeSteamworks(appId);
        } catch (error) {
            console.error(error.message);
        }

        rl.close();
    });
}
