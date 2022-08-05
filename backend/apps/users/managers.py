from django.contrib.auth.models import BaseUserManager


class UserManager(BaseUserManager):
    # 일반 user 생성
    def create_user(self, email, name, password=None):
        if not email:
            raise ValueError('must have user email')
        if not name:
            raise ValueError('must have user name')
        user = self.model(
            email    = self.normalize_email(email),
            name     = name,
            password = password
        )
        
        user.save(using=self._db)
        return user

    # 관리자 user 생성
    def create_superuser(self, email, name, password=None):
        user = self.create_user(
            email    = self.normalize_email(email),
            name     = name,
            password = password
        )
        user.is_admin = True
        user.save(using=self._db)
        return user