from rest_framework import generics

from .models      import Answer, Stack
from .serializers import AnswerSerializer, StackSerializer


class AnswerListView(generics.ListAPIView):
    queryset         = Answer.objects.all()
    serializer_class = AnswerSerializer


class StackListView(generics.ListAPIView):
    queryset         = Stack.objects.all()
    serializer_class = StackSerializer
