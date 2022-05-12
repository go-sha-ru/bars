from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    patronymic_name = models.CharField(verbose_name='Отчество', max_length=255, blank=True, default='')

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
