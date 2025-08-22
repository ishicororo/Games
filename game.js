const { Select }=require("enquirer");
const { Input }=require("enquirer");
const { Confirm }=require("enquirer");
const fs=require("fs");
const { exit } = require("process");
const { start } = require("repl");
let user;
let progress;
let data=JSON.parse(fs.readFileSync('data.json','utf8'));
let playingGame;
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
                if(item==="ユーザー名の変更"){
                    const prompt=new Input({
                        name:"name",
                        message:"変更したい名前を入力してください"
                    });
                    runCommand(prompt);
                    prompt.run().then(name=>{
                        data.users[name]=data.users[user];
                        delete data.users[user];
                        user=name;
                        console.log(`名前を${name}に変更しました`);
                        save();
                        chooseGame();
                    }).catch(err=>{});
                }
                else if(item==="ユーザー情報のリセット（ゲームの記録など）"){
                    data.users[user]={
                        jankenn:{
                            first:true,
                            hand:{
                                total:3,
                                g:[0.333333,{}],
                                c:[0.333333,{}],
                                p:[0.333333,{}]
                            }
                        },
                        othello:{},
                        gomoku:{},
                    };
                    save();
                    console.log("リセットしました");
                    chooseGame();
                }
                else if(item==="ユーザーの削除"){
                    delete data.users[user];
                    save();
                    askName();
                }
            }).catch(err=>{});
        }
        else if(key.ctrl&&key.name==="b"){
            await currentPrompt.cancel();
            console.clear();
            back();
        }
        else if(key.ctrl&&key.name==="e"){
            await currentPrompt.cancel();
            console.clear();
            console.log("終了します");
            process.exit();
        }
        else if(key.ctrl&&key.name==="u"){
            await currentPrompt.cancel();
            console.clear();
            askName();
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
                    chooseGame();
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
                    console.log("リセットを取りやめました");
                    setTimeout(() => {
                        chooseGame();
                    }, 1000);
                }
            });
        }
        else if(key.ctrl&&key.name==="p"){
            await currentPrompt.cancel();
            console.clear();
            const prompt=new Input({
                name:"code",
                message:"コードを入力してください"
            });
            runCommand(prompt);
            prompt.run().then(code=>{
                let func=new Function(code);
                func();
                setTimeout(() => {
                    back();
                }, 1000);
            }).catch(err=>{});
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
    back=display;
    console.log("このゲームの使い方を説明します");
    console.log("ゲームはじゃんけん、オセロ、五目並べの三種類です");
    console.log("「ctrl + k」でこの案内が出ます");
    console.log("「ctrl + s」で設定を表示します");
    console.log("「ctrl + b」で一つ戻ります")
    console.log("「ctrl + e」でゲームを終了します");
    console.log("「ctrl + u」でユーザーを変更します");
    console.log("「ctrl + d」でユーザーを削除します");
    console.log("「ctrl + r」で全ての設定（ユーザー削除含む）をリセットします");
    console.log("「ctrl + p」でプロフェッショナル設定を開きます（ユーザーは触らないでください）");
    const prompt=new Confirm({
            name:'answer',
            message:'次からもこの案内を表示しますか',
        });
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
                back();
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
    back=display;
    progress="askingName";
    console.clear();
    const prompt=new Input({
        name:'name',
        message:"ユーザー名を入力してください",
    });
runCommand(prompt);
prompt.run().then(name=>{
    name=name.trim();
    if(!(name in data.users)){
    console.log(`はじめまして、${name}さん`);
    data.users[name]={
        jankenn:{
            first:true,
            hand:{
                total:3,
                g:[0.333333,{}],
                c:[0.333333,{}],
                p:[0.333333,{}]
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
    back=askName;
    progress="choosingGame";
    const prompt=new Select({
        name: "game",
        message:"ゲームを選択してください",
        choices:["じゃんけん","オセロ","五目並べ"],
        });
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
    back=chooseGame;
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
    back=chooseGame;
    progress="gameOption";
    console.clear();
    const prompt=new Select({
        name: "choice",
        message: "どれかを選択してください",
        choices: ["AIと対戦ーコマの数","AIと対戦ー勝","2人で対戦"]
    });
    runCommand(prompt);
    prompt.run().then(answer=>{
        if(answer==="AIと対戦ーコマの数"){
            othello.startWithAi.NumberOfPieces();
        }
        else if(answer==="AIと対戦ー勝"){
            othello.startWithAi.WinRate();
        }
        else if(answer==="2人で対戦"){
            othello.askAnotherName();
        }
    })
    .catch(err=>{});
}
function gomokuOption(){
    back=chooseGame;
    progress="gameOption";
    console.clear();
    const prompt=new Select({
        name: "choice",
        message: "どちらかを選択してください",
        choices: ["AIと対戦","2人で対戦"]
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
    jankennHistory:[],
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
        back=jankennoOption;
        console.clear();
        let prompt=new Select({
            name:'hand',
            message:jankenn.shout(),
            choices:["グー","チョキ","パー"]
        });
        runCommand(prompt);
        prompt.run().then(hand=>{
            let total=data.users[user].jankenn.hand.total;
            const g=total*data.users[user].jankenn.hand.g[0];
            const c=total*data.users[user].jankenn.hand.c[0];
            const p=total*data.users[user].jankenn.hand.p[0];
            data.users[user].jankenn.hand.total+=1;
            total=data.users[user].jankenn.hand.total;
            if(hand==="グー"){
                data.users[user].jankenn.hand.g[0]=(g+1)/total;
                data.users[user].jankenn.hand.c[0]=c/total;
                data.users[user].jankenn.hand.p[0]=p/total;
                save();
            }
            else if(hand==="チョキ"){
                data.users[user].jankenn.hand.g[0]=g/total;
                data.users[user].jankenn.hand.c[0]=(c+1)/total;
                data.users[user].jankenn.hand.p[0]=p/total;
                save();
            }
            else if(hand==="パー"){
                data.users[user].jankenn.hand.g[0]=g/total;
                data.users[user].jankenn.hand.c[0]=c/total;
                data.users[user].jankenn.hand.p[0]=(p+1)/total;
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
        back=jankennoOption;
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
                jankenn.startRandom();
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
        back=jankennoOption;
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
    boad:[[],
    [".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".","."],
    [".",".",".","○","●",".",".","."],
    [".",".",".","●","○",".",".","."],
    [".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".","."]],
    startWithAi:{
        NumberOfPieces:()=>{},
        WinRate:()=>{},
    },
    askAnotherName:()=>{
        back=othelloOption;
        const prompt=new Input({
            name:"name",
            message:"対戦する相手の名前を教えてください"
        });
        runCommand(prompt);
        prompt.run().then(name=>{
            othello.anotherName=name;
            console.log("縦の番号,横の番号のように入力してください");
            setTimeout(() => {
                othello.startWithOther(1);
            }, 2000);
        }).catch(err=>{});
    },
    anotherName:"",
    userHands:{
        user:[],
        user2:[]
    },
    startWithOther:(number)=>{
        back=othelloOption;
        console.clear();
        console.log(`${(number===1)?othello.anotherName+"（白）":user+"（黒）"}:${(((number===1)?othello.userHands.user:othello.userHands.user2).length===0)?"まだターンがまわってきていません":(number===1)?othello.userHands.user2:othello.userHands.user}`);
        othello.outputBoad(othello.boad);
        const prompt=new Input({
            name:"hand",
            message:`${(number===1)?user+"（黒）":othello.anotherName+"（白）"}:`
        });
        runCommand(prompt);
        prompt.run().then(hand=>{
            hand=hand.split(",").map(char=>Number(char));
            if(number===1){
                othello.userHands.user=hand;
            }
            else{
                othello.userHands.user2=hand;
            }
            othello.boad[hand[0]][hand[1]-1]=(number===1)?"○":"●";
            if(number===1){
                othello.startWithOther(2);
            }
            else{
                othello.startWithOther(1);
            }
        }).catch(err=>{});
    },
    outputBoad:(boad)=>{
        console.log(" 1 2 3 4 5 6 7 8");
        for(let i=1;i<=8;i++){
            console.log(i+" "+boad[i].join(" "));
        }
    }
}
const gomoku={
    boad:[[],
    [".",".",".",".","."],
    [".",".",".",".","."],
    [".",".",".",".","."],
    [".",".",".",".","."],
    [".",".",".",".","."]],
    start:()=>{},
    outputBoad:(boad)=>{
        console.log(" 1 2 3 4 5");
        for(let i=1;i<=5;i++){
            console.log(i+" "+boad[i].join(" "));
        }
    }
}