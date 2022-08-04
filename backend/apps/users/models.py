from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

from apps.utils.timestamp        import TimestampZone
from apps.characteristics.models import Stack, Answer
from .managers              import UserManager


class GoogleSocialAccount(TimestampZone): 
    sub       = models.CharField(max_length=400)
    image_url = models.CharField(max_length=300, null=True, blank=True)
    email     = models.EmailField(max_length=255, unique=True)

    class Meta:
        db_table = 'google_social_accounts'

    
class User(AbstractBaseUser, PermissionsMixin, TimestampZone): 
    name           = models.CharField(max_length=100)
    ordinal_number = models.IntegerField()
    password       = None
    google_account = models.ForeignKey(GoogleSocialAccount, on_delete=models.CASCADE, related_name='users')
    
    is_active    = models.BooleanField(default=True) #유저의 삭제보단 이 필드를 활성화
    is_admin     = models.BooleanField(default=False)
    is_superuser = None
    
    objects = UserManager()
    
    USERNAME_FIELD  = 'id'
    REQUIRED_FIELDS = ['name', 'ordinal_number']
    
    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'users'


class UserAnswer(TimestampZone):
    user   = models.ForeignKey(User, on_delete=models.CASCADE, related_name='useranswers')
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE, related_name='useranswers')
    
    class Meta:
        db_table = 'useranswers'


class UserStack(TimestampZone):
    user  = models.ForeignKey(User, on_delete=models.CASCADE, related_name='userstacks')
    stack = models.ForeignKey(Stack, on_delete=models.CASCADE, related_name='userstacks')
    
    class Meta: 
        db_table = 'userstacks'