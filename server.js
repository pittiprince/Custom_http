// agenda : to Create a simple server without any framework , and serve a static file with cluster module immplementation

const http = require('http');
const fs = require('fs');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;   
const PORT =  3000;

if(cluster.isPrimary){
    console.log(`Master ${process.pid} is running`);
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
}else{
    const server = http.createServer((req,res)=>{
        const url = req.url;
        const method = req.method;

        res.setHeader('Content-Type', 'text/html');

        if(url === '/'){
            res.writeHead(200);
            res.end('<h1>Welcome to the home page</h1>');
        }else if(url === '/about'){
            res.writeHead(200);
            res.end('<h1>Welcome to the about page</h1>');
        }else if(url === '/contact'){
            res.writeHead(200);
            res.end('<h1>Welcome to the contact page</h1>');
        }else if(url === '/static'){
            const filePath = path.join(__dirname, 'index.html');
            fs.readFile(filePath , (err , data)=>{
                if(err){
                    res.writeHead(500);
                    res.end('<h1>Internal Server Error</h1>');
                }else{
                    res.writeHead(200);
                    res.end(data);
                }
            })
        }
    })

    server.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
      });
}