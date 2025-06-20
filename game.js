const fs=require("fs");
let data=JSON.parse(fs.readFileSync('data.json','utf8'));
let progress=1;
process.stdin.setEncoding("utf8");
console.log("こんにちは、ユーザー名を入力してください");
process.stdin.on('data',(input)=>{
    if(progress===1){
    console.clear();
    input=input.trim();
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
        progress+=1;
    }
    else{
        console.log("こんにちは、"+input+"さん");
        console.log("ゲームを選択してください。");
        console.log("1:じゃんけん");
        console.log("2:オセロ");
        console.log("3:五目並べ");
        progress+=1;

    }
}
    if(progress===2){
        console.clear();
    if(input==="1"){
        console.log("どちらかを選択してください");
        console.log("1:AIと対戦する");
        console.log("AIとともに相手と対戦する");
    }
    }
})