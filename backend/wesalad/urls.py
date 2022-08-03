from django.urls          import path, include, re_path
from django.views.generic import TemplateView

#DRF
from rest_framework import permissions

#Swagger
from drf_yasg.views import get_schema_view
from drf_yasg       import openapi

schema_view = get_schema_view(
    openapi.Info(
        title='Wesalad!',
        default_version='0.1.1',
        description='Wesalad API Documentation',
        contact=openapi.Contact(email='lob3767@gmail.com'),        
    ),
    permission_classes=(permissions.AllowAny,),
    validators=['flex'],
    public=True,
)

urlpatterns = [
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name="schema-json"),
    re_path(r'^swagger$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('api/users', include('apps.users.urls')),
    path('api/posts', include('apps.posts.urls')),
    re_path('.*', TemplateView.as_view(template_name='index.html')),
]
