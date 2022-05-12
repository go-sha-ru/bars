from rest_framework import serializers

from note.models import Note, Category


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ['id', 'name']


class NoteSerializer(serializers.ModelSerializer):
    category_name = serializers.StringRelatedField(read_only=True, source='category')

    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'created_at', 'is_favorite', 'uuid', 'category', 'category_name', 'user']
