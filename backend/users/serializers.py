#DRF
from rest_framework                  import serializers
from rest_framework_simplejwt.tokens import RefreshToken

# Django
from django.db           import transaction
from django.contrib.auth import get_user_model

from characteristics.models      import Answer, Stack
from characteristics.serializers import StackSerializer
from .models                     import UserAnswer, UserStack, GoogleSocialAccount

User = get_user_model()

class UserAnswerSerializer(serializers.ModelSerializer):
    answer = serializers.SerializerMethodField()
    
    def get_answer(self, useranswer):
        data = {
            'content' : useranswer.answer.content,
            'description' : useranswer.answer.description,
        }
        return data
    
    class Meta:
        model = UserAnswer
        fields = ['answer']

class UserStackSerializer(serializers.ModelSerializer):
    stack = StackSerializer(required=False)
    
    class Meta:
        model = UserStack
        fields = ['stack']
        
class GoogleSocialAccountSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = GoogleSocialAccount
        fields = ['sub', 'email', 'image_url']

class UserCreateSerializer(serializers.ModelSerializer): 
    google_account = GoogleSocialAccountSerializer(required=False)
    user_answers   = UserAnswerSerializer(source='useranswers',many=True, required=False)
    user_stacks    = UserStackSerializer(source='userstacks',many=True, required=False)
    token          = serializers.SerializerMethodField()
    
    def get_token(self, user):
        refresh = RefreshToken.for_user(user)
        
        return {
            'refresh': str(refresh),
            'access' : str(refresh.access_token),
        }
        
    @transaction.atomic()
    def create(self, validated_data):
        google_account = GoogleSocialAccount.objects.get(id=validated_data.pop('google_account_id'))
        answers        = validated_data.pop('answers').split(',')
        
        if not validated_data.get('stacks'):
            stacks = None
        else:   
            stacks = validated_data.pop('stacks').split(',')
        
        user_filter = User.objects.filter(google_account=google_account)

        if not user_filter.exists()\
            or not True in [user.is_active for user in user_filter]:     
            user = User.objects.create(
                name           = validated_data['name'],
                ordinal_number = validated_data['ordinal_number'],
                google_account = google_account,                
            )
            
            [user.useranswers.create(answer = Answer.objects.get(id=answer_id)) for answer_id in answers]
            
            if stacks:
                [user.userstacks.create(stack = Stack.objects.get(title=stack)) for stack in stacks]
            
            return user
        
        raise ValueError
    
    class Meta:
        model  = User
        fields = '__all__'
        
class UserSerializer(serializers.ModelSerializer):
    google_account = GoogleSocialAccountSerializer(required=False)
    user_answers   = UserAnswerSerializer(source='useranswers',many=True, required=False)
    user_stacks    = UserStackSerializer(source='userstacks',many=True, required=False)
    
    @transaction.atomic()
    def update(self, user, validated_data):
        if not validated_data.get('stacks'):
            stacks = None
        else:   
            stacks = validated_data.pop('stacks').split(',')

        answers = validated_data.pop('answers').split(',')
        
        user.name = validated_data['name']
        user.ordinal_number = validated_data['ordinal_number']
        user.save()
        
        user.useranswers.all().delete()
        user.userstacks.all().delete()
        
        [user.useranswers.create(answer = Answer.objects.get(id=answer_id)) for answer_id in answers]
        
        if stacks:
            [user.userstacks.create(stack = Stack.objects.get(title=stack)) for stack in stacks]
            
        return user
    
    class Meta:
        model  = User
        fields = ['name', 'ordinal_number', 'google_account', 'user_answers', 'user_stacks']