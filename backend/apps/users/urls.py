from django.urls import path

from .views import GoogleLoginAPI, GoogleSignInAPI, SignUpAPI, ProfileAPI

urlpatterns = [
    path('/google', GoogleLoginAPI.as_view()),
    path('/google/login', GoogleSignInAPI.as_view()),
    path('/signup/<int:google_account_id>', SignUpAPI.as_view()),
    path('/profile', ProfileAPI.as_view()),
]
