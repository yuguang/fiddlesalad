// knockout-jquery-ui-widget.js
// Copyright (c) 2011, Planapple, Inc.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)
//
// Knockout binding for jQuery UI widgets
//
// Examples:
//   <input type="submit" value="OK" data-bind='jqueryui: "button"' />
//
//   Attaches a jQuery UI button widget to this button, with default options.
//
//   <input id='search' 
//     data-bind='jqueryui: { widget: "autocomplete", 
//                            options: { source: searchCompletions(),
//                                       delay: 500 } },
//                value: searchString' />
//
//   Attaches an autocomplete behavior to this search input box,
//   binding in the contents of your viewModel.searchCompletions
//   as the autocomplete possibilities and setting the autocomplete
//   delay to 1/2 second. As viewModel.searchCompletions changes,
//   the completions (autocomplete 'source') will automatically update.
//
//   Also attaches the value of the <input> field to your
//   viewModel.searchString, using Knockout's built-in 'value' binding.
//
//   Note: the sequence }} confuses jQuery.template unless it's the end
//   of an actual template tag, so be sure to put a space between }'s
//   as shown above at the end of the options declaration.

(function($) {

    ko.bindingHandlers['jqueryui'] = {
        update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            var widgetBindings = _getWidgetBindings(element, valueAccessor, allBindingsAccessor, viewModel);
        
            // Attach the jQuery UI Widget and/or update its options.
            // (The syntax is the same for both.)
            $(element)[widgetBindings.widgetName](widgetBindings.widgetOptions);
        }
    };
    
    function _getWidgetBindings(element, valueAccessor, allBindingsAccessor, viewModel) {
        // Extract widgetName and widgetOptions from the data binding,
        // with some sanity checking and error reporting.
        // Returns dict: widgetName, widgetOptions.
        
        var value = valueAccessor(),
            myBinding = ko.utils.unwrapObservable(value),
            allBindings = allBindingsAccessor();
        
        if (typeof(myBinding) === 'string') {
            // Short-form data-bind='jqueryui: "widget_name"'
            // with no additional options
            myBinding = {'widget': myBinding};
        }
        
        var widgetName = myBinding.widget,
            widgetOptions = myBinding.options; // ok if undefined
        
        // Sanity check: can't directly check that it's truly a _widget_, but
        // can at least verify that it's a defined function on jQuery:
        if (typeof $.fn[widgetName] !== 'function') 
        {
            throw new Error("jqueryui binding doesn't recognize '" + widgetName 
                + "' as jQuery UI widget");
        }
        
        // Sanity check: don't confuse KO's 'options' binding with jqueryui binding's 'options' property
        if (allBindings.options && !widgetOptions && element.tagName !== 'SELECT') {
            throw new Error("jqueryui binding options should be specified like this:\n"
                + "  data-bind='jqueryui: {widget:\"" + widgetName + "\", options:{...} }'");
        }
        
        return {
            widgetName: widgetName,
            widgetOptions: widgetOptions
        };
    }

})(jQuery);