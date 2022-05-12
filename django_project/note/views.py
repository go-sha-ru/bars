import uuid

import django_filters
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils import timezone
from django.views.generic import DetailView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import permissions, pagination, status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from note.models import Note, Category
from note.serializers import NoteSerializer, CategorySerializer


class NoteDetailView(DetailView):
    template_name = "note/detail.html"
    model = Note
    slug_field = 'uuid'
    slug_url_kwarg = 'uuid'


class NoteFilter(django_filters.FilterSet):
    created_at = django_filters.DateFromToRangeFilter()

    class Meta:
        model = Note
        fields = {
            'title': ['contains', ],
            'category': ['exact', ],
            'is_favorite': ['exact', ],
        }


class NotesViewSet(ModelViewSet):
    queryset = Note.objects.all().order_by('created_at')
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = pagination.PageNumberPagination
    filter_class = NoteFilter
    filter_backends = [OrderingFilter, DjangoFilterBackend]
    ordering_fields = ['created_at', 'category', 'is_favorite']

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        request.data['user'] = self.request.user.pk
        request.data['created_at'] = timezone.now()
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        request.data['updated_at'] = timezone.now()
        return super().create(request, *args, **kwargs)

    @action(['put'], detail=True)
    def toggle_uuid(self, request, pk=None):
        note = self.get_object()
        if not note.uuid:
            note.uuid = uuid.uuid4()
        else:
            note.uuid = None
        note.save()
        serializer = self.get_serializer(note)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)

    @action(['put'], detail=True)
    def toggle_favorite(self, request, pk=None):
        note = self.get_object()
        note.is_favorite = not note.is_favorite
        note.save()
        serializer = self.get_serializer(note)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)


class CategoryViewSet(ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
