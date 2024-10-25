import serv from './src/http_server/index'

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
serv.listen(HTTP_PORT);
