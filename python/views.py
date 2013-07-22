from django.shortcuts import render
from cloud_ide.fiddle.jsonresponse import JsonResponse
from django.http import HttpResponseForbidden

try:
    from pyvascript.grammar import Grammar, Translator
    from pymeta.runtime import ParseError

    def compile(request):
        if not request.method == 'POST' or not 'code' in request.POST:
            return HttpResponseForbidden()

        code = request.POST['code']

        if not code:
            return HttpResponseForbidden()

        response_dict = {}
        success = False
        try:
            g = Grammar.parse(code)
        except ParseError, error:
            response_dict.update({'error': error.message})
        else:
            success = True
            response_dict.update({'code': Translator.parse(g)})
        response_dict.update({'success': success})
        return JsonResponse(response_dict)
except ImportError:
    def compile(request):
        return JsonResponse({'error': 'pyvascript not found'})

def documentation(request):
    return render(request, 'documentation/python.html')