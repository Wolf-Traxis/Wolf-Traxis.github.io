function updateScore()
{
	$('.currentScore').text(playerScore);
	showStats();
	updateHallOfFame();
}

function showStats()
{
	$("#waveNo").text(currentWave);
	$("#spidersNumber").text(spiders.length + " - " + inGameSpiders.length);
	$("#lives").text(heroLives + 1);
	$("#killedSpiders").text(hits);
	$('#lblDifficultyLevel').text("Difficulté " + levels[difficultyLevel]);
	$('#lblSpecialMode').text(specialMode);
}

function updateHallOfFame()
{
	let playerName = $('.gameOverZone .userName').val().toUpperCase();
	if (playerName == "")
	{
		playerName = "AAA";
	}
	if (!gameIsOn)
	{
		bestScores.tenBests.push({name: playerName, score: playerScore});
		bestScores.tenBests.sort((a, b) => a.score > b.score ? -1 : a.score == b.score ? 0 : 1);
		bestScores.tenBests = bestScores.tenBests.slice(0, 10);
		bestScores.lastFive.push({name: playerName, score: playerScore});
		bestScores.lastFive = bestScores.lastFive.slice(-5);
	}
	showHallOfFame();
}

function showHallOfFame()
{
	let TBScoresOne = "";
	let TBScoresTwo = "";
	let LFScores = "";
	bestScores.tenBests.forEach((e, i) => {if (i < 5) {TBScoresOne += '<label class="bestTen">' + e.score + ' - ' + e.name + '</label>'} else {TBScoresTwo += '<label class="bestTen">' + e.score + ' - ' + e.name + '</label>'}});
	bestScores.lastFive.forEach((e, i) => LFScores += '<label class="lastFive">' + e.score + ' - ' + e.name + '</label>');
	$('#BTOne')
		.empty()
		.append(TBScoresOne);
	$('#BTTwo')
		.empty()
		.append(TBScoresTwo);
	$('.lastFiveContainer')
		.empty()
		.append(LFScores);
}

function saveScores()
{
	localStorage.setItem("HallOfFame", JSON.stringify(bestScores));
}

function loadScores()
{
	let savedData = localStorage.getItem('HallOfFame');
	if (!savedData)
	{
		saveScores();
	}
	else
	{
		bestScores = JSON.parse(savedData);
	}
	let ctlBest = 10 - bestScores.tenBests.length;
	if (ctlBest > 0)
	{
		bestScores.tenBests.push(...String(' '.repeat(ctlBest)).split('').fill({name: 'AAA', score: 0}));
	}
	showHallOfFame();
}

function addToScore(points, animationParams)
{
	let no = guid();
	playerScore += points;
	updateScore();
	if (animationParams)
	{
		$('.gameArea')
			.append('<label class="points" data-id="' + no + '">' + points + '</label>');
		$('.points[data-id="' + no + '"]')
			.css	(
						{
							left: animationParams.left + 'px',
							top: animationParams.top + 'px'
	   					}
					);
		$('.points[data-id="' + no + '"]')
			.animate (
			{
				opacity: 0,
				top: '-50px'
			},
			{
				duration: animationParams.duration,
				easing: 'linear',
				complete: 	function ()
							{
								$('.gameArea').find(this).remove();
								delete this;
							}
			}
		);
	}
}

function gameOver()
{
	playGameOverSound();
	gameIsOn = false;
	$.fx.stop(false, false);
	$('.gameOverZone .message:first')
		.text("Bravo !!!");
	$('.gameOverZone .message:last')
		.html('Vous avez réussi à marquer <span class="bigPoints">' + playerScore + '</span> points.');
	$('.gameOverZone')
		.removeClass('gameNotOver');
	$('.gameOverZone .userName').val("AAA").select().focus();
}
