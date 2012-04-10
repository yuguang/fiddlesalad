var url = /(\w+):\/\/([\w.]+(?:\:8000)?)\/(\S*)\/(\S*)\//;
var result = document.URL.match(url);
if (result != null) {
    switch (result[4]) { //page
    case 'faq':
        $(function () {
            $('.faqs dd').hide(); // Hide all DDs inside .faqs
            $('.faqs dt').hover(function () {
                $(this).addClass('hover')
            }, function () {
                $(this).removeClass('hover')
            }).click(function () { // Add class "hover" on dt when hover
                $(this).next().slideToggle('normal'); // Toggle dd when the respective dt is clicked
            });
        });
        break;
    }
}