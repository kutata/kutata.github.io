function LittleEditor(el, fn) {
  return LittleEditor.prototype.init(el, fn)
}

LittleEditor.prototype = {
  wrapper: '',
  editor: '',
  linebar: '',
  currentLine: 0,
  currentMaxLine: 0,
  maxLine: 0,
  highLine: 0,

  init: function(id, callback) {
    this.wrapper = document.getElementById(id);
    this.wrapper.className = 'little-editor-wrapper';
    this.linebar = document.createElement('div');
    this.linebar.className = 'little-editor-linebar no-select'

    this.editor = document.createElement('textarea');
    this.editor.className = 'little-editor'

    this.wrapper.appendChild(this.linebar);
    this.wrapper.appendChild(this.editor);

    // events binding
    this.keyup();
    this.keydown();
    this.scroll();
    this.click();
    this.blur();
  
    // init
    callback(this);

    var eventName = 'keyup';
    if ('createEvent' in document) {
      var event = document.createEvent('HTMLEvents');
      event.initEvent(eventName, false, true);
      this.editor.dispatchEvent(event);
    }
    else {
      this.editor.fireEvent('on' + eventName[0].toUpperCase() + eventName.slice(1));
    }
    this.editor.focus();
  },

  keyup: function() {
    var self = this;
    this.editor.addEventListener('keyup', function(event) {
      var key = event.keyCode || event.which;
    
      if (key != 91) {
        self.fillLine();
        self.getMaxLine();
        self.getCurrentLine();
        self.highlight();
        self.trigger('scroll'); // make linebar at the right position after textarea change
      }
    });
  },

  keydown: function() {
    var self = this;
    this.editor.addEventListener('keydown', function(event) {
      var key = event.keyCode || event.which;
      // tab
      if (key == 9) {
        var s = this.selectionStart;
        this.value = this.value.substring(0,this.selectionStart) + "\t" + this.value.substring(this.selectionEnd);
        this.selectionEnd = s+1;
        event.preventDefault();
      }
    
      // paste
      if (event.metaKey && key == 86) {
        setTimeout(function() {
          self.currentLine = self.getMaxLine();
          self.fillLine();
          self.highlight();
          self.trigger('scroll'); // make linebar at the right position after paste
        }, 5);
      }
    });
  },

  click: function() {
    var self = this;
    this.editor.addEventListener('click', function(event) {
      self.fillLine();
      self.getMaxLine();
      line = self.getCurrentLine();
      self.highlight();
    });
  },

  scroll: function() {
    var self = this;
    this.editor.addEventListener('scroll', function(event) {
      var top = event.target.scrollTop;
      top = top >= 0 ? top : 0;
      self.linebar.scrollTop = top;
      event.preventDefault();
    });
  },

  blur: function() {
    var self = this;
    this.editor.addEventListener('blur', function() {
      self.currentLine = 0;
      self.highlight();
    });
  },

  trigger: function(event) {
    var eventName = event;
    if ('createEvent' in document) {
      var event = document.createEvent('HTMLEvents');
      event.initEvent(eventName, false, true);
      this.editor.dispatchEvent(event);
    }
    else {
      this.editor.fireEvent('on' + eventName[0].toUpperCase() + eventName.slice(1));
    }
  },

  getCurrentLine: function() {
  	var line = this.editor.value.substr(0, this.editor.selectionStart).split("\n").length,
        lines = [];
  
    var str = this.editor.value;
    var direction = this.editor.selectionDirection;
  
    if (direction == 'none') {
      // this.currentLine = line;
      var start = str.substr(this.editor.selectionStart, this.editor.selectionEnd);
      var end = str.substr(this.editor.selectionEnd, str.length)
      lines = [line, maxLine - end.split('\n').length + 1];
      this.currentLine = lines
    }
    else if (direction == 'backward' || direction == 'forward') {
      var start = str.substr(this.editor.selectionStart, this.editor.selectionEnd);
      var end = str.substr(this.editor.selectionEnd, str.length)
      lines = [line, maxLine - end.split('\n').length + 1];
      this.currentLine = lines
    }

    return this.currentLine;
  },
  
  getMaxLine: function() {
  	var str = this.editor.value;
  	maxLine = str.substr(0, str.length).split('\n').length;
  
  	return maxLine;
  },
  
  fillLine: function() {
  	var maxLine = this.getMaxLine();
  
    if (maxLine > this.currentMaxLine) {
  		this.moreLine(this.currentMaxLine+1, maxLine);
      this.currentMaxLine = maxLine;
  	}
  	else if (maxLine < this.currentMaxLine) {
      this.lessLine(maxLine - this.currentMaxLine);
      this.currentMaxLine = maxLine
  	}
  },
  
  moreLine: function(A, B) {
  	var html = '';
  	for (var i = A; i <= B; i++) {
  		html += '<span>' + i + '</span>\n';
  	}
  	this.linebar.innerHTML += html;
  },
  
  lessLine: function(lines) {
    var html = this.linebar.innerHTML.trim();
    arr = html.split('\n')
    arr.splice(lines);
    html = arr.join('\n') + '\n';
  
  	this.linebar.innerHTML = html;
  },
  
  highlight: function() {
    var spans = this.linebar.querySelectorAll('span');
  
    if (this.currentLine != this.highLine) {
   
      var min = 0; max = 0;
  
      if (typeof(this.highLine) == 'number') {
        min = this.highLine-1; max = min + 1;
      }
      else {
        min = this.highLine[0]-1; max = this.highLine[1];
      }
  
      for (var l = min; l < max; l++) {
        if (spans[l]) {
          spans[l].classList.remove('current-line');
        }
      }

      if (typeof(this.currentLine) == 'number') {
        min = this.currentLine-1; max = min + 1;
      }
      else {
        min = this.currentLine[0]-1; max = this.currentLine[1];
      }
  
      for (var l = min; l < max; l++) {
        if (spans[l]) {
          spans[l].classList.add('current-line');
        }
      }
  
      this.highLine = this.currentLine
    }
  }
}
