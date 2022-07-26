from dataclasses import field, fields
from pyexpat import model
from rest_framework import serializers

from .models import Question, Answer, Stack

class QuestionSerializer(serializers.ModelSerializer):
    
    class Meta:
        model  = Question
        fields = ['content']

class AnswerSerializer(serializers.ModelSerializer):
    question = QuestionSerializer(required=False)
    
    class Meta:
        model  = Answer
        fields = ['content', 'description', 'image_url', 'question']

class StackSerializer(serializers.ModelSerializer):
    
    class Meta:
        model  = Stack
        fields = ['title', 'description', 'image_url']