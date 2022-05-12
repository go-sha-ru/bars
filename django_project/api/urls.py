from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

urlpatterns = [
    url(r'^rest-auth/', include('rest_auth.urls')),
    url('', include('account.urls')),
    url('', include('note.urls')),
]

urlpatterns += router.urls
