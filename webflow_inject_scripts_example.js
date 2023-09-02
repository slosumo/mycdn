function injectInjectionScript() {
    const webflowURLs = {
        production: 'https://www.littlebigthings.dev/', // production URL for your Webflow site
        staging: 'https://lil-big-things.webflow.io/' // staging URL for your Webflow site
    };
    const CDNURLs = {
        production: 'https://custom-code-for-webflow.pages.dev/', // production URL for your custom code on CloudFlare CDN
        staging: 'https://staging.custom-code-for-webflow.pages.dev/' // staging URL for your custom code on CloudFlare CDN
    };


    let globalAssetVersion = '1'; // TODO change this to ensure that all scripts' cache is properly overridden
    // optionally -> if you want to ensure just a specific script's cache is 100% cleared, you can just modify/increment the v=X in scriptPaths
    // i.e. this might be useful if you have massive scripts, that you wouldn't to always clear all, if just a few were changed

    let scriptsPaths = {
        // add the scripts that you want to inject to production site and this would inject the scripts in the master branch
        production: [
            'scripts/script1.js?v=1',
            'scripts/script2.js?v=1',
        ],
        // add the scripts that you want to inject to the staging site and this would inject the scripts in the staging branch
        staging: [
            'scripts/script1.js?v=1',
            'scripts/script2.js?v=1',
            'scripts/script3.js?v=1', // some extra script that's not laoded on production
        ]
    };

    // append globalAssetVersion to all scripts
    for (let [envType, scripts] of Object.entries(scriptsPaths)) {
        for (let i=0; i < scripts.length; i++) {
            scriptsPaths[envType][i] += '_' + globalAssetVersion;
        }
    }

    const productionHost = new URL(webflowURLs.production).hostname;
    const stagingHost = new URL(webflowURLs.staging).hostname;
    const url = window.location.hostname;
    if (url === productionHost) {
        const scriptURLs = scriptsPaths.production.map(script => `${CDNURLs.production}${script}`);
        Promise.all(scriptURLs.map(injectScript)).then(() => console.log('All production scripts loaded successfully'));
    } else if (url === stagingHost) {
        const scriptURLs = scriptsPaths.staging.map(script => `${CDNURLs.staging}${script}`);
        Promise.all(scriptURLs.map(injectScript)).then(() => console.log('All staging scripts loaded successfully'));
    }
}

function injectScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = src;
        script.addEventListener('load', evt => resolve(evt.target));
        script.addEventListener('error', e => reject(e.error));
        document.body.appendChild(script);
    });
}

injectInjectionScript();