from django.urls import path

from .views import PostDetailView, PostListView

urlpatterns = [
    path('', PostListView.as_view()),
    path('/<int:pk>', PostDetailView.as_view())
]