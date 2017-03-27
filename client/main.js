import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Mongo } from 'meteor/mongo';
import { Accounts } from 'meteor/accounts-base';
import { Session } from 'meteor/session'
 
import './main.html';

 Messeges = new Mongo.Collection('messages');

 Session.set("currentChatHistory", []);

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});



Template.register.events({
    'submit form': function(event){
        event.preventDefault();
        $("#ErrorContainer").text(" ")
        var username = $('[name=usernameRegister]').val();
        var password = "HelloWOrld"; 
        console.log(username +' ' + password);
        Accounts.createUser({
		    username: username,
		    password: password
		}, function(error){
		    if(error){
		        console.log(error.reason); // Output error if registration fails
		        if(error.reason === "Match failed" || error.reason =="Need to set a username or email")
		        {
		        	$("#ErrorContainer").text("Error: Please enter a username")
		        }
		        else if(error.reason === "Username already exists.")
		       	{
		        	$("#ErrorContainer").text("Error: Username already exists")

		       	}
		    } 
		});
    }
});




Template.login.events({

    'submit form': function(event){
        event.preventDefault();
        $("#ErrorContainer").text(" ")
        var username = $('[name=usernameLogin]').val();
        var password = "HelloWOrld";
        Meteor.loginWithPassword(username, password, function(error){
		    if(error){
		        console.log(error.reason);
		        if(error.reason === "Match failed" || error.reason =="Need to set a username or email")
		        {
		        	$("#ErrorContainer").text("Error: Please enter a username")
		        }
		        else if(error.reason === "User not found")
		       	{
		        	$("#ErrorContainer").text("Error: Username does not exist")

		       	}		        
		    } 
		});

    }, 
    'click .createAccountButton'(){
    	console.log('create account button hit');
    	$(".logination").hide();
    	$(".registration").show(); 

    }

});


Template.register.events({
	'click .LoginInButton'(){
		console.log('Login IN button hit');
    	$(".logination").show();
    	$(".registration").hide(); 
	}
});

Template.usersView.helpers({
  users() {
  	return Meteor.users.find({username: { $ne: Meteor.user().username }} ).fetch();
  },
});


Template.user.events({
	'click .aUser'(){
		console.log(this);
		console.log($("#" + this.username));
		$(".selected").removeClass("selected");
		$("#" + this.username).addClass("selected");
		console.log(Meteor.user().username);
		var usernames = [Meteor.user().username, this.username];
		usernames.sort(); 
		var chatID = usernames[0]+"_" + usernames[1];
		console.log(chatID);

		console.log(Messeges.find({chatID: chatID}).fetch());
		var newChatHistory = Messeges.find({chatID: chatID}, { sort: { createdAt: -1 } }).fetch(); 
		Session.set("currentChatHistory", newChatHistory); 
	},

});

Template.chatHistory.helpers({
	messages(){
		return  Session.get("currentChatHistory"); 
	}

});

Template.newMessage.events({
	'click .sendNewMessageButton'(){
		console.log($(".selected").text());
		var usernames = [Meteor.user().username, $(".selected").text()];
		usernames.sort(); 
		var chatID = usernames[0]+"_" + usernames[1];
		console.log(chatID);
		console.log($("#newMessageValue").val());
		var text = $("#newMessageValue").val(); 
		$("#newMessageValue").val(""); 
		Messeges.insert({
			text: text, 
			createdAt: new Date(), 
			sender: Meteor.user().username,
			chatID: chatID
		});
		var newChatHistory = Messeges.find({chatID: chatID}, { sort: { createdAt: -1 } }).fetch(); 
		Session.set("currentChatHistory", newChatHistory); 
	}


});

Template.message.events({
	'click .delete'(){
		console.log('deleting' + this._id)
		Messeges.remove(this._id);
		var usernames = [Meteor.user().username, $(".selected").text()];
		usernames.sort(); 
		var chatID = usernames[0]+"_" + usernames[1];
		var newChatHistory = Messeges.find({chatID: chatID}, { sort: { createdAt: -1 } }).fetch(); 
		Session.set("currentChatHistory", newChatHistory); 
	}
});


