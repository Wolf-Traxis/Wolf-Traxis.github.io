function rotateDiv(e)
{
	if (!gameIsOn)
	{
		return;
	}
	let coords;
	let size;
	let polar;
	coords = $('.hero').offset();
	size = {width: $('.hero').width(), height: $('.hero').height()};
	polar = cartesianToPolar(e.pageX, e.pageY, coords.left + (size.width / 2), coords.top + (size.height / 2));
	$('.hero')
		.css	(
					'transform',
					'rotate(' + polar.angle + 'deg)'
				);
}

function shoot(e)
{
	if (!gameIsOn)
	{
		return;
	}
	let gameArea;
	let shooter;
	let offsets;
	let center;
	let vector;
	let target;
	let orientation;
	if (!tirEnraye || (tirEnraye && canShoot))
	{
		gameArea = $('.gameArea');
		shooter = $('.hero');
		offsets = {left: gameArea.offset().left, top: gameArea.offset().top};
		center = {left: shooter.offset().left - offsets.left + (shooter.width() / 2), top: shooter.offset().top - offsets.top + (shooter.height() / 2)};
		vector = cartesianToPolar(center.left, center.top, e.pageX - offsets.left, e.pageY - offsets.top);
		vector.angle += !tirDeregle ? 0 : (Math.random() < .5 ? -1 : 1) * (1 + (Math.random() * 25));
		target = polarToCartesian(800, (vector.angle + 90) * Math.PI / 180);
		orientation = {horizontal: (center.left + target.left) > center.left ? 1 : -1, vertical: (center.top + target.top) > center.top ? 1 : -1};
		createBullet(center, target, orientation);
		if (tirEventail)
		{
			target = polarToCartesian(800, (vector.angle + 105) * Math.PI / 180);
			createBullet(center, target, orientation);
			target = polarToCartesian(800, (vector.angle + 75) * Math.PI / 180);
			createBullet(center, target, orientation);
		}
	}
	if (tirEnraye)
	{
		canShoot = !canShoot;
	}
}

function createBullet(center, target, orientation)
{
	playShootSound();
	$('<div class="bullet"></div>')
		.css 	(
					{
						left: center.left + "px",
						top: center.top + "px"
					}
				)
		.appendTo('.gameArea')
		.animate 	(
						{
							left: (center.left + target.left) + "px",
							top: (center.top + target.top) + "px"
						},
						{
							duration: 1500,
							easing: 'linear',
							progress: 	function (animation, progression, timeLeft)
										{
											checkImpact({htmlElement: $(animation.elem), orientation: orientation});
										},
							complete: 	function ()
										{
											$('.gameArea').find(this).remove();
											delete this;
										}						
						}
					);
}

