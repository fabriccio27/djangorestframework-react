from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    """ Un serializer me permite serializar o deserializar una instancia de un modelo en este caso en algo que puedo comunicar,
    como un json
    En Meta le paso el modelo a partir del cual trabajo, y que campos quiero que terminen en el objeto a comunicar """
    class Meta:
        model = Task
        fields = "__all__"