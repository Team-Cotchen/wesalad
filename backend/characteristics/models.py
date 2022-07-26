from django.db import models

class Question(models.Model):
    content = models.CharField(max_length=300)

    class Meta:
        db_table = 'questions'
        
class Answer(models.Model):
    content     = models.CharField(max_length=300)
    description = models.CharField(max_length=200)
    image_url   = models.CharField(max_length=500)
    question    = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    
    class Meta:
        db_table = 'answers'

class Stack(models.Model):
    title       = models.CharField(max_length=100)
    image_url   = models.CharField(max_length=500)
    description = models.CharField(max_length=200)
    
    class Meta:
        db_table = 'stacks'