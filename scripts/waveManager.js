function createWave()
{
	addSpidersToCurrentWave(10 + currentWave);
	renderWave();
}

function addSpidersToCurrentWave(number)
{
	let gameArea = $('.gameArea');
	let target = $('.hero');
	let offsets = {left: gameArea.offset().left, top: gameArea.offset().top};
	let size = {width: target.width(), height: target.height()};
	let coords = {left: target.offset().left + (size.width / 4) - offsets.left, top: target.offset().top + (size.height / 4) - offsets.top};
	for (let t = 0; t < number; t++)
	{
		let distance = 400 + parseInt((Math.random() * 100));
		let PV = parseInt(Math.random() * 3) + 1;
		let anglePos = parseInt(Math.random() * 359);
		let targetCartesianCoords = polarToCartesian(distance, anglePos);
		let orientation = cartesianToPolar(coords.left, coords.top, coords.left + targetCartesianCoords.left, coords.top + targetCartesianCoords.top);
		spiders.push	(
						{
							id: guid(),
							PV: PV,
							life: PV,
							angle: anglePos,
							coords: coords,
							targetCartesianCoords: targetCartesianCoords,
							orientation: orientation
						}
					);
	}
	showStats();
}

function renderWave ()
{
	if (!gameIsOn)
	{
		return;
	}
	let spider;
	spider = spiders.shift();
	if (spider)
	{
		playWalkSound();
		$('<img class="spider" data-id="' + spider.id + '" src="images/ennemi1Position2.png">')
		.css 	(
					{
						left: (spider.coords.left + spider.targetCartesianCoords.left) + 'px',
						top: (spider.coords.top + spider.targetCartesianCoords.top) + 'px',
						transform: 'rotate(' + (spider.orientation.angle) + 'deg) scale(' + spider.PV + ')'
					}
				)
		.appendTo('.gameArea')
		.animate 	(
						{
							left: spider.coords.left + 'px',
							top: spider.coords.top + 'px'
						},
						{
							duration: 20000 - (spider.PV == 1 ? 10000 : spider.PV == 3 ? -10000 : 0) - ((difficultyLevel - 1) * 1500),
							easing: 'linear',
							progress: function (animation, progression, timeleft)
										{
											let step = $(this).attr('data-step') || 0;
											if (++step % (3 * spider.PV) == 0)
											{
												$(this).attr('src', 'images/ennemi1Position' + (1 + Math.ceil(progression * 10000) % 3) + '.png');
											}
											$(this).attr('data-step', step);
											let spiderPosition = $(this).offset();
											let heroPosition = $('.hero').offset();
											let radialCoords = cartesianToPolar(spiderPosition.left + ($(this).width() * spider.PV / 2), spiderPosition.top + ($(this).height() * spider.PV / 2), heroPosition.left + ($('.hero').width() / 2), heroPosition.top + ($('.hero').height() / 2));
											if (radialCoords.distance <= 15 * spider.PV)
											{
												let spiderThing = $(this);
												let blinkTime = 10;
												heroLives--;
												playHeroHitSound();
												if (heroLives < 0)
												{
													gameOver();
													return;
												}
												spiderThing.remove();
												let theSpider = inGameSpiders.find(f => f.id == spider.id);
												inGameSpiders.splice(inGameSpiders.indexOf(theSpider), 1);
												showStats();
												let blink = function ()
															{
																$('.hero')
																	.css('opacity', blinkTime-- % 2 == 1 ? 1 : 0);
																if (blinkTime > 0)
																{
																	setTimeout(blink, 100);
																}
																else
																{
																	$('.hero').css('opacity', 1);
																}
															};
												blink();
												delete this;
											}
										}
						}
					);
		spider
			.htmlElement = $('.spider[data-id="' + spider.id + '"]');
		inGameSpiders.push(spider);
		setTimeout	(
						renderWave,
						Math.max(500, (2000 - (difficultyLevel * 250)) - (currentWave * 25))
					);
	}
	else
	{
		newWave();
	}
	showStats();
}

function newWave()
{
	console.log('New wave');
	playNewWaveSound();
	currentWave++;
	baseExtraChance = 100 - (5 + (parseInt(currentWave / 5) * 2)) - ((5 - difficultyLevel) * 5);
	$('.waveLevel')
		.css 	(
			  {
			    opacity: 1,
			    top: '200px'
			  }
			)
		.text('Vague ' + currentWave);
	setTimeout	(
			  e => 	{
			    	  $('.waveLevel')
					.css 	(
							{
								opacity: 0,
								top: '-100px'
							}
						);
					createWave();
				},
				3000
			);
}

function checkForExtra(position)
{
	let extra;
	let type;
	if (Math.random() * 100 > baseExtraChance)
	{
		playFallSound();
		type = parseInt(Math.random() * extraNames.length);
		if (difficultyLevel == 1 && extraNames[type].type == 'malus')
		{
			type = parseInt(Math.random() * extraNames.length);
		}
		extra = $('<div class="extra' + (difficultyLevel <= 2 ? ' '  + extraNames[type].type : '') + '" data-type="' + type + '"><label>Ex' + '</label></div>');
		extra.css({left: position.left + 'px', top: position.top + 'px', transform: 'rotate(' + (Math.random() * 360) + 'deg)'});
		setTimeout	(
						e => 	{
									extra.animate	(
														{content: ''}, 
														{
															duration: 2000, 
															easing: 'linear', 
															progress: (animation, progression, timeLeft) => {
																												if (parseInt(progression * 100) % 10 == 0)
																												{
																													extra.css('opacity', extra.css('opacity') == 0 ? 1 : 0);
																												}
																											}, 
															complete: e => 	{
																				extra.remove();
																				delete this;
																			}
														}
													);
								},
						3000
					);
		$('.gameArea').append(extra);
		inGameExtras.push({type: type, htmlElement: extra});
	}
}

function applyExtra(e)
{
	let no;
	let position = e.htmlElement.offset();
	let decalage = $('.gameArea').offset();
	if (extraNames[e.type].type == 'malus')
	{
		playMalusSound();
	}
	else
	{
		playBonusSound();
	}
	if (e.type == 0)
	{
		addSpidersToCurrentWave(parseInt(10 + (Math.random() * 10)));
	}
	tirDeregle = e.type == 1;
	tirEnraye = e.type == 2;
	tirPerforant = e.type == 3;
	tirEventail = e.type == 4;
	tirFragment = e.type == 5;
	if (e.type == 6)
	{
		heroLives++;
	}
	specialMode = extraNames[e.type].label;
	showStats();
	no = guid();
	$('.gameArea')
		.append('<label class="extraName" data-id="' + no + '">' + extraNames[e.type].name + '</label>');
	$('.extraName[data-id="' + no + '"]')
		.css	(
					{
						left: (position.left - decalage.left) + 'px',
						top: (position.top - decalage.top) + 'px'
   					}
				);
	$('.extraName[data-id="' + no + '"]')
		.animate (
		{
			opacity: 0,
			top: '-50px'
		},
		{
			duration: 5000,
			easing: 'linear',
			complete: 	function ()
						{
							$('.gameArea').find(this).remove();
							delete this;
						}
		}
	);
}

