const fs=require("fs");
let data=JSON.parse(fs.readFileSync('data.json','utf8'));
process.stdin.setEncoding("utf8");
console.log("こんにちは、ユーザー名を入力してください");
process.stdin.on('data',(chunk)=>{
    console.clear();
    chunk=chunk.trim();
    if(!(chunk in data.users)){
        data.users[chunk]={
            info:true,
        };
        console.log("初めまして、"+chunk+"さん");
        process.stdout.write("少々お待ちください...");
        fs.writeFileSync('data.json',JSON.stringify(data,null,2));
        process.stdin.pause();
        start(chunk);
    }
    else{
        console.log("こんにちは、"+chunk+"さん");
        process.stdin.pause();
        start();

    }
})
function start(name){
    console.log("ゲームを選択してください。");
    console.log("1:じゃんけん");
    console.log("2:オセロ");
    console.log("3:五目並べ");
    process.stdin.on('data',(gameNumber)=>{
        console.clear();
        if(gameNumber==="1"){
            console.log("どちらかを選択してください");
            console.log("1:AIと対戦する");
            console.log("AIとともに相手と対戦する");
        }
    })
}