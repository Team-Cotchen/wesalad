from rest_framework import filters

from apps.characteristics.models import Answer


class PostListFilterBackend(filters.BaseFilterBackend):
    
    def filter_queryset(self, request, queryset, view):
        category_id = request.query_params.get('category')
        flavor_id   = request.query_params.get('flavor')
        stack_id    = request.query_params.getlist('stack')
        user_id     = request.query_params.get('user')
        status      = request.query_params.get('status')
        
        try:
            if category_id:
                queryset = queryset.filter(category = category_id)
            if stack_id:
                queryset = queryset.filter(poststacks__stack_id__in = stack_id)
            if flavor_id:
                queryset = queryset.filter(postflavors__flavor_id = flavor_id)
            if user_id:
                user_answers = Answer.objects.filter(useranswers__user_id = user_id)
                user_data    = [user_answer.id for user_answer in user_answers]
                queryset     = queryset.filter(
                    postanswers__is_primary    = True,
                    postanswers__answer_id__in = user_data
                    )
            if status:
                queryset = queryset.filter(status = 'active')
        except ValueError:
            pass
        queryset = queryset.order_by('status', '-created_at').distinct()
        return queryset