const inquirer=require("inquirer");
const fs=require("fs");
const { type } = require("os");
let data=JSON.parse(fs.readFileSync('data.json','utf8'));
console.clear();
function save(){fs.writeFileSync('data.json',JSON.stringify(data,null,2));}
if(data.display===true){
    console.log("このゲームの使い方を説明します");
    console.log("ゲームはじゃんけん、オセロ、五目並べの三種類です");
    console.log("「.help」でこの案内が出ます");
    console.log("「.exit」でゲームを終了します");
    console.log("「.delete」でユーザーを削除します");
    console.log("「.reset」で全ての設定（ユーザー削除含む）をリセットします");
    inquirer.prompt([
        {
            type:'confirm',
            name:'answer',
            message:'次からもこの案内を表示しますか',
        }
    ]).then(answers => {
        if(answers.answer===true){
            console.log("了解しました");
        }
        else{
            console.log("了解しました、次からは案内を表示しません");
            data.display=false;
            save();
        }
    })
}
inquirer.prompt([
    {
        type:'input',
        name:'name',
        message:"あなたの名前を入力してください",
    }
]).then(answers=>{
    console.log(`こんにちは、${answers.name}さん`);
    data.users[answers.name]={
        info:true,
    }
    save();
})