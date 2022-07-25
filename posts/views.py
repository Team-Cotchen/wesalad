from rest_framework          import generics
from rest_framework.views    import APIView
from rest_framework.response import Response

from utils.utils      import error_message
from utils.decorators import check_token
from .filters         import PostListFilterBackend
from .paginations     import PostListPagination
from .models          import Post
from .serializers     import PostCreateSerializer, PostSerializer


class PostListView(generics.ListAPIView):
    queryset         = Post.objects.select_related('user', 'category')\
                        .prefetch_related('postanswers__answer', 'poststacks__stack').all()
    serializer_class = PostSerializer
    pagination_class = PostListPagination
    filter_backends  = [PostListFilterBackend]
    
    def list(self, request):
        queryset   = self.filter_queryset(self.get_queryset())
        page       = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)


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
        
        

class PostCreateView(APIView):
    @check_token
    def post(self, request):
        category      = request.data.get("category")
        answers       = request.data.get("answers")
        stacks        = request.data.get("stacks")
        applyway      = request.data.get("applyway")
        applyway_info = request.data.get("applyway_info")
        place         = request.data.get("place")
        flavor        = request.data.get("flavor")
        
        serializer = PostCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(
                user_id       = request.user.id,
                category      = category,
                answers       = answers,
                stacks        = stacks,
                applyway      = applyway,
                applyway_info = applyway_info,
                place         = place,
                flavor        = flavor
            )
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
