(function(){
$(function(){
  var question = function(){
    var match_list = $('#match_list li'),
        not_match_list = $('#not_match_list li'),
        ok = function(elm){
          $(elm).addClass('ok');
          $(elm).removeClass('ng');
        },
        ng = function(elm){
          $(elm).removeClass('ok');
          $(elm).addClass('ng');
        };
    return {
      clear: function(){
          match_list.each(function(){ ng(this) });
          not_match_list.each(function(){ ng(this) });
      },
      test: function(input){
        var ok_match_words = [],
            ok_not_match_words = [];
        this.clear();
        $.ajax({
          scriptCharset: 'utf-8',
          type: "POST",
          url: location.href+'/answer',
          data: {
            'answer' : input,
          },
          success: function(json) {
            console.log(json);
            if (json.success) {
              ok_match_words = json.ok_match;
              ok_not_match_words = json.ok_not_match;
            }
            match_list.each(function(){
              if(ok_match_words.indexOf($(this).html()) !== -1) ok(this);
            });
            not_match_list.each(function(){
              if(ok_not_match_words.indexOf($(this).html()) !== -1) ok(this);
            });
          },
          error: function(request, status, e) {
            alert("Internal Serve Error.");
          },
          dataType: 'json'
        });
      },
      isAllOk: function(){
        var result = true;
        match_list.each(function(){
          if($(this).attr('class').split(' ').indexOf('ok') === -1){
            result = false;
          }
        });
        return result;
      }
    };
  }();

  var timer = function(output, interval){
    var running = false,
        beginTime = null,
        runningTime = 0,
        countup = function() {
          if (!running) return;
          runningTime = runningTime + interval;
          var h = String(Math.floor(runningTime / 3600000) + 100).substring(1);
          var m = String(Math.floor((runningTime - h * 3600000)/60000) + 100).substring(1);
          var s = String(Math.floor((runningTime - h * 3600000 - m * 60000)/1000) + 100).substring(1);
          var ms = String((runningTime - h * 3600000 - m * 60000 - s * 1000) + 1000).substring(1,3);
          output.html(h+':'+m+':'+s+':'+ms);
        };
    setInterval(countup, interval);
    return {
      start: function(){ running = true },
      stop: function(){ running = false },
      reset: function(){
        this.stop();
        beginTime = null;
      }
    };
  }($('#timer'), 10);

  $(window).keypress(function(ev){
    if((ev.which && ev.which === 13) || (ev.keyCode && ev.keyCode === 13)) {
      $('#reg_submit').click();
      return false;
    }
  });

  $('#reg_submit').click(function(){
    timer.stop();
    question.test($('#reg_input').val());
    if (question.isAllOk()) {
      alert('ALL OK!!');
    } else {
      timer.start();
    }
  });

  question.clear();
  $('#reg_input').focus();
  timer.start();
});
}());

