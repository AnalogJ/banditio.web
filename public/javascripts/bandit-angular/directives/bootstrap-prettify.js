'use strict';
/*
var directive = {};
var service = { value: {} };

var DEPENDENCIES = {
    'angular.js': 'http://code.angularjs.org/' + angular.version.full + '/angular.min.js',
    'angular-resource.js': 'http://code.angularjs.org/' + angular.version.full + '/angular-resource.min.js',
    'angular-route.js': 'http://code.angularjs.org/' + angular.version.full + '/angular-route.min.js',
    'angular-animate.js': 'http://code.angularjs.org/' + angular.version.full + '/angular-animate.min.js',
    'angular-sanitize.js': 'http://code.angularjs.org/' + angular.version.full + '/angular-sanitize.min.js',
    'angular-cookies.js': 'http://code.angularjs.org/' + angular.version.full + '/angular-cookies.min.js'
};


function escape(text) {
    return text.
        replace(/\&/g, '&amp;').
        replace(/\</g, '&lt;').
        replace(/\>/g, '&gt;').
        replace(/"/g, '&quot;');
}

function setHtmlIe8SafeWay(element, html) {
    var newElement = angular.element('<pre>' + html + '</pre>');

    element.html('');
    element.append(newElement.contents());
    return element;
}


directive.prettyprint = ['reindentCode', function(reindentCode) {
    return {
        restrict: 'C',
        compile: function(element) {
            var html = element.html();
            //ensure that angular won't compile {{ curly }} values
            html = html.replace(/\{\{/g, '<span>{{</span>')
                .replace(/\}\}/g, '<span>}}</span>');
            if (window.RUNNING_IN_NG_TEST_RUNNER) {
                element.html(html);
            }
            else {
                element.html(window.prettyPrintOne(reindentCode(html), undefined, true));
            }
        }
    };
}];




directive.ngSetHtml = ['getEmbeddedTemplate', function(getEmbeddedTemplate) {
    return {
        restrict: 'CA',
        priority: 10,
        compile: function(element, attr) {
            setHtmlIe8SafeWay(element, getEmbeddedTemplate(attr.ngSetHtml));
        }
    }
}];


service.getEmbeddedTemplate = ['reindentCode', function(reindentCode) {
    return function (id) {
        var element = document.getElementById(id);

        if (!element) {
            return null;
        }

        return reindentCode(angular.element(element).html(), 0);
    }
}];


angular.module('bootstrapPrettify', []).directive(directive).factory(service);
  */


///////////////////////////////////////////////////////////////////////////////////////////////
/*
 * Copy paste from https://github.com/angular/angular.js/blob/master/src/bootstrap/bootstrap-prettify.js
 * */

function setHtmlIe8SafeWay(element, html) {
    //var newElement = angular.element('<pre>' + html + '</pre>');

    element.html(html);
    //element.append(newElement.contents());
    return element;
}
function escape(text) {
    return text.
        replace(/\&/g, '&amp;').
        replace(/\</g, '&lt;').
        replace(/\>/g, '&gt;').
        replace(/"/g, '&quot;');
}
 angular.module('prettifyDirective', [])
    .factory('reindentCode', function () {
        return function (text, spaces) {
            if (!text) return text;
            var lines = text.split(/\r?\n/);
            var prefix = '      '.substr(0, spaces || 0);
            var i;

            // remove any leading blank lines
            while (lines.length && lines[0].match(/^\s*$/)) lines.shift();
            // remove any trailing blank lines
            while (lines.length && lines[lines.length - 1].match(/^\s*$/)) lines.pop();
            var minIndent = 999;
            for (i = 0; i < lines.length; i++) {
                var line = lines[0];
                var reindentCode = line.match(/^\s*/)[0];
                if (reindentCode !== line && reindentCode.length < minIndent) {
                    minIndent = reindentCode.length;
                }
            }

            for (i = 0; i < lines.length; i++) {
                lines[i] = prefix + lines[i].substring(minIndent);
            }
            lines.push('');
            return lines.join('\n');
        }
    })
    .directive('prettyprint', ['reindentCode', function(reindentCode) {

        return {
            restrict: 'C',
            //priority: 10,

            //template: '<html>{{resource.response_body}}</html>',
            link: function(scope, element, attrs) {

                scope.$watch(attrs.ngSetHtml, function (newval, oldval) {
                    if (newval) {
                        console.log('watcher resource',newval);


                        var prettified = window.prettyPrintOne(
                            escape(newval.slice(1)),
                            undefined, true)
                        console.log('step2 response', prettified)
                        setHtmlIe8SafeWay(element, prettified)
                    }
                });
                console.log('this is inside the link function',scope.resource);
                //console.log(element.html(scope.resource.response_body))

                //console.log(element.html('THIS IS THE NEW HTML'))
                //element.html(prettified);
            }/*
            compile: function(element, attr) {
                //setHtmlIe8SafeWay(element, ' <html>THis is my inner content.</html>'+ attr.ngSetHtml);

                //console.log('inside comile function')
                //element.html('THIS IS HTE NEW HTML.')
                //element.html(window.prettyPrintOne(
                //    reindentCode(attr.ngSetHtml),
                //
                //
                //   undefined, true));
                console.log('attr inside compile', attr.ngSetHtml)
                return {

                    post: function postLink(scope, iElement, iAttrs, iController) {
                        console.log(iAttrs.ngSetHtml)


                        console.log('this is inside the link function',scope.resource);
                        console.log('this is inside the link function headers',scope.resource.request_header);
                        iElement.html('THIS IS THE POST LINKING FUNCTION.')
                    }
                }

            }  */
        }
    }])
    /*.directive('prettyprint', ['reindentCode', function (reindentCode) {
        return {
            restrict: 'C',
            terminal: true,
            compile: function (element) {
                console.log('inside prettyprint compile function.')
                element.html(window.prettyPrintOne(
                    reindentCode(element.html()),
                    undefined, true));
            }
        };
    }])*/
;