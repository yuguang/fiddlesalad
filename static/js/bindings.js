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

//autoComplete -- main binding (should contain additional options to pass to autocomplete)
//optionsSource -- the array of choices
//autocompleteValue -- where to write the selected value
//optionsText -- the property that should be displayed in the possible choices
//inputValue -- the property that should be displayed in the input box
//optionsValue -- the property to use for the value
ko.bindingHandlers.autoComplete = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        var options = valueAccessor() || {},
            allBindings = allBindingsAccessor(),
            unwrap = ko.utils.unwrapObservable,
            modelValue = allBindings.autocompleteValue,
            source = allBindings.optionsSource,
            valueProp = allBindings.optionsValue,
            inputValueProp = allBindings.inputValue || valueProp,
            labelProp = allBindings.optionsText || valueProp;

        //function that is shared by both select and change event handlers
        function writeValueToModel(valueToWrite) {
            if (ko.isWriteableObservable(modelValue)) {
                modelValue(valueToWrite );
            } else {  //write to non-observable
                if (allBindings['_ko_property_writers'] && allBindings['_ko_property_writers']['jqAutoValue'])
                    allBindings['_ko_property_writers']['jqAutoValue'](valueToWrite );
            }
        }

        //on a selection write the proper value to the model
        options.select = function(event, ui) {
            writeValueToModel(ui.item ? ui.item.actualValue : null);
        };

        //on a change, make sure that it is a valid value or clear out the model value
        options.change = function(event, ui) {
            var currentValue = $(element).val();
            var matchingItem =  ko.utils.arrayFirst(unwrap(source), function(item) {
                return unwrap(inputValueProp ? item[inputValueProp] : item) === currentValue;
            });

            if (!matchingItem) {
                writeValueToModel(null);
            }
        }


        //handle the choices being updated in a DO, to decouple value updates from source (options) updates
        var mappedSource = ko.dependentObservable(function() {
            mapped = ko.utils.arrayMap(unwrap(source), function(item) {
                var result = {};
                result.label = labelProp ? unwrap(item[labelProp]) : unwrap(item).toString();  //show in pop-up choices
                result.value = inputValueProp ? unwrap(item[inputValueProp]) : unwrap(item).toString();  //show in input box
                result.actualValue = valueProp ? unwrap(item[valueProp]) : item;  //store in model
                return result;
            });
            return mapped;
        }, null, { disposeWhenNodeIsRemoved: element });

        //whenever the items that make up the source are updated, make sure that autocomplete knows it
        mappedSource.subscribe(function(newValue) {
            $(element).autocomplete("option", "source", newValue);
        });

        options.source = mappedSource();

        //initialize autocomplete
        $(element).autocomplete(options);
    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        //update value based on a model change
        var allBindings = allBindingsAccessor(),
            unwrap = ko.utils.unwrapObservable,
            modelValue = unwrap(allBindings.jqAutoValue) || '',
            valueProp = allBindings.jqAutoSourceValue,
            inputValueProp = allBindings.jqAutoSourceInputValue || valueProp;

        //if we are writing a different property to the input than we are writing to the model, then locate the object
        if (valueProp && inputValueProp !== valueProp) {
            var source = unwrap(allBindings.jqAutoSource) || [];
            var modelValue = ko.utils.arrayFirst(source, function(item) {
                return unwrap(item[valueProp]) === modelValue;
            }) || {};  //probably don't need the || {}, but just protect against a bad value
        }

        //update the element with the value that should be shown in the input
        $(element).val(modelValue && inputValueProp !== valueProp ? unwrap(modelValue[inputValueProp]) : modelValue.toString());
    }
};