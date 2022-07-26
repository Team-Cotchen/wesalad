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

from .models                import GoogleSocialAccount
from .serializers           import UserSerializer, UserCreateSerializer
from utils.decorators       import check_token
from utils.utils            import error_message

User = get_user_model()

class GoogleLoginAPI(APIView):
    def get(self, request):
        app_key = settings.GOOGLE_OAUTH2_CLIENT_ID
        scope   = "https://www.googleapis.com/auth/userinfo.email " + \
                  "https://www.googleapis.com/auth/userinfo.profile"
        
        redirect_uri    = settings.GOOGLE_OAUTH2_REDIRECT_URI
        google_auth_api = 'https://accounts.google.com/o/oauth2/auth'
        
        response = redirect(f'{google_auth_api}?client_id={app_key}&response_type=code&redirect_uri={redirect_uri}&scope={scope}')
        return response


class GoogleSignInAPI(APIView):
    def get(self, request):
        auth_code        = request.GET.get('code')
        google_token_api = "https://oauth2.googleapis.com/token"
        
        user_data = self.google_get_user_info(google_token_api, auth_code)
        
        google_account = self.get_or_create(user_data)
        user_filter = User.objects.filter(google_account=google_account)

        if not user_filter.exists()\
            or not True in [user.is_active for user in user_filter]:
            return Response({'google_account_id' : google_account.id, 'image_url' : google_account.image_url}, status=status.HTTP_200_OK)
        
        user  = User.objects.get(google_account=google_account, is_active=True)
        token = self.generate_jwt(user)
        
        token['user_id']   = user.id
        token['user_name'] = user.name
                
        return Response(token, status=status.HTTP_200_OK)

    def google_get_user_info(self, google_token_api, auth_code):
        client_id     = settings.GOOGLE_OAUTH2_CLIENT_ID
        client_secret = settings.GOOGLE_OAUTH2_CLIENT_SECRET
        redirect_uri  = settings.GOOGLE_OAUTH2_REDIRECT_URI
        code          = auth_code
        grant_type    = 'authorization_code'
        state         = 'random_string'
        
        google_token_api += \
            f'?client_id={client_id}&client_secret={client_secret}&code={code}&grant_type={grant_type}&redirect_uri={redirect_uri}&state={state}'
        
        google_access_token = requests.post(google_token_api, timeout=2).json()['access_token']
        
        user_info_response = requests.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            params = {
                'access_token': google_access_token
            }
        )
        
        user_info = user_info_response.json()
        return user_info

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
        
            if serializer.is_valid():
                serializer.save(
                    google_account_id = google_account_id,
                    answers           = answers,
                    stacks            = stacks
                )
                
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
    def put(self, request):
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


# class SignUpAPI(generics.CreateAPIView):
#         queryset          = User.objects.all()
#         lookup_url_kwargs = 'google_account_id'
#         
#         def create(self, request, *args, **kwargs):
#             try:
#                 serializer = UserCreateSerializer(data = request.data)
#                 serializer.is_valid(raise_exception=True)
#                 token = self.perform_create(serializer)
#                 
#                 return Response(token, status=status.HTTP_201_CREATED)
#             except ValueError:
#                 return Response({'ERROR' : 'THIS_ACCOUNT_ALREADY_EXIST'}, status=status.HTTP_400_BAD_REQUEST)
#         
#         def perform_create(self, serializer):
#             google_account = GoogleSocialAccount.objects.get(id=self.kwargs.get('google_account_id'))
#             
#             if not User.objects.filter(google_account = google_account).exists():
#                 serializer.save(google_account = google_account)
#                 
#                 user  = User.objects.get(google_account=google_account)
#                 token = GoogleSignInAPI.generate_jwt(self, user)
#                 return token
#             raise ValueError    

# class SignUpAPI(APIView):
#     def get(self, request):
#         questions = Question.objects.prefetch_related('answers').all()
#         result = {
#             'characteristics' : [{
#                 f'question_{question.id}': question.content,
#                 'answers' : [answer.content for answer in Answer.objects.filter(question=question)]
#                 } for question in questions],
#             
#                 'stacks' : [{'title' : stack.title, 'image' : stack.image_url} for stack in Stack.objects.all()]
#             }
#         
#         return JsonResponse({'result': result}, status=200)
    
#     def post(self, request):
#         try: 
#             data              = request.POST
#             google_account_id = request.GET.get('google_account_id')
#             google_account    = GoogleSocialAccount.objects.get(id=google_account_id)
#             
#             answers = data['answers'].split(',')
#             stacks  = data['stacks'].split(',')
#             
#             with transaction.atomic():
#                 user = User.objects.create(
#                     name           = data['name'],
#                     ordinal_number = data['ordinal_number'],
#                     google_account = google_account
#                 )
#                 
                # for answer_id in answers:
                #     UserAnswer.objects.create(
                #         user = user,
                #         answer = Answer.objects.get(id=answer_id)
                #     )
                # 
                # for stack_id in stacks:
                #     UserStack.objects.create(
                #         user = user,
                #         stack = Stack.objects.get(id=stack_id)
                #     )
# # 
#             return HttpResponse(status = 201)
#         except IntegrityError:
#             return JsonResponse({'message' : 'THIS_ACCOUNT_ALREADY_EXIST'}, status=400)
#         except ValueError:
#             return JsonResponse({'message' : 'VALUE_ERROR'}, status=400)
