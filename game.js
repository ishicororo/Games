const fs=require("fs");
let data=JSON.parse(fs.readFileSync('data.json','utf8'));
let progress=1;
let name;
process.stdin.setEncoding("utf8");
console.clear();
let display;
let deleteOK=false;
let resetOK=false;
if(data.display===true){
    console.log("このゲームの使い方を説明します");
    console.log("ゲームはじゃんけん、オセロ、五目並べの三種類です");
    console.log("「.help」でこの案内が出ます");
    console.log("「.exit」でゲームを終了します");
    console.log("「.delete」でユーザーを削除します");
    console.log("「.reset」で全ての設定（ユーザー削除含む）をリセットします");
    console.log("次からはこの案内を表示しませんか");
    console.log("1：はい");
    console.log("2：いいえ");
    display=true;
}
else console.log("こんにちは、ユーザー名を入力してください");
process.stdin.on('data',(input)=>{
    input=input.trim();
    console.clear();
    if(deleteOK===true){
        if(input==="1"){
            delete data.users[name];
            console.log("現在のユーザーを削除しました");
            console.log("ユーザー名を入力してください");
            progress=1;
            fs.writeFileSync("data.json",JSON.stringify(data,null,2));
        }
        else{
            console.log("削除を取り止めました");
            console.log("ユーザー名を入力してください");
            progress=1;
            fs.writeFileSync("data.json",JSON.stringify(data,null,2));
        }
    }
    else if(display===true){
        if(input==="1"){
            data.display=false;
            fs.writeFileSync("data.json",JSON.stringify(data,null,2));
            display=false;
            console.log("では、ユーザー名を入力してください");
        }
        else{
            console.log("了解しました");
            console.log("ではユーザー名を入力してください");
            display=false;
        }
    }
    else if(resetOK===true){
        if(input==="1"){
            delete data.users[name];
            data.display=true;
            console.log("リセットしました");
            console.log("ユーザー名を入力してください");
            progress=1;
            fs.writeFileSync("data.json",JSON.stringify(data,null,2));
            resetOK=false;
        }
        else{
            console.log("リセットを取り止めました");
            console.log("ユーザー名を入力してください");
            progress=1;
            fs.writeFileSync("data.json",JSON.stringify(data,null,2));
            resetOK=false;
        }
    }
    else if(input===".help"){
        console.log("このゲームの使い方を説明します");
        console.log("ゲームはじゃんけん、オセロ、五目並べの三種類です");
        console.log("「.help」でこの案内が出ます");
        console.log("「.exit」でゲームを終了します");
        console.log("「.delete」でユーザーを削除します");
        console.log("「.reset」で全ての設定（ユーザー削除含む）をリセットします");
        console.log("次からはこの案内を表示しませんか");
        console.log("1：はい");
        console.log("2：いいえ");
        display=true;
    }
    else if(input===".delete"){
        console.log("本当に削除しますか");
        console.log("1：はい");
        console.log("2：いいえ");
        deleteOK=true;
    }
    else if(input===".reset"){
        console.log("本当にリセットしますか");
        console.log("1：はい");
        console.log("2：いいえ");
        resetOK=true;
    }
    else if(input===".exit"){
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
            console.log("こんにちは、ユーザー名を入力してください");
            delete data.users[name];
            fs.writeFileSync('data.json',JSON.stringify(data,null,2));
        }
        else if(progress===3||progress===4||progress===5){
            progress=2;
            console.log("こんにちは、"+name+"さん");
            console.log("ゲームを選択してください");
            console.log("1:じゃんけん");
            console.log("2:オセロ");
            console.log("3:五目並べ");
        }
        else if(progress===6||progress===7||progress===8||progress===9||progress===10||progress===11||progress===12){
            if(data.users[name].playingGame==="jankenn"){
                progress=3;
                console.log("じゃんけん");
                console.log("どちらかを選択してください");
                console.log("1:AIと対戦する");
                console.log("2:AIとともに相手と対戦する");
            }
            else if(data.users[name].playingGame==="othello"){
                progress=4;
                console.log("オセロ");
                console.log("選択してください");
                console.log("1：AIと対戦ーコマの数");
                console.log("2：AIと対戦ー勝率");
                console.log("3：2人で対戦");
            }
            else if(data.users[name].playingGame==="gomoku"){
                progress=5;
                console.log("五目並べ");
                console.log("選択してください")
                console.log("1：AIと対戦");
                console.log("2：2人で対戦");
            }
        }
    }
    else{
    if(progress===1){
    if(!(input in data.users)){
        name=input;
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
        data.users[name].playingGame="jankenn";
        fs.writeFileSync('data.json',JSON.stringify(data,null,2));
        console.log("じゃんけん");
        console.log("どちらかを選択してください");
        console.log("1:AIと対戦する");
        console.log("2:AIとともに相手と対戦する");
        progress=3;
    }
    else if(input==="2"){
        data.users[name].playingGame="othello";
        fs.writeFileSync('data.json',JSON.stringify(data,null,2));
        console.log("オセロ");
        console.log("選択してください");
        console.log("1：AIと対戦ーコマの数");
        console.log("2：AIと対戦ー勝率");
        console.log("3：2人で対戦");
        progress=4;
    }
    else if(input==="3"){
        data.users[name].playingGame="gomoku";
        fs.writeFileSync('data.json',JSON.stringify(data,null,2));
        console.log("五目並べ");
        console.log("選択してください");
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
            console.log("位置は「縦,横（1,1など)」で入力");
            console.log("準備はいいですか？");
            console.log("1：はい");
            console.log("2：いいえ");
            progress=8;
        }
        else if(input==="2"){
            console.log("AIは勝率が最も高くなる手を選びます")
            console.log("これは上級者向けです");
            console.log("位置は「縦,横（1,1など)」で入力");
            console.log("準備はいいですか？");
            console.log("1：はい");
            console.log("2：いいえ");
            progress=9;
        }
        else if(input==="3"){
            console.log("他の人と対戦します");
            console.log("位置は「縦,横（1,1など)」で入力");
            console.log("準備はいいですか？");
            console.log("1：はい");
            console.log("2：いいえ");
            progress=10;
        }
        else{
            console.log("有効な数字を入力してください");
            console.log("1：AIと対戦ーコマの数");
            console.log("2：AIと対戦ー勝率");
            console.log("3：2人で対戦");

        }
    }
    else if(progress===5){
        console.clear();
        if(input==="1"){
            console.log("AIと対戦します");
            console.log("位置は「縦,横（1,1など)」で入力");
            console.log("準備はいいですか？");
            console.log("1：はい");
            console.log("2：いいえ");
            progress=11;
        }
        else if(input==="2"){
            console.log("他の人と対戦します");
            console.log("位置は「縦,横（1,1など)」で入力");
            console.log("準備はいいですか？");
            console.log("1：はい");
            console.log("2：いいえ");
            progress=12;
        }
        else{
            console.log("有効な数字を入力してください");
            console.log("1：AIと対戦");
            console.log("2：2人で対戦");
        }
    }
    //じゃんけん（AIと）
    else if(progress===6){
        if(input==="グー"||input==="チョキ"||input==="パー"){
        let answer=playJankennVsAI(input);
        if(answer==="あなたの勝ちです"||answer==="あなたの負けです"){
            console.log(answer);
            console.log("もう一度ゲームをしますか");
            console.log("1：はい");
            console.log("2：いいえ");
        }
        else{
            console.log(answer);
        }
        }
        else{
            console.log("有効な文字を入力してください");
        }
    }
    //じゃんけん
    else if(progress===7){}
    //オセロ（コマ数）
    else if(progress===8){}
    //オセロ（勝率）
    else if(progress===9){}
    //オセロ（他の人と）
    else if(progress===10){}
    //五目並べ（AIと）
    else if(progress===11){}
    //五目並べ（他の人と）
    else if(progress===12){}
}
})
function playJankennVsAI(data){};
function playJankennWithAI(data){};
function playOthelloVsAIwithNumber(data){};
function playOthelloVsAIwithPercentage(data){};
function playOthelloVsOther(data){};
function playGmokuVsAI(data){};
function playGmokuVsOther(data){};