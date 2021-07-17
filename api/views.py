from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import TaskSerializer

from .models import Task
# Create your views here.


""" JsonResponse lo que hace es que el browser interprete lo que mando como un objeto JSON """
@api_view(["GET"])
def apiOverview(request):
    api_urls = {
        "List":"/task-list/",
        "Detail View":"/task-detail/<str:pk>/",
        "Create":"/task-create/",
        "Update":"/task-update/<str:pk>/",
        "Delete":"/task-delete/<str:pk>/"
    }
    # REST framework also introduces a Response object, which is a type of TemplateResponse that takes unrendered content 
    # and uses content negotiation to determine the correct content type to return to the client.

    return Response(api_urls)

@api_view(["GET"])
def taskList(request):
    tasks = Task.objects.order_by('-id')
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

    # el serializer lo que hace es tomar la abstraccion de models y llevarlo a algo 
    # que se puede intercambiar facilmente, como un json. Tambien aplica validacion a la request.data en base a model

@api_view(["GET"])
def taskDetail(request, pk):
    tasks = Task.objects.get(id=pk)
    """ aca podria haber usado get_object_or_404 """
    serializer = TaskSerializer(tasks, many=False)
    return Response(serializer.data)

@api_view(["POST"])
def taskCreate(request):
    # al usar el decorator de api_view para post, me genera una vista con un form para que le ponga content
    # request.data es un json, es un feature de usar este framework 
    # restframework me da un nuevo objeto request, que simplifica el uso al acceso del dict de info de request
    # antes tenia que ver si la request era de POST y hacer request.POST
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(["POST"])
def taskUpdate(request, pk):
    
    #al pasarle el kwarg instance al serializer, le estoy diciendo que no cree un nuevo objeto, 
    # si no que con lo que vino de data, sobreescriba task/instance
    task = Task.objects.get(id=pk)
    serializer = TaskSerializer(instance=task, data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(["DELETE"])
def taskDelete(request, pk):
    task = Task.objects.get(id=pk)
    task.delete()
    return Response(f"Item {pk} was successfully deleted!")