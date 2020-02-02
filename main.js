//スクリプトプロパティの読み込み
var CHANNEL_ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty('CHANNEL_ACCESS_TOKEN');
var CALENDAR_ID = PropertiesService.getScriptProperties().getProperty('CALENDAR_ID');
var SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');

var CALENDAR_URL = PropertiesService.getScriptProperties().getProperty('CALENDAR_URL');
var SPREADSHEET_URL = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_URL');

//Googleサービス読み混み
var ssForLogs = SpreadsheetApp.getActiveSpreadsheet();
var calendar = CalendarApp.getCalendarById(CALENDAR_ID);
var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);



// メイン処理。LINE botがユーザーからメッセージを受け取った時
function doPost(e) {
  getMessage(e);
  outputLog(e);
}

function getMessage(e){
  var event = JSON.parse(e.postData.contents).events[0];
  var replyToken = event.replyToken;
  if(typeof replyToken === 'undefined'){
    return;
  };

  var messageText = event.message.text;
  var cache = CacheService.getScriptCache();

  // ユーザーから受け取ったメッセージを部分一致で処理を分岐
  if(messageText.match("おつかれ")){

    

  }else if(messageText.match("履歴")){
    var message1 = "カレンダー\n" + CALENDAR_URL;
    var message2 = "シート\n" + SPREADSHEET_URL;
    replyMessages(replyToken, message1, message2);

  }else{
    var message = "【READ ME】\n●「おつかれ」と入れてみてください。日報を入力できます。\n●「履歴」と入れるとカレンダー・シートを送ります。";
    reply(replyToken, message);
  };
}


// ラインにメッセージを返す処理。
function reply(replyToken, message){

  var url = "https://api.line.me/v2/bot/message/reply";
  var message = {
    "replyToken" : replyToken,
    "messages" : [
      {
        "type" : "text",
        "text" : message
      }
    ]
  };

  var options = {
    "method" : "post",
    "headers" : {
      "Content-Type" : "application/json",
      "Authorization" : "Bearer " + CHANNEL_ACCESS_TOKEN
    },
    "payload" : JSON.stringify(message)
  };

  UrlFetchApp.fetch(url, options);
}


// ラインに二つのメッセージを返す処理。
function replyMessages(replyToken, message1, message2){

  var url = "https://api.line.me/v2/bot/message/reply";
  var message = {
    "replyToken" : replyToken,
    "messages" : [{
        "type" : "text",
        "text" : message1
      },{
        "type" : "text",
        "text" : message2
      }
    ]
  };

  var options = {
    "method" : "post",
    "headers" : {
      "Content-Type" : "application/json",
      "Authorization" : "Bearer " + CHANNEL_ACCESS_TOKEN
    },
    "payload" : JSON.stringify(message)
  };

  UrlFetchApp.fetch(url, options);
}



//スプレッドシートにログを表示するためのもの
function outputLog(text){
  var sheetName = "logs";
  ssForLogs.getSheetByName(sheetName).appendRow(
    [new Date(), text]
  );
}