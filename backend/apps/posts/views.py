from rest_framework          import generics, status
from rest_framework.views    import APIView
from rest_framework.response import Response

from apps.utils.utils      import error_message
from apps.utils.decorators import check_token
from .filters         import PostListFilterBackend
from .paginations     import PostListPagination
from .models          import Post
from .serializers     import PostSerializer


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
    
    @check_token
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        user      = self.request.user
        data      = self.request.data
        leftovers = {
            "category" : data['category'],
            "answers"  : data['answers'],
            "stacks"   : data['stacks'],
            "applyway" : data['applyway'],
            "flavor"   : data['flavor'],
            "place"    : data['place']
        }
        serializer.save(user=user, leftovers=leftovers)


class PostDetailView(APIView):
    def get(self, request, pk):
        try:
            post       = Post.objects.get(id = pk)
            serializer = PostSerializer(post)
            return Response(serializer.data, status=200)
        except Post.DoesNotExist:
            return Response(error_message("Post does not exist"), status=400)
    
    @check_token
    def put(self, request, pk):
        user = request.user
        try:
            post = Post.objects.get(id = pk, user = user)
        except Post.DoesNotExist:
            return Response(error_message("Post does not exist"), status=400)
        
        category      = request.data.get("category")
        answers       = request.data.get("answers")
        stacks        = request.data.get("stacks")
        applyway      = request.data.get("applyway")
        applyway_info = request.data.get("applyway_info")
        place         = request.data.get("place")
        flavor        = request.data.get("flavor")
        
        serializer = PostSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save(
                user_id       = user.id,
                category      = category,
                answers       = answers,
                stacks        = stacks,
                applyway      = applyway,
                applyway_info = applyway_info,
                place         = place,
                flavor        = flavor
            )
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
    
    @check_token
    def delete(self, request, pk):
        user = request.user
        try:
            post = Post.objects.get(id = pk, user = user)
        except Post.DoesNotExist:
            return Response(error_message("Post does not exist"), status=400)
        
        post.poststacks.all().delete()
        post.postanswers.all().delete()
        post.delete()
        
        return Response(status=204)