function checkImpact(bullet)
{
	let audio;
	let touchedSpiders = 	inGameSpiders
								.filter (
											function (e)
											{
												let bulletCoords = bullet.htmlElement.offset();
												let spiderCoords = e.htmlElement.offset();
												if (bullet.orientation.horizontal == 1 && bullet.orientation.vertical == 1)
												{
													if (bulletCoords.left + bullet.htmlElement.width() >= spiderCoords.left && bulletCoords.left <= spiderCoords.left + (e.htmlElement.width() * e.PV) && bulletCoords.top + bullet.htmlElement.height() >= spiderCoords.top && bulletCoords.top <= spiderCoords.top + (e.htmlElement.height() * e.PV))
													{
														return true;
													}
												}
												if (bullet.orientation.horizontal == -1 && bullet.orientation.vertical == 1)
												{
													if (bulletCoords.left >= spiderCoords.left && bulletCoords.left + bullet.htmlElement.width() <= spiderCoords.left + (e.htmlElement.width() * e.PV) && bulletCoords.top + bullet.htmlElement.height() >= spiderCoords.top && bulletCoords.top <= spiderCoords.top + (e.htmlElement.height() * e.PV))
													{
														return true;
													}
												}
												if (bullet.orientation.horizontal == 1 && bullet.orientation.vertical == -1)
												{
													if (bulletCoords.left + bullet.htmlElement.width() >= spiderCoords.left && bulletCoords.left <= spiderCoords.left + (e.htmlElement.width() * e.PV) && bulletCoords.top <= spiderCoords.top + (e.htmlElement.height() * e.PV) && bulletCoords.top + bullet.htmlElement.height() >= spiderCoords.top)
													{
														return true;
													}
												}
												if (bullet.orientation.horizontal == -1 && bullet.orientation.vertical == -1)
												{
													if (bulletCoords.left <= spiderCoords.left + (e.htmlElement.width() * e.PV) && bulletCoords.left + bullet.htmlElement.width() >= spiderCoords.left && bulletCoords.top <= spiderCoords.top + (e.htmlElement.height() * e.PV) && bulletCoords.top + bullet.htmlElement.height() >= spiderCoords.top)
													{
														return true;
													}
												}
												return false;
											}
								);
	if (touchedSpiders.length > 0)
	{
		touchedSpiders
			.forEach(
				 		function (e)
				   		{
				   			let position = e.htmlElement.offset();
				   			let size = {width: e.htmlElement.width() * e.PV, height: e.htmlElement.height() * e.PV};
							let decalage = $('.gameArea').offset();
				   			let no = guid();
				   			e.life--;
				   			if (!tirPerforant)
				   			{
								bullet.htmlElement.remove();
							}
							playTouchSound();
				   			if (e.life <= 0 || tirPerforant)
				   			{
								hits++;
								playHitSound();
								inGameSpiders.splice(inGameSpiders.indexOf(e), 1); 
								e.htmlElement.remove();
								checkForExtra({left: (position.left - decalage.left) + (size.width / 2), top: (position.top - decalage.top) + (size.height / 2 )});
								$('.gameArea')
									.append('<img class="explosion" src="images/smoke1.png" data-id="' + no + '">');
								$('.explosion[data-id="' + no + '"]')
									.css	(
												{
													left: (position.left - decalage.left) + (size.width / 2) + 'px',
													top: (position.top - decalage.top) + (size.height / 2 ) + 'px',
													transform: 'scale(' + e.PV + ')'
												}
											);
								$('.explosion[data-id="' + no + '"]')
									.animate 	(
													{
														opacity: .5
													},
													{
														duration: 600,
														easing: 'linear',
														progress: function (animation, progression, timeLeft)
														{
															let index = +$(this).attr('src').substr(-5, 1);
															if ((timeLeft < 500 && index == 1) || (timeLeft < 400 && index == 2) || (timeLeft < 300 && index == 3) || (timeLeft < 200 && index == 4))
															{
																$(this).attr('src', 'images/smoke' + (index + 1) + '.png');
															}
														},
														complete: function ()
														{
															$('.gameArea').find(this).remove();
															delete this;
														}
													}
												);
							}
							let points = (50 + parseInt(Math.random() * 50)) * (difficultyLevel > 3 ? 2 : 1);
							addToScore(points, {left: (position.left - decalage.left) + (size.width / 2), top: (position.top - decalage.top) + (size.height / 2 ), duration: 1000 + (position.top * 4)});
							if (tirFragment)
							{
								let nb = parseInt(1 + (Math.random() * 3));
								let orientation;
								for (let t = 0; t < nb; t++)
								{
									target = polarToCartesian(800, (Math.random() * 360) * Math.PI / 180);
									orientation = {horizontal: (position.left + target.left) > position.left ? 1 : -1, vertical: (position.top + target.top) > position.top ? 1 : -1};
									createBullet({left: (position.left - decalage.left) + (size.width / 2), top: (position.top - decalage.top) + (size.height / 2 )}, target, orientation);
								}
							}
				   		}
				);
 	}
	let touchedExtras = inGameExtras
								.filter (
											function (e)
											{
												let bulletCoords = bullet.htmlElement.offset();
												let extraCoords = e.htmlElement.offset();
												if (bullet.orientation.horizontal == 1 && bullet.orientation.vertical == 1)
												{
													if (bulletCoords.left + bullet.htmlElement.width() >= extraCoords.left && bulletCoords.left <= extraCoords.left + (e.htmlElement.width()) && bulletCoords.top + bullet.htmlElement.height() >= extraCoords.top && bulletCoords.top <= extraCoords.top + (e.htmlElement.height()))
													{
														return true;
													}
												}
												if (bullet.orientation.horizontal == -1 && bullet.orientation.vertical == 1)
												{
													if (bulletCoords.left >= extraCoords.left && bulletCoords.left + bullet.htmlElement.width() <= extraCoords.left + (e.htmlElement.width()) && bulletCoords.top + bullet.htmlElement.height() >= extraCoords.top && bulletCoords.top <= extraCoords.top + (e.htmlElement.height()))
													{
														return true;
													}
												}
												if (bullet.orientation.horizontal == 1 && bullet.orientation.vertical == -1)
												{
													if (bulletCoords.left + bullet.htmlElement.width() >= extraCoords.left && bulletCoords.left <= extraCoords.left + (e.htmlElement.width()) && bulletCoords.top <= extraCoords.top + (e.htmlElement.height()) && bulletCoords.top + bullet.htmlElement.height() >= extraCoords.top)
													{
														return true;
													}
												}
												if (bullet.orientation.horizontal == -1 && bullet.orientation.vertical == -1)
												{
													if (bulletCoords.left <= extraCoords.left + (e.htmlElement.width()) && bulletCoords.left + bullet.htmlElement.width() >= extraCoords.left && bulletCoords.top <= extraCoords.top + (e.htmlElement.height()) && bulletCoords.top + bullet.htmlElement.height() >= extraCoords.top)
													{
														return true;
													}
												}
												return false;
											}
								);
	if (touchedExtras.length > 0)
	{
		touchedExtras
			.forEach(
				 		function (e)
				   		{
				   			let position = e.htmlElement.offset();
				   			let size = {width: e.htmlElement.width(), height: e.htmlElement.height() * e.PV};
							let decalage = $('.gameArea').offset();
							applyExtra(e);
							bullet.htmlElement.remove();
							e.htmlElement.remove();
							inGameExtras.splice(inGameExtras.indexOf(e), 1); 
							let points = (50 + parseInt(Math.random() * 50));
							addToScore(points, {left: (position.left - decalage.left) + (size.width / 2), top: (position.top - decalage.top) + (size.height / 2 ), duration: 1000 + (position.top * 4)});
				   		}
				);
 	}
}
