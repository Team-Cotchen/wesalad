from rest_framework import filters


class PostListFilterBackend(filters.BaseFilterBackend):
    
    def filter_queryset(self, request, queryset, view):
        stack     = request.query_params.getlist('stack')
        flavor    = request.query_params.get('flavor')
        # my_answer = request.query_params.get('filter')
        
        if stack:
            queryset = queryset.filter(poststacks__stack__title__in = stack)
        if flavor:
            queryset = queryset.filter(postflavors__flavor__title = flavor)
        # if my_answer == 'recommendation':
        #     if User.objects.filter(id = request.user.id):
        #         my_data  = [my_answer.answer.id for my_answer in request.user.useranswers.all()]
        #         queryset = queryset.filter(postanswers__answer__id__in = my_data)
        
        queryset = queryset.order_by('-created_at')
        return queryset