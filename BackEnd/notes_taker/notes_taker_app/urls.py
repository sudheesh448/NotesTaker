from django import views
from django.urls import path

from .views import *

urlpatterns = [
    path('v1/notes/', NoteListCreateAPIView.as_view(), name='note-list-create'),
    path('v1/notes/<int:pk>/', NoteRetrieveUpdateDestroyAPIView.as_view(), name='note-retrieve-update-destroy'),
    path('v1/notes/delete-multiple/', NoteDeleteMultipleAPIView.as_view(), name='note-delete-multiple'),
    path('v1/search-notes/', SearchNotesAPIView.as_view(), name='search-notes'),
]