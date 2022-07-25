from django.urls          import path, include, re_path
from django.views.generic import TemplateView

urlpatterns = [
    path('users', include('users.urls')),
    path('posts', include('posts.urls')),
    re_path('.*', TemplateView.as_view(template_name='index.html')),
]
