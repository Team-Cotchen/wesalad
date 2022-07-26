import json

from rest_framework import serializers

from django.db              import transaction
from django.core.exceptions import ObjectDoesNotExist

from characteristics.models import Answer, Stack
from users.models           import GoogleSocialAccount, User
from utils.utils            import error_message
from .models                import (ApplyWay, Category, Flavor, Place,
                                    Post, PostAnswer, PostApplyWay, PostFlavor,
                                    PostPlace, PostStack)

class CategorySerializer(serializers.ModelSerializer):
    
    class Meta:
        model  = Category
        fields = ['title']

class GoogleSocialAccountSerializer(serializers.ModelSerializer):
    
    class Meta:
        model  = GoogleSocialAccount
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    def get_image_url(self, user):
        return user.google_account.image_url
    
    class Meta:
        model  = User
        fields = ['ordinal_number', 'name', 'image_url']

class AnswerSerializer(serializers.ModelSerializer):
    question = serializers.SerializerMethodField()
    
    def get_question(self, answer):
        return answer.question.content
    
    class Meta:
        model  = Answer
        fields = ['question', 'content', 'description', 'image_url']

class PostAnswerSerializer(serializers.ModelSerializer):
    answer = AnswerSerializer()
    
    class Meta:
        model  = PostAnswer
        fields = ['is_primary', 'answer']

class PostAnswersSerializer(serializers.ModelSerializer):
    is_primary = serializers.SerializerMethodField()
    answer = AnswerSerializer()
    
    def get_is_primary(self, post):
        return post.postanswers
    
    class Meta:
        model  = Post
        fields = ['is_primary', 'answer']

class PostStackSerializer(serializers.ModelSerializer):
    title       = serializers.SerializerMethodField()
    image_url   = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    
    def get_title(self, poststack):
        return poststack.stack.title
    
    def get_image_url(self, poststack):
        return poststack.stack.image_url
    
    def get_description(self, poststack):
        return poststack.stack.description

    class Meta:
        model  = PostStack
        fields = ['title', 'image_url', 'description']

class PostApplyWaySerializer(serializers.ModelSerializer):
    title       = serializers.SerializerMethodField()
    
    def get_title(self, postapplyway):
        return postapplyway.applyway.title
    
    class Meta:
        model  = PostApplyWay
        fields = ['title', 'description']
        
class PostPlaceSerializer(serializers.ModelSerializer):
    place = serializers.SerializerMethodField()
    
    def get_place(self, postplace):
        return postplace.place.title
    
    class Meta:
        model  = PostPlace
        fields = ['place']

class PostFlavorSerializer(serializers.ModelSerializer):
    title       = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    image_url   = serializers.SerializerMethodField()
    
    def get_title(self, postflavor):
        return postflavor.flavor.title
    
    def get_description(self, postflavor):
        return postflavor.flavor.description
    
    def get_image_url(self, postflavor):
        return postflavor.flavor.image_url
    
    class Meta:
        model  = PostFlavor
        fields = ['title', 'description', 'image_url']

