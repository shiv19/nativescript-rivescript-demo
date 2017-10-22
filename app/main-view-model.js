const Observable = require("data/observable").Observable;
const ObservableArray = require("data/observable-array").ObservableArray;
const fetchModule = require("fetch");
const host = "https://rivebot.shiv19.com";

function createViewModel() {
    const viewModel = new Observable();
    viewModel.userMsg = "";
    viewModel.chats = new ObservableArray([]);

    viewModel.onChat = function() {
        viewModel.chats.push({
            "who": "user",
            "image": "~/assets/user.png",
            "message": viewModel.userMsg,
            "timestamp": "12:03 PM"
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
                "timestamp": "12:03 PM"
            };
            if (response.error) {
                console.log("couldn't talk to bot");
                botReply.message = "Something went wrong";
            }
            else {
                botReply.message = response.reply;
            }
            viewModel.chats.push(botReply);
        });
    };

    return viewModel;
}

exports.createViewModel = createViewModel;
