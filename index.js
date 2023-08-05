const express=require("express")
const app=express()

const path=require("path")
const http=require("http")
const {Server}=require("socket.io")


const server=http.createServer(app)

const io=new Server(server)
app.use(express.static(path.resolve("")))

let arr=[]
let playingArray=[]

io.on("connection",(socket)=>{

    socket.on("find",(e)=>{

        if(e.name!=null){

            arr.push(e.name)

            if(arr.length>=2){
                
                let p1obj={
                    p1name:arr[0],
                    p1value:"0",
                    p1move:"",
                    p1move2:"",
                    
                    
                }
                let p2obj={
                    p2name:arr[1],
                    p2value:"1",
                    p2move:"",
                    p2move2:"",
                    
                    
                }

                let obj={
                    p1:p1obj,
                    p2:p2obj,
                    sum:0,
                    
                }
                playingArray.push(obj)
               

                arr.splice(0,2)

                io.emit("find",{allPlayers:playingArray})

            }

        }

    })

    socket.on("playing",(e)=>{
        
        if(e.value=="0"){
            let objToChange=playingArray.find(obj=>obj.p1.p1name===e.name)
            
          
            
           if(objToChange.p1.p1move == ""){
        
            objToChange.p1.p1move=e.id
            objToChange.sum++;}
            else{
            objToChange.p1.p1move2=e.id
            objToChange.sum++;}

            
            
           
            
            console.log("p1id"+objToChange.p1.p1move);
            console.log("p1id2"+objToChange.p1.p1move2);
            if(objToChange.p1.p1move!="" && objToChange.p1.p1move2!="")
            {
                io.emit("playing",{allPlayers:playingArray})
                objToChange.p1.p1move="";
                objToChange.p1.p1move2="";
            }
            
        }
        else if(e.value=="1"){
            let objToChange=playingArray.find(obj=>obj.p2.p2name===e.name)
            

            if(objToChange.p2.p2move == ""){
            objToChange.p2.p2move=e.id;
            objToChange.sum++;}
            else{
            objToChange.p2.p2move2=e.id;
            objToChange.sum++;}
            if(objToChange.p2.p2move!="" && objToChange.p2.p2move2!="")
            
            {
                io.emit("playing",{allPlayers:playingArray})
                objToChange.p2.p2move="";
                objToChange.p2.p2move2="";
            }
          
            
            
        }
       

        

    })

    


})




app.get("/",(req,res)=>{
    return res.sendFile("index.html")
})

server.listen(3000,()=>{
    console.log("port connected to 3000")
})