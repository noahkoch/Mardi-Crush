var defaultTime = 35;

var initTimer = function() {
  setInterval(function(){
    if(document.game.timer == 0 && document.game.active) {
      document.game.active = false;
      $('.emoji').each(function(i){
        var emoji = this;
        if( i * 25 > 250) {
          var wait = i * 25;
        } else {
          var wait = 250;
        }
        setTimeout(
          function() { $(emoji).remove(); },
          wait
        )
      })

      setTimeout(endLevel, 350);
    } else if (document.game.active) {
      document.game.timer = document.game.timer - 1;
      $('.time').html(document.game.timer);
    }

    $('.time').html(document.game.timer);
  }, 1000);
}

var initListeners = function() {
  $('.level-prompt').on('click', '.start-game', startNextLevel);
  $('.level-prompt').on('click', '.next-level', startNextLevel);
  $('.level-prompt').on('click', '.play-again', startNextLevel);
  $('.emoji-overlay').on('click', '.emoji', emojiClick);
}

var loadEmojis = function(i) {
  var emojis = document.game.emojis[document.game.level - 1];

  if(i == null) {
    i = 36;
  }

  Array(i).fill().forEach((item, i) => {
    $('.emoji-overlay').prepend('<span class="emoji">' + emojis[Math.floor(Math.random() * emojis.length)] + '</span>');
  })

  $('.emoji').each(function(index){
    $(this).removeAttr('id');
    $(this).attr('id', index);
  })
}

var endLevel = function() {
  $('.level-prompt > div').hide();
  $('.level-prompt .final-score').html(document.game.score);

  if(document.game.level == maxLevels()) {
    $('.level-prompt #end-game').show();
  } else {
    $('.level-prompt #next-level').show();
  }

  $('.level-prompt').css('top', '100px');
}

var setHighScore = function(score) {
  if(document.game.highScore < score) {
    document.game.highScore = score;
    $('#high-score').html(score);
  }
}

var startNextLevel = function() {
  if($(this).hasClass('next-level')) {
    document.game.level = document.game.level + 1;
  } else if ( $(this).hasClass('play-again') ) {
    setHighScore(document.game.score);
    document.game.score = 0;
    document.game.level = 1;
  }

  $('.level-prompt').css('top', '-400px');
  $('.level').html(document.game.level);

  setTimeout(function() {
    $('.emoji').remove();
    loadEmojis();

    setTimeout(function(){
      document.game.timer  = defaultTime;
      document.game.active = true;
    }, 500)
  }, 500)
}

var update_score = function(clicked) {
  increment_amount = (clicked * 10) + ((clicked - 2) * 5)
  if(clicked >= 5) {
    increment_amount = 75 + ((clicked - 4) ** document.game.level); 
  }

  if(clicked >= 7) {
    bonusMusic();
  }

  document.game.score = document.game.score + increment_amount;

  $('.score').html(document.game.score);
}

var bonusMusic = function() {
  var clips = [
    'wily-minx.m4a',
    'wily-minx.m4a',
    'wily-minx.m4a',
    'mango-mania.m4a',
    'mango-mania.m4a',
    'mango-mania.m4a',
    'mango-mania.m4a',
    'lend-me-some-sugar.m4a',
    'lend-me-some-sugar.m4a',
    'immune.m4a',
    'bagel.m4a'
  ]
  
  if(document.game.playBonusMusic) {
    document.game.playBonusMusic = false;
    setTimeout(
      function(){
        document.game.playBonusMusic = true;
      },
      5000
    )

    myAudio = new Audio(clips[Math.floor(Math.random() * clips.length)]); 
    myAudio.volume = 0.5;
    myAudio.play();
  }
}

var maxLevels = function() {
  return document.game.emojis.length;
}

var canLookLeft = function(index) {
  return index % 6 !== 0;
}

var canLookRight = function(index) {
  return ![5, 11, 17, 23, 29, 35].includes(index);
}

var canLookUp = function(index) {
  return index > 5;
}

var canLookDown = function(index) {
  // Needs to account 
  return index < 31;
}

var emojiClick = function(e) {
  if (!document.game.active) { return; }

  var clicked_emoji = $(this).html();
  $(this).addClass('selected');
  highlight_emoji(this, clicked_emoji)
  if($('.selected').length > 1) {
    var selected_count = $('.selected').length;
    update_score(selected_count)
    $('.selected').fadeOut("fast", function() {
      var selected_count = $('.selected').length;
      $('.selected').remove();
      loadEmojis(selected_count);
    }); 
  } else {
    $('.selected').removeClass('selected')
  }
}

var highlight_emoji = function(element, clicked_emoji, originator_index) {
  var this_index    = parseInt($(element).attr('id'));

  if(canLookLeft(this_index)) {
    var sibling_left = $("#" + (this_index - 1).toString());
    if($(sibling_left).html() == clicked_emoji && !$(sibling_left).hasClass('selected')) {
      $(sibling_left).addClass('selected');
      highlight_emoji(sibling_left, clicked_emoji, this_index);
    }
  }

  if(canLookRight(this_index)) {
    var sibling_right = $("#" + (this_index + 1).toString());
    if($(sibling_right).html() == clicked_emoji && !$(sibling_right).hasClass('selected')) {
      $(sibling_right).addClass('selected');
      highlight_emoji(sibling_right, clicked_emoji, this_index);
    }
  }

  // Elements above are 6 behind
  // Elements below are 6 ahead
  if(canLookUp(this_index)) {
    var sibling_up = $("#" + (this_index - 6).toString());
    if($(sibling_up).html() == clicked_emoji && !$(sibling_up).hasClass('selected')) {
      $(sibling_up).addClass('selected');
      highlight_emoji(sibling_up, clicked_emoji, this_index);
    }
  }

  if(canLookDown(this_index)) {
    var sibling_down = $("#" + (this_index + 6).toString());
    if($(sibling_down).html() == clicked_emoji && !$(sibling_down).hasClass('selected')) {
      $(sibling_down).addClass('selected');
      highlight_emoji(sibling_down, clicked_emoji, this_index);
    }
  }
}

var startMusic = function() {
  myAudio = new Audio('mardi-crush.mp3'); 
  myAudio.volume = 0.15;
  if (typeof myAudio.loop == 'boolean')
  {
    myAudio.loop = true;
  }
  else
  {
    myAudio.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
    }, false);
  }
  myAudio.play();
}

var initGameBoard = function() {
  document.game = {
    "highScore": 0,
    "score": 0,
    "level": 1,
    "active": false,
    "timer": defaultTime,
    "playBonusMusic": true,
    "emojis": [
      ['🦞', '⚽️', '🧠', '🏖'],
      ['💫', '🧪', '🍝', '😷'],
      ['🌹', '⏲', '😂', '✅'],
      ['🐶', '🎙', '🤘', '✈️']
    ]
  }

  initTimer();
}

startMusic();
initGameBoard();
initListeners();
