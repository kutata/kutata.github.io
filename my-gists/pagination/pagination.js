function pagination(p, pc) {
  $('#pagination').empty();
  var range = [];
  var min, max;

  min = p - 5;
  if (min < 0) {
    min = 0;
    max = p + 5 + Math.abs(p - 5);
  }
  else {
    max = p + 5;
    if (max > pc) max = pc;
    min = max - 10;
    if (min < 0) min = 0
  }

  if (max > pc) max = pc;

  for (var i = min; i < max; i++) {
    if (i == p)
      range.push({value: i, text: i+1, class: 'active'});
    else
      range.push({value: i, text: i+1});
  }

  var prev = [{
    value: p > 0 ? p-1 : false,
    text: 'Prev',
    class: p > 0 ? 'fl' : 'fl disabled'
  }]
  var first = [{
    value: 0,
    text: 'First',
    class: p > 0 ? 'fl' : 'fl disabled'
  }]
  var last = [{
    value: pc-1,
    text: 'Last (' + pc + ')',
    class: p != pc-1 ? 'fr' : 'fr disabled'
    }];
    var next = [{
      value: p < pc - 1 ? p+1 : false,
      text: 'Next',
      class: p < pc-1 ? 'fr' : 'fr disabled'
  }];
  range = first.concat(prev).concat(range).concat(next).concat(last);

  var pages = range;

  pages.map(function(page) {
    var a = $('<a>').html(page.text)
    if (page.value !== false) {
      a.data('value', page.value);
      a.click(function() {
        pagination($(this).data('value'), 20);
      });
    }
    var li = $('<li>').addClass(page.class);
    a.appendTo(li);
    li.appendTo($('#pagination'));
  })
}
pagination(0, 20);
