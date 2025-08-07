const { Select }=require("enquirer");
const { Input }=require("enquirer");
const { Confirm }=require("enquirer");
const fs=require("fs");
const { exit } = require("process");
let user;
let progress;
let data=JSON.parse(fs.readFileSync('data.json','utf8'));
let nowDisplay=data.display;
let back;
let isFirstDiplay=true;
console.clear();
function runCommand(currentPrompt){
    if(currentPrompt.handler){
    currentPrompt.off('keypress',currentPrompt.handler);
    }
    async function handler(char,key){
        if(key.ctrl&&key.name==="k"){
            await currentPrompt.cancel();
                console.clear();
                display();
        }
        else if(key.ctrl&&key.name==="s"){
            await currentPrompt.cancel();
            console.clear();
            let prompt=new Select({
                name:"item",
                message:"設定する項目を選択してください",
                choices:["ユーザー名の変更","ユーザー情報のリセット（ゲームの記録など）","ユーザーの削除"]
            });
            runCommand(prompt);
            prompt.run().then(item=>{
                if(item==="ユーザー名の変更"){}
                else if(item==="ユーザー情報のリセット（ゲームの記録など）"){}
                else if(item==="ユーザーの削除"){}
            })
        }
        else if(key.ctrl&&key.name==="b"){
            await currentPrompt.cancel();
             if(back==="display"){
                    console.clear();
                    display();
            }
            else if(back==="askName"){
                    console.clear();
                    askName();
            }
            else if(back==="chooseGame"){
                    console.clear();
                    chooseGame();
            }
        }
        else if(key.ctrl&&key.name==="e"){
            await currentPrompt.cancel();
            console.clear();
            console.log("終了します");
            process.exit();
        }
        else if(key.ctrl&&key.name==="d"){
            await currentPrompt.cancel();
            console.clear();
            const prompt=new Confirm({
                 name:'answer',
                message:'本当に削除しますか',
            });
            prompt.run().then(answers=>{
                console.clear();
                if(answers){
                    delete data.users[user];
                    console.log("現在のユーザーを削除しました");
                    save();
                    askName();
                }
                else{
                    console.clear();
                    console.log("削除を取りやめました");
                }
            })
        }
        else if(key.ctrl&&key.name==="r"){
            await currentPrompt.cancel();
            console.clear();
            const prompt=new Confirm({
                name:'answer',
                message:"本当にリセットしますか"
            });
            prompt.run().then(answers=>{
                console.clear();
                if(answers){
                    data={
                      "display": true,
                      "users": {}
                    };
                    save();
                    askName();
                }
                else{
                    console.log("削除を取りやめました");
                }
            });
        }
    }
    currentPrompt.on('keypress', handler);
}
function save(){
    try{
    fs.writeFileSync('data.json',JSON.stringify(data,null,2));
    }
    catch(err){
        console.log(err);
    }
}
if(data.display===true){
    display();
}
else{askName();}
function display(){
    console.log("このゲームの使い方を説明します");
    console.log("ゲームはじゃんけん、オセロ、五目並べの三種類です");
    console.log("「ctrl + k」でこの案内が出ます");
    console.log("「ctrl + s」で設定を表示します");
    console.log("「ctrl + b」で一つ戻ります")
    console.log("「ctrl + e」でゲームを終了します");
    console.log("「ctrl + d」でユーザーを削除します");
    console.log("「ctrl + r」で全ての設定（ユーザー削除含む）をリセットします");
    const prompt=new Confirm({
            name:'answer',
            message:'次からもこの案内を表示しますか',
        })
    runCommand(prompt);
    prompt.run().then(answers => {
        if(answers===true){
            console.log("了解しました");
            data.display=true;
            save();
            if(isFirstDiplay){
                    askName();
            }
            else{
                if(back==="display"){
                        askName();
                }
                else if(back==="askName"){
                        chooseGame();
                }
                else if(back==="chooseGame"){
                    if(progress==="jankennOption"){}
                    else if(progress==="othelloOption"){}
                    else if(progress==="gomokuOption"){}
                }
                }
        }
        else{
            console.log("了解しました、次からは案内を表示しません");
            data.display=false;
            save();
            if(isFirstDiplay){
                    askName();
            }
            else{
                if(back==="display"){
                        askName();
                }
                else if(back==="askName"){
                        chooseGame();
                }
                else if(back==="chooseGame"){
                    if(progress==="jankennOption"){}
                    else if(progress==="othelloOption"){}
                    else if(progress==="gomokuOption"){}
                }
            }}
    })
    .catch(err=>{});
}
function askName(){
    back="display";
    progress="askingName";
    console.clear();
    const prompt=new Input({
        name:'name',
        message:"ユーザー名を入力してください",
    })
runCommand(prompt);
prompt.run().then(name=>{
    name=name.trim();
    if(!(name in data.users)){
    console.log(`はじめまして、${name}さん`);
    data.users[name]={
        jankenn:{
            first:true,
            hand:{
                g:[0,{}],
                c:[0,{}],
                p:[0,{}]
            }
        },
        othello:{},
        gomoku:{},
    }
    user=name;
    save();
        chooseGame();
}
    else{
        console.log(`こんにちは、${name}さん`);
        user=name;
            chooseGame();
    }
})
.catch(err=>{});
}
function chooseGame(){
    back="askName";
    progress="choosingGame";
    const prompt=new Select({
        name: "game",
        message:"ゲームを選択してください",
        choices:["じゃんけん","オセロ","五目並べ"],
        })
    runCommand(prompt);
    prompt.run().then(game=>{
        if(game==="じゃんけん"){
            console.log("じゃんけんを選択しました");
                jankennoOption();
        }
        else if(game==="オセロ"){
                othelloOption();
        }
        else if(game==="五目並べ"){
                gomokuOption();
        }
    })
    .catch(err=>{});
}
function jankennoOption(){
    back="chooseGame";
    progress="gameOption";
    console.clear();
    console.log("じゃんけん");
    const prompt=new Select({
        name: "choice",
        message: "選択してください",
        choices: ["AIと対戦する","ランダム"],
    });
    runCommand(prompt);
    prompt.run().then(answer=>{
        if(answer==="AIと対戦する"){
            console.log("このAIは学習します")
            console.log("じゃんけんを始めます");
            setTimeout(() => {
                jankenn.startWithAi();
            }, 1000);
        }
        else if(answer==="ランダム"){
            console.log("じゃんけんを始めます");
            setTimeout(() => {
                jankenn.startRandom();
            }, 1000);
        }
    })
    .catch(err=>{});
}
function othelloOption(){
    back="chooseGame";
    progress="gameOption";
    console.clear();
    const prompt=new Select({
        name: "choice",
        message: "どれかを選択してください",
        choices: ["AIと対戦ーコマの数","AIと対戦ー勝","2人で対戦"]
    });
    runCommand(prompt);
    prompt.run().then(answer=>{
        if(answer==="AIと対戦ーコマの数"){}
        else if(answer==="AIと対戦ー勝"){}
        else if(answer==="2人で対戦"){}
    })
    .catch(err=>{});
}
function gomokuOption(){
    back="chooseGame";
    progress="gameOption";
    console.clear();
    const prompt=new Select({
        name: "choice",
        message: "どちらかを選択してください",
        choices: ["AIと対戦ーコマの数","AIと対戦ー勝","2人で対戦"]
    });
    runCommand(prompt);
    prompt.run().then(answer=>{
        if(answer==="AIと対戦"){}
        else if(answer==="2人で対戦"){}
    })
    .catch(err=>{})
}
const jankenn={
    firstShout:true,
    shout:()=>{
        if(jankenn.firstShout){
            return "さいしょはグー、じゃんけん..."
        }
        else{
            return "あいこで..."
        }
    },
    randomSelect:()=>{
        let number=Math.random();
        if(number<=1/3){
            return "グー"
        }
        else if(number<=2/3){
            return "パー"
        }
        else{
            return "チョキ"
        }
    },
    select:(who)=>{
        if(who==="AI"){
        if(data.users[user].jankenn.first){
            return jankenn.randomSelect();
        }
        else{
            const array=[];
            array.push(data.users[user].jankenn.hand.g[0]);
            array.push(data.users[user].jankenn.hand.c[0]);
            array.push(data.users[user].jankenn.hand.p[0]);
            const max=Math.max(...array);
            if(array[0]===max){
                return "パー";
            }
            else if(array[1]===max){
                return "グー";
            }
            else if(array[2]===max){
                return "チョキ";
            }
        }
    }
    },
    whoWinner:(hand,AIhand)=>{
        if(hand===AIhand)return 1
        else if((hand==="グー"&&AIhand==="チョキ")||(hand==="チョキ"&&AIhand==="パー")||(hand==="パー"&&AIhand==="グー"))return 2
        else if((hand==="グー"&&AIhand==="パー")||(hand==="チョキ"&&AIhand==="グー")||(hand==="パー"&&AIhand==="チョキ"))return 3
    },
    startWithAi:()=>{
        console.clear();
        let prompt=new Select({
            name:'hand',
            message:jankenn.shout(),
            choices:["グー","チョキ","パー"]
        });
        runCommand(prompt);
        prompt.run().then(hand=>{
            if(hand==="グー"){
                data.users[user].jankenn.hand.g[0]+=1;
                save();
            }
            else if(hand==="チョキ"){
                data.users[user].jankenn.hand.c[0]+=1;
                save();
            }
            else if(hand==="パー"){
                data.users[user].jankenn.hand.p[0]+=1;
                save();
            }
            let AIhand=jankenn.select("AI");
            console.clear();
            console.log(`あなた：${hand} AI：${AIhand}`);
            if(jankenn.whoWinner(hand,AIhand)===1){
                jankenn.firstShout=false;
                jankenn.startWithAi();
            }
            else if(jankenn.whoWinner(hand,AIhand)===2){
                console.log("あなたの勝ちです");
                jankenn.exitOption(1);
            }
            else if(jankenn.whoWinner(hand,AIhand)===3){
                console.log("あなたの負けです");
                jankenn.exitOption(1);
            }
            data.users[user].jankenn.first=false;
            save();
        }).catch(err=>{})
    },
    startRandom:()=>{
        console.clear();
        let prompt=new Select({
            name:'hand',
            message:jankenn.shout(),
            choices:["グー","チョキ","パー"]
        });
        runCommand(prompt);
        prompt.run().then(hand=>{
            let AIhand=jankenn.randomSelect();
            console.clear();
            console.log(`あなた：${hand} AI：${AIhand}`);
            if(jankenn.whoWinner(hand,AIhand)===1){
                jankenn.firstShout=false;
                jankenn.startWithAi();
            }
            else if(jankenn.whoWinner(hand,AIhand)===2){
                console.log("あなたの勝ちです");
                jankenn.exitOption(2);
            }
            else if(jankenn.whoWinner(hand,AIhand)===3){
                console.log("あなたの負けです");
                jankenn.exitOption(2);
            }
        }).catch(err=>{})
    },
    exitOption:(type)=>{
        jankenn.firstShout=true;
        let prompt=new Select({
            name:'option',
            message:'選択してください',
            choices:['もう一度する','他のゲームをする','終了する']
        });
        runCommand(prompt);
        prompt.run().then(option=>{
            if(option==='もう一度する'){
                if(type===1){
                    jankenn.startWithAi();
                }
                if(type===2){
                    jankenn.startRandom();
                }
            }
            else if(option==='他のゲームをする'){
                chooseGame();
            }
            else if(option==='終了する'){
                process.exit();
            }
        }).catch(err=>{})
    }
}
const othello={
    boad:[[".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".","."],
    [".",".",".","○","●",".",".","."],
    [".",".",".","●","○",".",".","."],
    [".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".","."]],
    start:()=>{},
    outputBoad:(boad)=>{
        console.log(" 1 2 3 4 5 6 7 8");
        for(let i=0;i<=7;i++){
            console.log(i+" "+boad[i].join(" "));
        }
    }
}
const gomoku={
    boad:[[".",".",".",".","."],
    [".",".",".",".","."],
    [".",".",".",".","."],
    [".",".",".",".","."],
    [".",".",".",".","."]],
    start:()=>{},
    outputBoad:(boad)=>{
        console.log(" 1 2 3 4 5");
        for(let i=0;i<=4;i++){
            console.log(i+" "+boad[i].join(" "));
        }
    }
}