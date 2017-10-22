const Observable = require("data/observable").Observable;
const ObservableArray = require("data/observable-array").ObservableArray;
const fetchModule = require("fetch");
const host = "https://rivebot.shiv19.com";

function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  const strTime = hours + ':' + minutes + ' ' + ampm;

  return strTime;
}

function createViewModel() {
    const viewModel = new Observable();
    viewModel.userMsg = "";
    viewModel.chats = new ObservableArray([]);

    viewModel.onChat = function() {
        if (viewModel.userMsg.trim() !== "") {
            viewModel.chats.push({
                "who": "user",
                "image": "~/assets/user.png",
                "message": viewModel.userMsg,
                "timestamp": formatAMPM(new Date())
            });
            fetchModule.fetch(host + "/reply", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "username":"user",
                    "message":viewModel.userMsg
                })
            })
            .then((response) => {
                if (!response.ok) {
                    const responseObj = response.json();
                    if (!responseObj.error) {
                        responseObj.error = "Something went wrong!";
                    }

                    return responseObj;
                }

                return response.json();
            })
            .then((response) => {
                const botReply = {
                    "who": "bot",
                    "image": "~/assets/bot.png",
                    "message": "",
                    "timestamp": formatAMPM(new Date())
                };
                if (response.error) {
                    console.log("couldn't talk to bot");
                    botReply.message = "Something went wrong";
                }
                else {
                    botReply.message = response.reply;
                }
                viewModel.chats.push(botReply);
                viewModel.userMsg = "";
            });
        }        
    };

    return viewModel;
}

exports.createViewModel = createViewModel;
