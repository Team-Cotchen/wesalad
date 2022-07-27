from django.db import models

from apps.users.models           import User
from apps.characteristics.models import Answer, Stack
from apps.utils.timestamp        import TimestampZone


class Category(TimestampZone):
    title = models.CharField(max_length=40)
    
    class Meta:
        db_table = 'categories'

class Post(TimestampZone):
    user            = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    category        = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='posts')
    title           = models.CharField(max_length=200)
    number_of_front = models.CharField(max_length=50)
    number_of_back  = models.CharField(max_length=50)
    period          = models.CharField(max_length=50)
    description     = models.TextField(blank=True, null=True)
    start_date      = models.DateTimeField()
    status          = models.CharField(max_length=50, default='active')
    
    class Meta:
        db_table = 'posts'
        
class ApplyWay(models.Model):
    title = models.CharField(max_length=200)
    
    class Meta:
        db_table = 'applyways'

class Place(models.Model):
    title = models.CharField(max_length=200)
    
    class Meta:
        db_table = 'places'

class Flavor(models.Model):
    title       = models.CharField(max_length=300)
    description = models.CharField(max_length=200)
    image_url   = models.CharField(max_length=500)
    
    class Meta:
        db_table = 'flavors'
        

class PostAnswer(TimestampZone): 
    post       = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='postanswers')
    answer     = models.ForeignKey(Answer, on_delete=models.CASCADE, related_name='postanswers')
    is_primary = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'postanswers'

class PostStack(models.Model):
    post  = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='poststacks')
    stack = models.ForeignKey(Stack, on_delete=models.CASCADE, related_name='poststacks')
    
    class Meta:
        db_table = 'poststacks'
        
class PostApplyWay(models.Model): 
    post        = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='postapplyways')
    applyway    = models.ForeignKey(ApplyWay, on_delete=models.CASCADE, related_name='postapplyways')
    description = models.CharField(max_length=200, blank=True, null=True)
    
    class Meta:
        db_table = 'postapplyways'

class PostPlace(models.Model): 
    post  = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='postplaces')
    place = models.ForeignKey(Place, on_delete=models.CASCADE, related_name='postplaces')
    
    class Meta:
        db_table = 'postplaces'

class PostFlavor(TimestampZone): 
    post       = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='postflavors')
    flavor     = models.ForeignKey(Flavor, on_delete=models.CASCADE, related_name='postflavors')
    
    class Meta:
        db_table = 'postflavors'