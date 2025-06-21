const fs=require("fs");
let data=JSON.parse(fs.readFileSync('data.json','utf8'));
let progress=1;
process.stdin.setEncoding("utf8");
console.log("こんにちは、ユーザー名を入力してください");
process.stdin.on('data',(input)=>{
    input=input.trim();
    console.clear();
    if(input===".exit"){
        console.log("ゲームを終了します。");
        process.exit();
    }
    else{
    if(progress===1){
    if(!(input in data.users)){
        data.users[input]={
            info:true,
        };
        console.log("初めまして、"+input+"さん");
        process.stdout.write("少々お待ちください...");
        fs.writeFileSync('data.json',JSON.stringify(data,null,2));
        console.log("ゲームを選択してください。");
        console.log("1:じゃんけん");
        console.log("2:オセロ");
        console.log("3:五目並べ");
        progress=2;
    }
    else{
        console.log("こんにちは、"+input+"さん");
        console.log("ゲームを選択してください。");
        console.log("1:じゃんけん");
        console.log("2:オセロ");
        console.log("3:五目並べ");
        progress=2;

    }
}
    else if(progress===2){
        console.clear();
    if(input==="1"){
        console.log("どちらかを選択してください");
        console.log("1:AIと対戦する");
        console.log("2:AIとともに相手と対戦する");
        progress=3;
    }
    else if(input==="2"){
        console.log("選択してください");
        console.log("1：AIと対戦ー勝率");
        console.log("2：AIと対戦ーコマの数");
        console.log("3：2人で対戦");
        progress=4;
    }
    else if(input==="3"){
        console.log("1：AIと対戦");
        console.log("2：2人で対戦");
        progress=5;
    }
    }
}
})
