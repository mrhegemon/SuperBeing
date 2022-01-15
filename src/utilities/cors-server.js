import cors_proxy from 'cors-anywhere';

export class cors_server {
    static getInstance;

    constructor(port, host) {
        cors_server.getInstance = this

        cors_proxy.createServer({
            originWhitelist: [],
            requireHeader: ['origin', 'x-requested-with'],
            removeHeaders: [
              'cookie',
              'cookie2'
            ],
            redirectSameOrigin: true,
            httpProxyOptions: {
              // Do not add X-Forwarded-For, etc. headers, because Heroku already adds it.
              xfwd: false,
            }
        }).listen(port, host, function() {
            console.log('Running CORS Anywhere on: ' + host + ':' + port);
        });
    }
}
export default cors_server;