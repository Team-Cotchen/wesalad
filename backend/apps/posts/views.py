from rest_framework          import generics, status
from rest_framework.response import Response

from apps.utils.utils      import error_message
from apps.utils.decorators import check_token
from .filters              import PostListFilterBackend
from .paginations          import PostListPagination
from .models               import Post
from .serializers          import PostSerializer


class PostListView(generics.ListCreateAPIView):
    queryset         = Post.objects.filter(status='active')
    serializer_class = PostSerializer
    pagination_class = PostListPagination
    filter_backends  = [PostListFilterBackend]
    
    def list(self, request):
        queryset   = self.filter_queryset(self.get_queryset())
        page       = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    def perform_create(self, serializer):
        user      = self.request.user
        data      = self.request.data
        leftovers = {
            "category" : data.get('category'),
            "answers"  : data.get('answers'),
            "stacks"   : data.get('stacks'),
            "applyway" : data.get('applyway'),
            "flavor"   : data.get('flavor'),
            "place"    : data.get('place')
        }
        serializer.save(user=user, leftovers=leftovers)

    @check_token
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset         = Post.objects.exclude(status='deleted')
    serializer_class = PostSerializer
    pagination_class = PostListPagination
    
    def get_post_with_check_error(self, post_id, user):
        try:
            post = self.queryset.get(id = post_id)
        except Post.DoesNotExist:
            return None, "Post does not exist"
        if not user == post.user:
            return None, "This user has no permission to post"
        return post, None

    def perform_update(self, serializer):
        data      = self.request.data
        leftovers = {
            "category" : data.get('category'),
            "answers"  : data.get('answers'),
            "stacks"   : data.get('stacks'),
            "applyway" : data.get('applyway'),
            "flavor"   : data.get('flavor'),
            "place"    : data.get('place')
        }
        serializer.save(leftovers=leftovers)

    @check_token
    def update(self, request, pk):
        post, error = self.get_post_with_check_error(pk, request.user)
        if error:
            return Response(error_message(error), status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(post, data=request.data)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @check_token
    def delete(self, request, pk):
        post, error = self.get_post_with_check_error(pk, request.user)
        if error:
            return Response(error_message(error), status=status.HTTP_400_BAD_REQUEST)
        
        post.status = 'deleted'
        post.save()
        return Response(status=status.HTTP_204_NO_CONTENT)