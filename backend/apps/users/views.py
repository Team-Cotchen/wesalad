import requests

# DRF
from rest_framework.response         import Response
from rest_framework                  import status
from rest_framework.views            import APIView
from rest_framework_simplejwt.tokens import RefreshToken

# Django
from django.shortcuts       import redirect
from django.conf            import settings
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth    import get_user_model

from apps.utils.decorators  import check_token
from apps.utils.utils       import error_message, WesaladEmail
from .models                import GoogleSocialAccount
from .serializers           import UserSerializer, UserCreateSerializer
from apps.posts.serializers import PostSerializer
from apps.posts.models      import Post

User = get_user_model()

class GoogleLoginAPI(APIView):
    def get(self, request):
        app_key = settings.GOOGLE_OAUTH2_CLIENT_ID
        scope   = "https://www.googleapis.com/auth/userinfo.email " + \
                  "https://www.googleapis.com/auth/userinfo.profile"

        redirect_uri    = settings.GOOGLE_OAUTH2_REDIRECT_URI
        google_auth_api = 'https://accounts.google.com/o/oauth2/v2/auth'
        
        response = redirect(f'{google_auth_api}?client_id={app_key}&response_type=code&redirect_uri={redirect_uri}&scope={scope}')
        return response


class GoogleSignInAPI(APIView):
    def get(self, request):
        auth_code        = request.GET.get('code')
        google_token_api = "https://oauth2.googleapis.com/token"
        
        user_data = self.google_get_user_info(google_token_api, auth_code)
        
        google_account = self.get_or_create(user_data)
        user_filter    = User.objects.filter(google_account=google_account)

        if not user_filter.exists()\
            or not True in [user.is_active for user in user_filter]:
            return Response({'google_account_id' : google_account.id, 'image_url' : google_account.image_url}, status=status.HTTP_200_OK)
        
        user  = User.objects.get(google_account=google_account, is_active=True)
        token = self.generate_jwt(user)
        
        token['user_id']   = user.id
        token['user_name'] = user.name
                
        return Response({'token' : token, 'image_url' : google_account.image_url}, status=status.HTTP_200_OK)

    def google_get_user_info(self, google_token_api, auth_code):
        client_id     = settings.GOOGLE_OAUTH2_CLIENT_ID
        client_secret = settings.GOOGLE_OAUTH2_CLIENT_SECRET
        redirect_uri  = settings.GOOGLE_OAUTH2_REDIRECT_URI
        code          = auth_code
        grant_type    = 'authorization_code'
        state         = 'random_string'

        google_token_api += \
            f'?client_id={client_id}&client_secret={client_secret}&code={code}&grant_type={grant_type}&redirect_uri={redirect_uri}&state={state}'

        access_token = requests.post(google_token_api, timeout=3).json()['access_token']

        user_info_response = requests.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            params = {
                'access_token': access_token
            }
        )
        
        return user_info_response.json()

    def get_or_create(self, user_data):
        if not GoogleSocialAccount.objects.filter(email=user_data['email']).exists():
            google_account = GoogleSocialAccount.objects.create(
                sub       = user_data['sub'],
                email     = user_data['email'],
                image_url = user_data['picture']
            )
            return google_account
        return GoogleSocialAccount.objects.get(email=user_data['email'])
                
    def generate_jwt(self, user):
        refresh = RefreshToken.for_user(user)
        
        return {
            'refresh': str(refresh),
            'access' : str(refresh.access_token),
        }


class SignUpAPI(APIView):
    def post(self, request, google_account_id):
        try:    
            serializer = UserCreateSerializer(data=request.data)
            answers    = request.data.get('answers')
            stacks     = request.data.get('stacks')
            user_email = GoogleSocialAccount.objects.get(id=google_account_id).email
        
            if serializer.is_valid():
                serializer.save(
                    google_account_id = google_account_id,
                    answers           = answers,
                    stacks            = stacks
                )
                WesaladEmail(settings.GOOGLE_MAIL_ADDRESS, user_email, settings.GOOGLE_MAIL_APP_PWD).send_email()
                
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except ValueError:
            return Response({'ERROR' : error_message('This account already exists')}, status=status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist as e:
            return Response({'ERROR' : error_message(f'{e}')}, status=status.HTTP_400_BAD_REQUEST)


class ProfileAPI(APIView):
    @check_token
    def get(self, request):
        try:
            user       = request.user
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except ObjectDoesNotExist as e:
                return Response({'ERROR' : error_message(f'{e}')}, status=status.HTTP_400_BAD_REQUEST)

    @check_token
    def patch(self, request):
        try:
            user = request.user
            
            serializer = UserSerializer(user, data=request.data)
            answers    = request.data.get('answers')
            stacks     = request.data.get('stacks')
            
            
            if serializer.is_valid():
                serializer.save(
                    answers = answers,
                    stacks = stacks
                )
                
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
                return Response({'ERROR' : error_message('This account already exists')}, status=status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist as e:
                return Response({'ERROR' : error_message(f'{e}')}, status=status.HTTP_400_BAD_REQUEST)
            
    @check_token
    def delete(self, request):
        user = request.user
        if not user.is_active:
            return Response({'ERROR' : error_message('This account has been withdrawn.')}, status=status.HTTP_400_BAD_REQUEST)
        
        user.userstacks.all().delete()
        user.useranswers.all().delete()

        user.posts.all().delete()    
        user.is_active = False
        user.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

class MyPostsAPI(APIView):
    @check_token
    def get(self, request):
        user       = request.user
        queryset   = Post.objects.filter(user=user)
        serializer = PostSerializer(queryset, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)    