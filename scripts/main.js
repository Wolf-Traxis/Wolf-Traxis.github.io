let gameIsOn = false;
let currentWave = 0;
let spiders = [];
let inGameSpiders = [];
let inGameExtras = [];
let playerScore = 0;
let heroLives = 0;
let bestScores = {tenBests: [], lastFive: []};
let hits = 0;
let baseExtraChance = 0;
let tirEventail = false;
let tirFragment = false;
let tirPerforant = false;
let tirDeregle = false;
let tirEnraye = false;
let canShoot = false;
let extraNames = [{name: 'Renforts ennemis', type: 'malus', label: ''}, {name: 'Dérèglement de la visée', type: 'malus', label: 'Visée déréglée'}, {name: 'Enrayement du tir', type: 'malus', label: 'Tir enrayé'}, {name: 'Projectiles perforants', type: 'bonus', label: 'Tir perforant'}, {name: 'Tir en éventail', type: 'bonus', label: 'Tir en éventail'}, {name: 'Tir à fragmentation', type: 'bonus', label: 'Tir à fragmentation'}, {name: 'Vie supplémentaire', type: 'bonus', label: ''}];
let userName = 'AAA';
let levels = ["très faible", "faible", "modérée", "forte" ,"très forte"];
let difficultyLevel = 2;
let specialMode = "";

$(document).ready(init);

function init()
{
	$(document).attr('unselectable', 'on').css('user-select', 'none').css('MozUserSelect', 'none').on('selectstart', false);
	$('.changeSound').on('click', changeVolume);
	$('.difficulty').on ('click', setDifficultyLevel);
	$('.gameArea').on('mousemove', rotateDiv);
	$('.applyButton').on('click', showMainMenu);
	$('.startGame').on('click', startGame);
	$(document).on('click', shoot);
	loadScores();
	updateScore();
	initSounds();
}

function startGame(e)
{
	difficultyLevel = +$('.selected').attr('data-level');
	$('.spider,.bullet,.extra').remove();
	$('.mainMenu').css ("display", "none");
	gameIsOn = true;
	currentWave = 0;
	spiders = [];
	inGameSpiders = [];
	inGameExtras = [];
	playerScore = 0;
	heroLives = 2;
	hits = 0;
	tirEventail = false;
	tirFragment = false;
	tirPerforant = false;
	tirDeregle = false;
	tirEnraye = false;
	canShoot = false;
	e.stopPropagation();
	updateScore();
	newWave();
}

function showMainMenu()
{
	userName = $('.userName').val();
	updateScore();
	saveScores();
	$('.gameOverZone').addClass ("gameNotOver");
	$('.mainMenu').css ("display", "initial");
}

function setDifficultyLevel(e)
{
	$('.selected').removeClass('selected');
	$(e.currentTarget).addClass('selected');
}

function guid()
{
	let group = function (groupLength)
				{
					return 	String(' ')
								.repeat(groupLength)
								.split('')
									.map(e => crypto.getRandomValues(new Uint8Array(1))[0] % 16)
									.map(e => e.toString(16).toUpperCase())
									.join('');
				};
	return group(8) + "-" + group(4) + "-" + group(4) + "-" + group(4) + "-" + group(12);
}

function cartesianToPolar (x1, y1, x2, y2)
{
	let x = x2 - x1;
	let y = y2 - y1;
	return 	{
				distance : Math.sqrt((x * x) + (y * y)),
				angle : -(Math.atan2(x, y) * 180 / Math.PI)
			};
}

function polarToCartesian (distance, angle)
{
	return 	{
				left: distance * Math.cos(angle),
				top: distance * Math.sin(angle)
			};
}
