let soundVolume = 100;

let sndShoot;
let sndHit;
let sndWalk;
let sndHeroHit;
let sndNewWave;
let sndFall;
let sndBonus;
let sndMalus;
let sndTouch;
let sndGameOver;

function initSounds()
{
    sndShoot = document.getElementById("sndShoot");
    sndHit = document.getElementById("sndHit");
    sndTouch = document.getElementById("sndTouch");
    sndWalk = document.getElementById("sndWalk");
    sndHeroHit = document.getElementById("sndHeroHit");
    sndNewWave = document.getElementById("sndNewWave");
    sndFall = document.getElementById("sndFall");
    sndBonus = document.getElementById("sndBonus");
    sndMalus = document.getElementById("sndMalus");
    sndGameOver = document.getElementById("sndGameOver");
    setSoundsVolume(soundVolume);
}

function playTouchSound()
{
    sndTouch.currentTime = 0;
    sndTouch.play();
}

function playShootSound()
{
    sndShoot.currentTime = 0;
    sndShoot.play();
}

function playHitSound()
{
    sndHit.currentTime = 0;
    sndHit.play();
}

function playWalkSound()
{
    window['sndWalk'].currentTime = 0;
    window['sndWalk'].play();
}

function playHeroHitSound()
{
    window['sndHeroHit'].currentTime = 0;
    window['sndHeroHit'].play();
}

function playNewWaveSound()
{
    window['sndNewWave'].currentTime = 0;
    window['sndNewWave'].play();
}

function playFallSound()
{
    window['sndFall'].currentTime = 0;
    window['sndFall'].play();
}

function playBonusSound()
{
    window['sndBonus'].currentTime = 0;
    window['sndBonus'].play();
}

function playMalusSound()
{
    window['sndMalus'].currentTime = 0;
    window['sndMalus'].play();
}

function playGameOverSound()
{
    window['sndGameOver'].currentTime = 0;
    window['sndGameOver'].play();
}

function setSoundsVolume()
{
    sndShoot.volume = parseFloat(soundVolume / 100);
    sndHit.volume = parseFloat(soundVolume / 100);
    sndWalk.volume = parseFloat(soundVolume / 100);
    sndHeroHit.volume = parseFloat(soundVolume / 100);
    sndNewWave.volume = parseFloat(soundVolume / 100);
    sndFall.volume = parseFloat(soundVolume / 100);
    sndBonus.volume = parseFloat(soundVolume / 100);
    sndTouch.volume = parseFloat(soundVolume / 100);
    sndMalus.volume = parseFloat(soundVolume / 100);
    sndGameOver.volume = parseFloat(soundVolume / 100);
}

function changeVolume(e)
{
    if ($(e.currentTarget).hasClass('plus'))
    {
        soundVolume = Math.min(100, soundVolume + 10);
    }
    if ($(e.currentTarget).hasClass('minus'))
    {
        soundVolume = Math.max(0, soundVolume - 10);
    }
    setSoundsVolume();
    playBonusSound();
    $('.soundLevelValue').css('width', soundVolume + '%');
}
