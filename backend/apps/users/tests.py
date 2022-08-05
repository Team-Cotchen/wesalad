from unittest.mock import patch

#Django
from django.test         import Client
from django.contrib.auth import get_user_model

#DRF
from rest_framework.test             import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.models                import GoogleSocialAccount, UserAnswer, UserStack
from apps.characteristics.models      import Question, Stack, Answer
from apps.users.views                 import GoogleSignInAPI

User = get_user_model()

client = Client()

test_user_data = {
    'sub'           : 'test_sub1234',
    'name'          : 'test_name',
    'given_name'    : 'test_given_name',
    'family_name'   : 'test_family_name',
    'picture'       : 'test_picture',
    'email'         : 'test123@email.com',
    'email_verified': True,
    'locale'        : 'ko'
    }

#WeSalad 회원일 경우
class GoogleLoginTest(APITestCase):
    def setUp(self):
        self.google_account = GoogleSocialAccount.objects.create(
            sub       = test_user_data.get('sub'),
            image_url = test_user_data.get('picture'),
            email     = test_user_data.get('email'),
        )
        
        self.user = User.objects.create(
            name           = 'test_name',
            ordinal_number =  31,
            google_account = self.google_account
        )
    
        self.test_url =  'http://localhost:8080/api/users/google/login'
        
    def tearDown(self):
        self.user.delete()
        self.google_account.delete()
    
    @patch.object(GoogleSignInAPI, 'google_get_user_info')
    def test_google_social_signin(self, mocked_google_user_info):
        
        mocked_google_user_info.return_value = test_user_data
        
        response = self.client.get(self.test_url)
        print(response.content)
        
        self.assertEqual(response.status_code, 200)


# GoogleSocialAccount 까진 생성, 하지만 WeSalad User가 아닐 경우
class GoogleLoginTestNotUser(APITestCase):
    def setUp(self):    
        self.google_account = GoogleSocialAccount.objects.create(
            sub       = test_user_data.get('sub'),
            image_url = test_user_data.get('picture'),
            email     = test_user_data.get('email'),
        )

        self.test_url = 'http://localhost:8080/api/users/google/login'
        
    def tearDown(self):
        self.google_account.delete()
    
    @patch.object(GoogleSignInAPI, 'google_get_user_info')
    def test_google_social_signin(self, mocked_google_user_info):
        
        mocked_google_user_info.return_value = test_user_data
        
        response = self.client.get(self.test_url)
        print(response.content)
        
        self.assertEqual(response.status_code, 200)


# 처음 구글로그인을 시도하는 경우
class GoogleLoginTestNotGoogleSocialAccount(APITestCase):
    def setUp(self):
        self.test_url = 'http://localhost:8080/api/users/google/login'
    
    @patch.object(GoogleSignInAPI, 'google_get_user_info')
    def test_google_social_signin(self, mocked_google_user_info):
        
        mocked_google_user_info.return_value = test_user_data
        
        response = self.client.get(self.test_url)
        print(response.content)
        
        self.assertEqual(response.status_code, 200)


class WesaladSignUpTest(APITestCase):
    def setUp(self):
        self.google_account = GoogleSocialAccount.objects.create(
            sub       = test_user_data.get('sub'),
            image_url = test_user_data.get('picture'),
            email     = test_user_data.get('email'),
        )
 
        for i in range(1, 21):
            Question.objects.bulk_create([
                Question(id = i, content = f'question_test_content_{i}')   
            ])
            
            Answer.objects.bulk_create([
                Answer(id = i, content = f'answer_test_content_{i}', description = f'answer_test_description_{i}', image_url = f'answer_test_image_url_{i}', question_id=i)
            ])
            
            Stack.objects.bulk_create([
                Stack(id = i, title = f'stack_test_title_{i}', image_url = f'stack_test_image_url_{i}', description = f'stack_test_description_{i}')
            ])
            
        self.test_url =  f'http://localhost:8080/api/users/signup/{self.google_account.id}'
        
    def tearDown(self):
        self.google_account.delete()
        Question.objects.all().delete()
        Answer.objects.all().delete()
        Stack.objects.all().delete()
    
    def test_success_wesalad_user_signup(self):
        response = self.client.post(
            f'{self.test_url}', 
            {
                'name'          : 'test_user',
                'ordinal_number': 31,
                'answers'       : 'answer_test_description_1,answer_test_description_2,answer_test_description_3,answer_test_description_4,answer_test_description_20',
                'stacks'        : 'stack_test_title_1,stack_test_title_2'
             },
            format='json')
        print(response.content)
        
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['name'], 'test_user')
        
    def test_fail_wesalad_user_signup(self):
        response = self.client.post(f'{self.test_url}', {'name': 'test_fail_user', 'ordinal_number': 1, 'answers': 'test_none_answer_description', 'stacks': 'test_none_stack_title'}, format='json')
        print(response.content)
        
        self.assertEqual(response.status_code, 400)


