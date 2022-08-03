from rest_framework import serializers

from .models import Question, Answer, Stack


class QuestionSerializer(serializers.ModelSerializer):
    
    class Meta:
        model  = Question
        fields = '__all__'


class AnswerSerializer(serializers.ModelSerializer):
    question = QuestionSerializer(required=False)
    
    class Meta:
        model  = Answer
        fields = '__all__'


class StackSerializer(serializers.ModelSerializer):
    
    class Meta:
        model  = Stack
        fields = '__all__'