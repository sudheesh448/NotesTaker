

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import NotesModel
from .serializers import NotesModelSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.renderers import JSONRenderer 


class MyModelPagination(PageNumberPagination):
    page_size = 100  # Adjust the page size as needed
    page_size_query_param = 'page_size'
    max_page_size = 1000
class NoteListCreateAPIView(APIView):
    def get(self, request):
        print("here in get",request.data)
        paginator = MyModelPagination()
        notes = NotesModel.objects.all().order_by('-id')
        result_page = paginator.paginate_queryset(notes, request)
        serializer = NotesModelSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)
       

    def post(self, request):
        print("here")
        serializer = NotesModelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class NoteRetrieveUpdateDestroyAPIView(APIView):
    def get_object(self, pk):
        try:
            return NotesModel.objects.get(pk=pk)
        except NotesModel.DoesNotExist:
            return None

    def get(self, request, pk):
        note = self.get_object(pk)
        if note:
            serializer = NotesModelSerializer(note)
            return Response(serializer.data)
        return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        note = self.get_object(pk)
        if note:
            serializer = NotesModelSerializer(note, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        note = self.get_object(pk)
        if note:
            note.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_404_NOT_FOUND)


class NoteDeleteMultipleAPIView(APIView):
    def delete(self, request):
        # Retrieve the list of IDs from the request data
        ids = request.data.get('ids', [])
        
        if not ids:
            return Response({'detail': 'No IDs provided for deletion.'}, status=status.HTTP_400_BAD_REQUEST)

        # Delete multiple entries based on the received IDs
        notes = NotesModel.objects.filter(pk__in=ids)
        notes.delete()

        return Response({'detail': 'Selected notes deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
    

class SearchNotesAPIView(APIView):
    def get(self, request):
        query = request.query_params.get('query', '')
        
        if not query:
            return Response({'results': []})

        # Use Q objects to perform OR queries
        from django.db.models import Q
        notes = NotesModel.objects.filter(Q(title__icontains=query) | Q(body__icontains=query))
        serializer = NotesModelSerializer(notes, many=True)
        
        return Response({'results': serializer.data})