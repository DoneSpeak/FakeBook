var pool = require('./pool');
var sql = require('./sql');



module.exports = FriendRequest;

function FriendRequest(friendRequest){
  this.sender = friendRequest.sender;
  this.receiver = friendRequest.receiver;
  this.date = friendRequest.date;
}

FriendRequest.prototype.checkFriendRequest = function(){

}
