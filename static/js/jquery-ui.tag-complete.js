Snippets = window.Snippets || {};


(function(S, $) {

  var TagCompletion = function(options) {
    this.options = options || {};
    this.default_url = '/tag_hint/';
  };

  TagCompletion.prototype.bind_listener = function(input_sel) {
    var self = this;

    this.input_element = $(input_sel);

    this.input_element.autocomplete({
      minLength: self.options.min_length || 1,
      source: function(request, response) {self.fetch_results(request, response);}
    });

    var disable_browser_complete = _.once(function(){
      self.input_element.attr('autocomplete', 'off');
    });

    this.input_element.click(disable_browser_complete);
  };


  TagCompletion.prototype.fetch_results = function(request, response) {
    var url = this.options.url || this.default_url,
        term = request.term,
        last_piece = get_last_piece(term);

    if (!last_piece)
      response([]);

    var pieces = clean_and_split(term),
        all_but_last = '';
    pieces.pop();

    // if there are already some tags present, then grab everything up to the
    // current phrase and add a comma
    if (pieces.length > 0)
      all_but_last = pieces.join(', ') + ', ';

    $.getJSON(url, {'q': last_piece}, function(data) {
      var results = [];
      $.each(data, function(k, v) {
        v.label = v.tag + ' (' + v.count + ')';
        v.value = all_but_last + v.tag + ', ';
        results.push(v);
      });
      response(results);
    });
  };

  /* helper functions for splitting the string */
  function clean_and_split(text, delimiter) {
    var cleaned = [],
        pieces = text.split(delimiter || ',');

    for (var i = 0; i < pieces.length; i++) {
      if (pieces[i].match(/\w+/)) {
        cleaned.push(pieces[i].replace(/^\s+|\s+$/, ''));
      }
    }
    return cleaned;
  }

  function get_last_piece(text) {
    var cleaned = clean_and_split(text, ',');
    if (cleaned.length > 0) {
      var last = cleaned[cleaned.length - 1];
      if (last.match(/\w+/))
        return last;
    }
  }
  S.TagCompletion = TagCompletion;

})(Snippets, jQuery);

