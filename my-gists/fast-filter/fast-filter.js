var FastFilter = function(table, format, options) {
  return FastFilter.prototype.init(table, format, options || {});
}

FastFilter.prototype = {
  data: [],
  limit: 20,
  prevSearch: '',
  display: [],
  filtered: [],

  getRegx: function(text) {
    try {
      return new RegExp(text, 'i');
    }
    catch (ex) {
      return false;
    }
  },

  escapeRegx: function(text) {
    var esc = new RegExp( '(\\' + [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-' ].join('|\\') + ')', 'g' );
    return text.replace( esc, '\\$1' );
  },

  filter: function(search) {
    var regx = this.getRegx(this.escapeRegx(search)),
        prevSearch = this.prevSearch;

    if (search == prevSearch) {
      return ;
    }

    if (!regx) {
      this.filtered = display.slice();
      return ;
    }

    var prevRegx = this.getRegx('^' + this.escapeRegx(prevSearch));
    
    var _display = [];
    if (search.length < prevSearch.lengeh || !(prevRegx.test(search)) ) {
      this.filtered = this.display.slice()
    }
    for (var i = 0; i < this.filtered.length; i++) {
      if (regx.test(this.data[ this.filtered[i] ]._filterRow.toLowerCase()))
        _display.push(this.filtered[i]);
    }

    this.filtered = _display;
    this.render();
    this.prevSearch = search;
  },

  render: function() {
    var limit = this.limit > this.filtered.length ? this.filtered.length : this.limit;

    table.innerHTML = '';

    for (var i = 0; i < limit; i++) {
      var row = document.createElement('div')
      row.className = 'row';

      for (var j = 0; j < format.length; j++) {
        var key = format[j].column;
        var span = document.createElement('span');
        span.innerHTML = this.data[this.filtered[i]]._data[key];
        row.append(span);
      }
      table.append(row);
    }
  },

  init: function(table, format, options) {
    for (var k in options) {
      if (this.hasOwnProperty(k))
        this[k] = options[k];
    }

    for (var i = 0; i < json.length; i++) {
      var _filterRow = '',
          _data = {};

      for (var k in json[i]) {
        _filterRow += json[i][k] + ' ';
        _data[k] = json[i][k];
      }
    
      this.data.push({
        row: i,
        _filterRow: _filterRow,
        _data: _data,
      });
    
      this.display.push(i);
    }

    this.filtered = this.display;
    this.render();

    return this;
  }

}

// init
var format = [
  {column: 'id'},
  {column: 'first_name'},
  {column: 'last_name'},
  {column: 'email'},
  {column: 'gender'},
  {column: 'ip_address'}
];
var fast = FastFilter('table', format);

document.getElementById('count').innerHTML = json.length;
var search = document.getElementById('search');
search.addEventListener('keydown', function(e) {
  setTimeout(function() {
    fast.filter(e.target.value)
  }, 0);
});

search.focus();
