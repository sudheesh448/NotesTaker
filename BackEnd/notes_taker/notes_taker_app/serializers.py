# myapp/serializers.py

from rest_framework import serializers
from .models import NotesModel

class NotesModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotesModel
        fields = ['id', 'title', 'body', 'date']
