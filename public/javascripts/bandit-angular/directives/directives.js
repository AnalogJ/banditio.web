angular.module('banditApp.directives', [])
    .directive('myFrame', function() {
        return function(scope, iElement, iAttrs, controller) {
                console.log('ele founds. ')
                iElement.bind('load', function(evt) {
                    scope.$apply(iAttrs.myFrame);
                });
        };
    })