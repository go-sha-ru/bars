from django.db import models

from account.models import User


class Category(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название категории')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Категория заметок'
        verbose_name_plural = 'Категории заметок'


class Note(models.Model):
    user = models.ForeignKey(User, verbose_name='Зам', on_delete=models.CASCADE)
    title = models.CharField(max_length=255, verbose_name='Заголовок')
    content = models.TextField(verbose_name='Содержимое заметки')
    created_at = models.DateTimeField(verbose_name='Дата создания', null=True, blank=True)
    updated_at = models.DateTimeField(verbose_name='Дата изменения', null=True, blank=True)
    category = models.ForeignKey(Category, verbose_name='Категория заметок', on_delete=models.CASCADE)
    is_favorite = models.BooleanField(verbose_name='Избранное', default=False)
    uuid = models.UUIDField(verbose_name='Уникальный ID', blank=True, null=True)

    def __str__(self):
        return "Категория {}. {}".format(self.category, self.title)

    class Meta:
        verbose_name = 'Заметка пользователя'
        verbose_name_plural = 'Заметки пользователей'
