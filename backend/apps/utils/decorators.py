import jwt

#Django
from django.conf            import settings
from django.contrib.auth    import get_user_model
from django.core.exceptions import ObjectDoesNotExist

#DRF
from rest_framework          import status
from rest_framework.response import Response

#simpleJwt
from rest_framework_simplejwt.exceptions  import TokenError
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

from .utils import error_message

User = get_user_model()

def check_token(func):
    def wrapper(self, request, *args, **kwargs):
        try:
            access_token = request.headers.get('access', None)
            payload      = jwt.decode(access_token, settings.SECRET_KEY, settings.ALGORITHM)
            request.user = User.objects.get(id=payload['sub'])
            
            if not request.user.is_active:
                raise User.DoesNotExist('This account has been withdrawn.')
                
        except jwt.exceptions.ExpiredSignatureError:
            try:
                serializer = TokenRefreshSerializer(data={'refresh': request.headers.get('refresh', None)})
                
                if serializer.is_valid(raise_exception=True): 
                    access_token  = serializer.validated_data['access']
                    refresh_token = request.headers.get('refresh', None)
                
                    return Response({
                        'access' : access_token,
                        'refresh': refresh_token
                    }, status=status.HTTP_200_OK)
                
            except TokenError: 
                return Response({'ERROR': error_message('Your login has expired')}, status=status.HTTP_400_BAD_REQUEST)
            except jwt.exceptions.InvalidTokenError: 
                return Response({'ERROR': error_message('Your login has expired')}, status=status.HTTP_401_UNAUTHORIZED)
        
        except ObjectDoesNotExist as e:
            return Response({'ERROR' : error_message(f'{e}')}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.exceptions.DecodeError:
            return Response({'ERROR': error_message('decode error')}, status=status.HTTP_400_BAD_REQUEST)
        
        return func(self, request, *args, **kwargs)
    return wrapper