class ProfileTest(APITestCase):
    def setUp(self):
        self.google_account = GoogleSocialAccount.objects.create(
            sub       = test_user_data.get('sub'),
            image_url = test_user_data.get('picture'),
            email     = test_user_data.get('email'),
        )
        
        self.user = User.objects.create(
            name           = 'test_name',
            ordinal_number =  31,
            google_account = self.google_account
        )
 
        for i in range(1, 21):
            Question.objects.bulk_create([
                Question(id = i, content = f'question_test_content_{i}')   
            ])
            
            Answer.objects.bulk_create([
                Answer(id = i, content = f'answer_test_content_{i}', description = f'answer_test_description_{i}', image_url = f'answer_test_image_url_{i}', question_id=i)
            ])
            
            Stack.objects.bulk_create([
                Stack(id = i, title = f'stack_test_title_{i}', image_url = f'stack_test_image_url_{i}', description = f'stack_test_description_{i}')
            ])
            
            UserAnswer.objects.bulk_create([
                UserAnswer(id = i, user_id=self.user.id, answer_id=i)
            ])
            
            UserStack.objects.bulk_create([
                UserStack(id=i, user_id=self.user.id, stack_id=i)
            ])
        
        self.access_token = self.generate_jwt(self.user)['access']
        
        self.test_url =  f'http://localhost:8080/api/users/profile'
        
    def generate_jwt(self, user):
        refresh = RefreshToken.for_user(user)
        
        return {
            'refresh': str(refresh),
            'access' : str(refresh.access_token),
        }
        
    def tearDown(self):
        self.google_account.delete()
        Question.objects.all().delete()
        Answer.objects.all().delete()
        Stack.objects.all().delete()
        UserAnswer.objects.all().delete()
        UserStack.objects.all().delete()
    
    # Profile Get
    def test_success_wesalad_user_profile_get(self):
        header   = {'HTTP_access' : self.access_token}
        response = self.client.get(self.test_url, **header)
        print(response.content)
        
        self.assertEqual(response.status_code, 200)
    
    def test_fail_wesalad_user_profile_get_without_token(self):        
        response = self.client.get(self.test_url)
        print(response.content)
        
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.content, b'{"ERROR":"DECODE_ERROR"}')
        
    def test_fail_wesalad_user_profile_get_with_wrong_token(self):
        header   = {'HTTP_access' : 'Wrong Token'}
        response = self.client.get(self.test_url, **header)
        print(response.content)
        
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.content, b'{"ERROR":"DECODE_ERROR"}')
    
    # Profile Update
    def test_success_wesalad_user_profile_update(self):
        header   = {'HTTP_access' : self.access_token}
        response = self.client.put(
            f'{self.test_url}', 
            {
                'name'          : 'test_user_updated',
                'ordinal_number': 19,
                'answers'       : 'answer_test_description_1,answer_test_description_2,answer_test_description_3,answer_test_description_19',
                'stacks'        : 'stack_test_title_3,stack_test_title_4'
             },
            format='json', **header)
        print(response.content)
    
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['name'], 'test_user_updated')
    
    def test_fail_wesalad_user_profile_update_without_token(self):
        response = self.client.put(
            f'{self.test_url}', 
            {
                'name'          : 'test_user_updated',
                'ordinal_number': 19,
                'answers'       : 'answer_test_description_1,answer_test_description_2,answer_test_description_3,answer_test_description_19',
                'stacks'        : 'stack_test_title_3,stack_test_title_4'
             },
            format='json')
        print(response.content)
    
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.content, b'{"ERROR":"DECODE_ERROR"}')
    
    def test_fail_wesalad_user_profile_update_with_wrong_answer_information(self):
        header   = {'HTTP_access' : self.access_token}
        response = self.client.put(
            f'{self.test_url}', 
            {
                'name'          : 'test_user_updated',
                'ordinal_number': 19,
                'answers'       : 'answer_test_description_50',
                'stacks'        : 'stack_test_title_3,stack_test_title_4'
             },
            format='json', **header)
        print(response.content)
    
        self.assertEqual(response.status_code, 400)    
        self.assertEqual(response.content, b'{"ERROR":"ANSWER_MATCHING_QUERY_DOES_NOT_EXIST."}')
    
    def test_fail_wesalad_user_profile_update_with_wrong_stack_information(self):
        header   = {'HTTP_access' : self.access_token}
        response = self.client.put(
            f'{self.test_url}', 
            {
                'name'          : 'test_user_updated',
                'ordinal_number': 19,
                'answers'       : 'answer_test_description_4',
                'stacks'        : 'stack_test_title_50'
             },
            format='json', **header)
        print(response.content)
    
        self.assertEqual(response.status_code, 400)    
        self.assertEqual(response.content, b'{"ERROR":"STACK_MATCHING_QUERY_DOES_NOT_EXIST."}')
    
    def test_fail_wesalad_user_profile_update_with_wrong_type(self):
        header   = {'HTTP_access' : self.access_token}
        response = self.client.put(
            f'{self.test_url}', 
            {
                'name'          : 'test_user_updated',
                'ordinal_number': 'df',
                'answers'       : 'answer_test_description_4',
                'stacks'        : 'stack_test_title_3'
             },
            format='json', **header)
        print(response.json())
    
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'ordinal_number': ['유효한 정수(integer)를 넣어주세요.']})
    
    # Delete User
    def test_success_wesalad_user_profile_delete(self):
        header   = {'HTTP_access' : self.access_token}
        response = self.client.delete(self.test_url, **header)
        print(response.content)
    
        self.assertEqual(response.status_code, 204)
    
    def test_fail_wesalad_user_profile_delete_without_token(self):
        response = self.client.delete(self.test_url)
        print(response.content)
    
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.content, b'{"ERROR":"DECODE_ERROR"}')