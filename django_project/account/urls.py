from django.urls import path
from rest_framework.routers import DefaultRouter

from account.views import UserViewSet

router = DefaultRouter()

router.register('account', UserViewSet)

urlpatterns = router.urls
