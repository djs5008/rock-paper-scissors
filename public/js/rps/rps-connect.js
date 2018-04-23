const socket = io();

var url_string = window.location;
var url = new URL(url_string);
var lID = url.searchParams.get("id");

socket.on('connect', function() {
	socket.emit('join-game', lID);
});

socket.on('rps-move', function(move, lobbyID) {
    if (lobbyID === lID) {
		playMove(move, true, lobbyID);
	}
});

socket.on('game-over', function(lobbyID) {
	if (lobbyID === lID) {
		setTimeout(showMoves, 1500);
	}
});

socket.on('redirect', function(destination) {
    window.location.href = destination;
});
