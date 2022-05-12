from django.urls import path
from rest_framework.routers import SimpleRouter

from note.views import NotesViewSet, CategoryViewSet, NoteDetailView

router = SimpleRouter()

router.register('notes', NotesViewSet)
router.register('category', CategoryViewSet)
urlpatterns = [
    path('note/<uuid:uuid>', NoteDetailView.as_view())
]

urlpatterns += router.urls
