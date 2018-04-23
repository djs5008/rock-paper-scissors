// Global vars
var move1 	= null;
var move2 	= null;
var done 	= false;
var localMove = null;
var wins	= 0;

var url_string = window.location;
var url = new URL(url_string);
var lobbyID = url.searchParams.get("id");

$(document).ready(function() {
	// Rock click
	$("#rock").on("click",function(){
		playMove('rock', false, lobbyID);
	});   

	// Paper click
	$("#paper").on("click",function(){
		playMove('paper', false, lobbyID);
	});   

	// Scissors click
	$("#scissors").on("click",function(){
		playMove('scissors', false, lobbyID);
	});

	var inviteModalURL = $('#inviteModalURL');
    inviteModalURL.attr('value', document.location);
    inviteModalURL.click(function () {
		$(this).select();
	});
});
   

function playMove(move, server, lobbyID) {
	// Dont play moves after already played
	if (done && !server) return;

	// Set appropriate ready image
	if (!server) {
		setMove(1, move, server);
	} else {
		setMove(2, move, server);
	}

	// Send move over socket
	if (!server) {
		switch (move) {
			case 'rock':
				socket.emit('rps-move', lobbyID, 'rock');
				break;
			case 'paper':
				socket.emit('rps-move', lobbyID, 'paper');
				break;
			case 'scissors':
				socket.emit('rps-move', lobbyID, 'scissors');
				break;
		}
		done = true;
		localMove = move;
	}

	if (!($('#move1').is(':empty')) && !($('#move2').is(':empty'))) {
		socket.emit('game-over', lobbyID);
	}
}

function setMove(index, move, server) {
	if (index === 1) {
		move1 = move;
		$('#move1').html("<img class=\"center-block\" src=\"img/ready" + ((!server) ? "_you" : "") + ".png\">");
	} else if (index === 2) {
		move2 = move;
		$('#move2').html("<img class=\"center-block\" src=\"img/ready" + ((!server) ? "_you" : "") + ".png\">");
	}
}

function showMoves() {
	// Set move1, move2 images
	$('#move1').html("<img class=\"center-block\" src=\"img/" + move1 + ".png\">");
	$('#move2').html("<img class=\"center-block\" src=\"img/" + move2 + ".png\">");

    var well1 = $('#well1');
    var well2 = $('#well2');

	// Check who won and 
	switch (checkWin()) {
		case '1':
			well1.addClass("win");
			well2.addClass("lose");
			if (move1 === localMove) {
				addWin();
			}
			break;
		case '2':
			well2.addClass("win");
			well1.addClass("lose");
			if (move2 === localMove) {
				addWin();
			}
			break;
		case 'tie':
			well1.addClass("tie");
			well2.addClass("tie");
			break;
	}
	
	// Reset moves
	setTimeout(resetPlays, 3000);
}

function addWin() {
	wins = wins + 1;
	$('#wins').html('Wins: ' + wins);
}

function resetPlays() {
	// Reset global vars
	move1 = null;
	move2 = null;
	done = false;

    var well1 = $('#well1');
    var well2 = $('#well2');

	// Reset win/loss
	well1.removeClass("win");
	well1.removeClass("lose");
	well1.removeClass("tie");
	well2.removeClass("win");
	well2.removeClass("lose");
	well2.removeClass("tie");
	
	// Reset displayed moves
	$('#move1').html('');
	$('#move2').html('');
}

function checkWin() {
	// If moves are same, tie
	if (move1 === move2) {
		return 'tie';
	}
	
	// If moves are different, 
	// check for winning/losing combination
	switch (move1) {
		case 'rock':
			if (move2 === 'paper') {
				return '2';
			} else {
				return '1';
			}
			break;
		case 'paper':
			if (move2 === 'scissors') {
				return '2';
			} else {
				return '1';
			}
			break;
		case 'scissors':
			if (move2 === 'rock') {
				return '2';
			} else {
				return '1';
			}
			break;
	}
}
