from django.urls import path

from .views import AnswerListView, StackListView

urlpatterns = [
    path('/answer', AnswerListView.as_view()),
    path('/stack', StackListView.as_view())
]