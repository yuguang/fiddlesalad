ZeroClipboard.setMoviePath( base_url + '/flash/ZeroClipboard.swf' );

var clip = new ZeroClipboard.Client();
clip.setText('');
clip.setHandCursor(true);

clip.addEventListener('mouseDown', function(client){
    clip.setText(viewModel.snippetUrl());
});

clip.glue('copyButton');

function selectAllText(textbox) {
    textbox.focus();
    textbox.select();
}

$('#shareMenu input').each(function(){
    $(this).click(function () {
        selectAllText($(this));
    });
});