const express = require('express')
const {json} = require("express");
const app = express()
const WSServer = require('express-ws')(app)
const aWss = WSServer.getWss()
const PORT = process.env.PORT || 5000
const cors = require('cors')
const fs = require('fs')
const path = require('path')

app.use(cors())
app.use(express.json())

app.ws('/chat',(ws,req)=>{
    ws.on('message',(msg)=>{
        console.log(msg)
        msg = JSON.parse(msg)
        switch (msg.method){
            case "connectionChat":
                connectionHandler(ws, msg)
                break
            case "messageChat":
                broadcastConnection(ws, msg)
                break
        }
    })
})

app.ws('/',(ws,req)=>{
    ws.on('message',(msg)=>{
        msg = JSON.parse(msg)
        switch (msg.method){
            case "connection":
                connectionHandler(ws, msg)
                break
            case "draw":
                broadcastConnection(ws, msg)
                break
            case "get":
                broadcastConnection(ws,msg)
                break
        }
    })
})

app.post('/image',(req,res)=>{
    try{
        const data = req.body.img.replace(`data:image/png;base64,`, '')
        fs.writeFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`), data, 'base64')
        return res.status(200).json()
    }catch (e){
        console.log(e)
        return res.status(500).json('error')
    }
})
app.get('/image',(req,res)=>{
    try{
        const file = fs.readFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`))
        const data = `data:image/png;base64,` + file.toString('base64')
        res.json(data)
    }catch (e){
        console.log(e)
        return res.status(500).json('error')
    }
})

app.listen(PORT,()=> console.log(`server started on PORT ${PORT}`))

const connectionHandler = (ws, msg) => {
    ws.id = msg.id
    broadcastConnection(ws, msg)
}

const broadcastConnection = (ws, msg) => {
    //console.log(aWss.clients)
    aWss.clients.forEach(client => {
        if (client.id === msg.id){
            client.send(JSON.stringify(msg))
            console.log("1")
        }
    })
}


