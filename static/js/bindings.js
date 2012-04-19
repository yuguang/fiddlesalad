ko.bindingHandlers.inputActive = {
    update: function(element, valueAccessor) {
        var val = valueAccessor();
        if (typeof val === 'function') {
            val = val();
        }
        if (val === $(element).prev('input').val()) {
            $(element).addClass('ui-state-active')
        } else {
            $(element).removeClass('ui-state-active')
        }
    }
};

ko.bindingHandlers.hoverVisible = {
    init: function(element, valueAccessor) {
        var val = valueAccessor();
        $(val, element).toggle(false);
        $(element).hover(
            function() {
                $(val, element).fadeIn();
            }, function() {
                $(val, element).fadeOut();
            });
    }
};

ko.bindingHandlers.hoverInvisible = {
    init: function(element, valueAccessor) {
        var val = valueAccessor();
        $(val, element).toggle(false);
        $(element).hover(
            function() {
                $(val, element).fadeOut();
            }, function() {
                $(val, element).fadeIn();
            });
    }
};

ko.bindingHandlers.fadeInText = {
    update: function(element, valueAccessor) {
        $(element).hide();
        ko.bindingHandlers.text.update(element, valueAccessor);
        $(element).fadeIn('slow');
    }
};

ko.bindingHandlers.fadeText = {
    update: function(element, valueAccessor) {
        ko.bindingHandlers.text.update(element, valueAccessor);
        $(element).fadeIn('slow');
        _.delay(function(){
            $(element).fadeOut('slow');
            var value = valueAccessor();
            value('');
        }, 3000);
    }
};

ko.extenders.url = function(target, overrideMessage) {
    //add some sub-observables to our observable
    target.hasError = ko.observable();
    target.validationMessage = ko.observable();

    //define a function to do validation
    function validate(newValue) {
        var urlPattern = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)*(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
        target.hasError(urlPattern.test(newValue) ? false : true);
        target.validationMessage(overrideMessage || 'Please enter a valid URL with the protocol.');
    }

    //initial validation
    validate(target());
    target.hasError(false);

    //validate whenever the value changes
    target.subscribe(validate);

    //return the original observable
    return target;
};