class PostSerializer(serializers.ModelSerializer):
    category      = serializers.SerializerMethodField()
    post_answer   = serializers.SerializerMethodField()
    post_stack    = PostStackSerializer(source='poststacks', many=True, required=False)
    post_applyway = PostApplyWaySerializer(source='postapplyways', many=True, required=False)
    post_flavor   = PostFlavorSerializer(source='postflavors', many=True, required=False)
    post_place    = serializers.SerializerMethodField()
    user          = UserSerializer(required=False)
    
    def get_category(self, post):
        return post.category.title
    
    def get_post_answer(self, post):
        primary_answer = []
        secondary_answer = []
        postanswers = post.postanswers.filter(post = post)
        for postanswer in postanswers:
            if postanswer.is_primary:
                primary_answer.append({
                    'description' : postanswer.answer.description,
                    'image_url' : postanswer.answer.image_url
                    })
            else:
                secondary_answer.append({
                    'description' : postanswer.answer.description,
                    'image_url' : postanswer.answer.image_url
                    })

        data = [
            {'primary_answer' : primary_answer},
            {'secondary_answer' : secondary_answer}
        ]
        return data
    
    def get_post_place(self, post):
        postplace = post.postplaces.get(post = post)
        return postplace.place.title
    
    @transaction.atomic()
    def update(self, instance, validated_data):
        try:
            category      = validated_data.pop("category", None)
            answers       = validated_data.pop("answers", None)
            stacks        = validated_data.pop("stacks", None)
            applyway      = validated_data.pop("applyway", None)
            applyway_info = validated_data.pop("applyway_info", None)
            place         = validated_data.pop("place", None)
            flavor        = validated_data.pop("flavor", None)
            
            category_instance = Category.objects.get(title = category)
            applyway_instance = ApplyWay.objects.get(title = applyway)
            place_instance    = Place.objects.get(title = place)
            flavor_instance   = Flavor.objects.get(title = flavor)
            
            Post.objects.filter(id = instance.id)\
            .update(
                category = category_instance,
                **validated_data
            )
            
            instance = Post.objects.get(id = instance.id)
            
            stacks  = json.loads(stacks)
            answers = json.loads(answers)
            
            instance.postplaces.all().delete()
            instance.postflavors.all().delete()
            instance.postapplyways.all().delete()
            instance.poststacks.all().delete()
            instance.postanswers.all().delete()
            
            instance.postplaces.create(place = place_instance)
            instance.postflavors.create(flavor = flavor_instance)
            instance.postapplyways.create(applyway = applyway_instance, description = applyway_info)
            [instance.poststacks.create(stack = Stack.objects.get(title = stack)) for stack in stacks]
            [instance.postanswers.create(
                answer     = Answer.objects.get(description = answer.get("description")),
                is_primary = answer.get("is_primary")
                ) for answer in answers]
            
            return instance
        except ObjectDoesNotExist as e:
            raise serializers.ValidationError(error_message(f'{e}')) 

    class Meta:
        model  = Post
        fields = '__all__'
    
class PostCreateSerializer(serializers.ModelSerializer):
    category      = serializers.SerializerMethodField()
    post_answer   = serializers.SerializerMethodField()
    post_stack    = PostStackSerializer(source='poststacks', many=True, required=False)
    post_applyway = PostApplyWaySerializer(source='postapplyways', many=True, required=False)
    post_flavor   = PostFlavorSerializer(source='postflavors', many=True, required=False)
    post_place    = serializers.SerializerMethodField()
    user          = UserSerializer(required=False)
    
    def get_category(self, post):
        return post.category.title
    
    def get_post_answer(self, post):
        primary_answer = []
        secondary_answer = []
        postanswers = post.postanswers.filter(post = post)
        for postanswer in postanswers:
            if postanswer.is_primary:
                primary_answer.append({
                    'description' : postanswer.answer.description,
                    'image_url' : postanswer.answer.image_url
                    })
            else:
                secondary_answer.append({
                    'description' : postanswer.answer.description,
                    'image_url' : postanswer.answer.image_url
                    })

        data = [
            {'primary_answer' : primary_answer},
            {'secondary_answer' : secondary_answer}
        ]
        return data
    
    def get_post_place(self, post):
        postplace = post.postplaces.get(post = post)
        return postplace.place.title

    @transaction.atomic()
    def create(self, validated_data):
        try:
            category      = validated_data.pop("category", None)
            answers       = validated_data.pop("answers", None)
            stacks        = validated_data.pop("stacks", None)
            applyway      = validated_data.pop("applyway", None)
            applyway_info = validated_data.pop("applyway_info", None)
            place         = validated_data.pop("place", None)
            flavor        = validated_data.pop("flavor", None)
            
            category_instance = Category.objects.get(title = category)
            applyway_instance = ApplyWay.objects.get(title = applyway)
            place_instance    = Place.objects.get(title = place)
            flavor_instance   = Flavor.objects.get(title = flavor)
            
            stacks  = json.loads(stacks)
            answers = json.loads(answers)
            
            post = Post.objects.create(
                category = category_instance,
                **validated_data
                )
            if not post:
                raise serializers.ValidationError("post isn't create")
            
            post.postplaces.create(place = place_instance)
            post.postflavors.create(flavor = flavor_instance)
            post.postapplyways.create(applyway = applyway_instance, description = applyway_info)
            [post.poststacks.create(stack = Stack.objects.get(title = stack)) for stack in stacks]
            [post.postanswers.create(
                answer     = Answer.objects.get(description = answer.get("description")),
                is_primary = answer.get("is_primary")
                ) for answer in answers]

            return post
        except ObjectDoesNotExist as e:
            raise serializers.ValidationError(error_message(f'{e}')) 

    class Meta:
        model  = Post
        fields = '__all__'