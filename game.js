const fs=require("fs");
let data=JSON.parse(fs.readFileSync('data.json','utf8'));
let progress=1;
let name;
process.stdin.setEncoding("utf8");
console.clear();
console.log("こんにちは、ユーザー名を入力してください");
process.stdin.on('data',(input)=>{
    input=input.trim();
    console.clear();
    if(input===".exit"){
        console.log("ゲームを終了します。");
        process.exit();
    }
    else if(input===".back"){
        if(progress===1){
            console.clear();
            console.log("こんにちは、ユーザー名を入力してください");
        }
        else if(progress===2){
            progress=1;
            console.clear();
            console.log("こんにちは、ユーザー名を入力してください")
        }
        else if(progress===3||progress===4||progress===5){
            progress=2;
            console.log("こんにちは、"+name+"さん");
            console.log("ゲームを選択してください");
            console.log("ゲームを選択してください。");
            console.log("1:じゃんけん");
            console.log("2:オセロ");
            console.log("3:五目並べ");
        }
    }
    else{
    if(progress===1){
    if(!(input in data.users)){
        name=input;
        data.users[input]={
            info:true,
            playingGame:{
                jankenn:false,
                othello:false,
                gomoku:false,
            }
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
        name=input;
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
        data.users[name].playingGame.jankenn=true;
        fs.writeFileSync('data.json',JSON.stringify(data,null,2));
        console.log("どちらかを選択してください");
        console.log("1:AIと対戦する");
        console.log("2:AIとともに相手と対戦する");
        progress=3;
    }
    else if(input==="2"){
        data.users[name].playingGame.othello=true;
        fs.writeFileSync('data.json',JSON.stringify(data,null,2));
        console.log("選択してください");
        console.log("1：AIと対戦ーコマの数");
        console.log("2：AIと対戦ー勝率");
        console.log("3：2人で対戦");
        progress=4;
    }
    else if(input==="3"){
        data.users[name].playingGame.gomoku=true;
        fs.writeFileSync('data.json',JSON.stringify(data,null,2));
        console.log("1：AIと対戦");
        console.log("2：2人で対戦");
        progress=5;
    }
    else{
        console.log("有効な数字を入力してください");
        console.log("1:じゃんけん");
        console.log("2:オセロ");
        console.log("3:五目並べ");
    }
    }
    else if(progress===3){
        console.clear();
        if(input==="1"){
            console.log("AIはプレイするごとに学習して強くなります")
            console.log("じゃんけんを始めます、カタカナで入力してください");
            console.log("最初はグー、じゃんけん...");
            progress=6;
        }
        else if(input==="2"){
            console.log("AIはプレイするほど強くなります");
            console.log("プレイする相手の名前を入力してください")
            progress=7;
        }
        else{
            console.log("有効な数字を入力してください");
            console.log("1:AIと対戦する");
            console.log("2:AIとともに相手と対戦する");
        }
    }
    else if(progress===4){
        console.clear();
        if(input==="1"){
            console.log("AIは常にAIのコマが最も大きくなる答えを出します");
            console.log("これは初級者向けです");
            progress=8;
        }
        else if(input==="2"){
            console.log("AIは勝率が最も高くなる手を選びます")
            console.log("これは上級者向けです");
            progress=9;
        }
        else if(input==="3"){
            console.log("他の人と対戦します");
            progress=10;
        }
        else{
            console.log("有効な数字を入力してください");
            console.log("1：AIと対戦ーコマの数");
            console.log("2：AIと対戦ー勝率");
            console.log("3：2人で対戦");

        }
    }
    else if(progress==="1"){
        console.clear();
        if(input==="1"){
            console.log("AIと対戦します");
            progress=11;
        }
        else if(input==="2"){
            console.log("他の人と対戦します");
            progress=12;
        }
        else{
            console.log("有効な数字を入力してください");
            console.log("1：AIと対戦");
            console.log("2：2人で対戦");
        }
    }
}
})
function playJankennVsAI(data){};
function playJankennWithAI(data){};
function playOthelloVsAIwithPercent(data){};
function playOthelloVsAIwithNumber(data){};
function playOthelloVsOther(data){};
function playGmokuVsAI(data){};
function playGmokuVsOther(data){};