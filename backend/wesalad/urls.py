from django.urls          import path, include, re_path
from django.views.generic import TemplateView

urlpatterns = [
    path('api/characteristics', include('apps.characteristics.urls')),
    path('api/users', include('apps.users.urls')),
    path('api/posts', include('apps.posts.urls')),
    re_path('.*', TemplateView.as_view(template_name='index.html')),
]
