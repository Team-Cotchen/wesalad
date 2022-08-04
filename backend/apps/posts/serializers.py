from rest_framework import serializers

from django.db              import transaction
from django.core.exceptions import ObjectDoesNotExist

from apps.characteristics.models import Answer, Stack
from apps.users.models           import User
from .models                     import ApplyWay, Category, Flavor, Place, Post


class PostUserSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    def get_image_url(self, user):
        return user.google_account.image_url
    
    class Meta:
        model  = User
        fields = ['id', 'ordinal_number', 'name', 'image_url']


class PostSerializer(serializers.ModelSerializer):
    category      = serializers.SerializerMethodField()
    post_answer   = serializers.SerializerMethodField()
    post_stack    = serializers.SerializerMethodField()
    post_applyway = serializers.SerializerMethodField()
    post_flavor   = serializers.SerializerMethodField()
    post_place    = serializers.SerializerMethodField()
    user          = PostUserSerializer(required=False)
    
    def get_category(self, post):
        return post.category.title
    
    def get_post_answer(self, post):
        primary_answer   = []
        secondary_answer = []
        postanswers      = post.postanswers.filter(post = post)
        for postanswer in postanswers:
            if postanswer.is_primary:
                primary_answer.append({
                    'id'         : postanswer.answer.id,
                    'description': postanswer.answer.description,
                    'image_url'  : postanswer.answer.image_url
                    })
            else:
                secondary_answer.append({
                    'id'         : postanswer.answer.id,
                    'description': postanswer.answer.description,
                    'image_url'  : postanswer.answer.image_url
                    })

        data = [
            {'primary_answer' : primary_answer},
            {'secondary_answer' : secondary_answer}
        ]
        return data
    
    def get_post_stack(self, post):
        poststacks = post.poststacks.filter(post = post)
        data      = [{
            'id'         : poststack.stack.id,
            'title'      : poststack.stack.title,
            'image_url'  : poststack.stack.image_url,
            'description': poststack.stack.description,
        } for poststack in poststacks]
        return data
    
    def get_post_applyway(self, post):
        postapplyway = post.postapplyways.get(post = post)
        data         = {
            'id'         : postapplyway.applyway.id,
            'title'      : postapplyway.applyway.title,
            'description': postapplyway.description
        }
        return data
    
    def get_post_flavor(self, post):
        postflavor = post.postflavors.get(post = post)
        data       = {
            'id'         : postflavor.flavor.id,
            'title'      : postflavor.flavor.title,
            'description': postflavor.flavor.description,
            'image_url'  : postflavor.flavor.image_url
        }
        return data
    
    def get_post_place(self, post):
        postplace = post.postplaces.get(post = post)
        data      = {
            'id'   : postplace.place.id,
            'title': postplace.place.title
        }
        return data
    
    @transaction.atomic()
    def create(self, validated_data):
        try:
            leftovers = validated_data.pop("leftovers", None)
            answers   = leftovers.get('answers')
            stacks    = leftovers.get('stacks')
            category  = Category.objects.get(title = leftovers.get('category'))
            applyway  = ApplyWay.objects.get(title = leftovers.get('applyway')['title'])
            flavor    = Flavor.objects.get(title = leftovers.get('flavor'))
            place     = Place.objects.get(title = leftovers.get('place'))

            if not answers:
                raise serializers.ValidationError('Answer matching query does not exist.')
            if not stacks:
                raise serializers.ValidationError('Stack matching query does not exist.')
            
            # Post 생성
            post = Post.objects.create(
                category = category,
                **validated_data
            )
            
            # 중간테이블 생성
            [post.postanswers.create(
                answer     = Answer.objects.get(description = answer.get("description")),
                is_primary = answer.get("is_primary")
            ) for answer in answers]
            [post.poststacks.create(stack = Stack.objects.get(title = stack)) for stack in stacks]
            post.postapplyways.create(
                applyway    = applyway,
                description = leftovers.get('applyway')['description']
            )
            post.postplaces.create(place = place)
            post.postflavors.create(flavor = flavor)
            
            return post
        except ObjectDoesNotExist as e:
            raise serializers.ValidationError(f'{e}')
        except KeyError as e:
            raise serializers.ValidationError(f'Key Error : {e}')
    
    @transaction.atomic()
    def update(self, instance, validated_data):
        try:
            leftovers = validated_data.pop("leftovers", None)
            answers   = leftovers.get('answers')
            stacks    = leftovers.get('stacks')
            category  = Category.objects.get(title = leftovers.get('category'))
            applyway  = ApplyWay.objects.get(title = leftovers.get('applyway')['title'])
            flavor    = Flavor.objects.get(title = leftovers.get('flavor'))
            place     = Place.objects.get(title = leftovers.get('place'))
            
            instance.postplaces.all().delete()
            instance.postflavors.all().delete()
            instance.postapplyways.all().delete()
            instance.poststacks.all().delete()
            instance.postanswers.all().delete()
            
            [instance.postanswers.create(
                answer     = Answer.objects.get(description = answer.get("description")),
                is_primary = answer.get("is_primary")
            ) for answer in answers]
            [instance.poststacks.create(stack = Stack.objects.get(title = stack)) for stack in stacks]
            instance.postapplyways.create(
                applyway    = applyway,
                description = leftovers.get('applyway')['description']
            )
            instance.postplaces.create(place = place)
            instance.postflavors.create(flavor = flavor)
            
            updated_instance = Post.objects.filter(id = instance.id)
            updated_instance.update(
                category = category,
                **validated_data
            )
            instance = Post.objects.get(id = instance.id)
            
            return instance
        except ObjectDoesNotExist as e:
            raise serializers.ValidationError(f'{e}')
        except KeyError as e:
            raise serializers.ValidationError(f'Key Error : {e}')

    class Meta:
        model  = Post
        fields = '__all__'