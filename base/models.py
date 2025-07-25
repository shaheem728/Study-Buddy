from django.db import models
from django.contrib.auth.models import User,AbstractUser
# Create your models here.

class User(AbstractUser):
    name = models.CharField(max_length=200, null=True,blank=True)
    email = models.EmailField(unique=True, null=True,blank=True)
    bio = models.TextField(null=True,blank=True)
    avatar = models.ImageField(null=True,blank=True,default='avatar.svg')
   
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username'] 

    def __str__(self):
        return self.email
    
class Topic(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Room(models.Model):
    host = models.ForeignKey(User, on_delete=models.SET_NULL,null=True)
    topic = models.ForeignKey(Topic, on_delete=models.SET_NULL,null=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True,null=True)
    participants = models.ManyToManyField(User,related_name='participants',blank=True)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ["-updated","-created"]
    def __str__(self):
        return self.name
    
class Message(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    body = models.TextField(blank=True, null=True)  # Allow blank body for file-only messages
    file = models.FileField(upload_to='uploads/', blank=True, null=True)  # Optional file upload
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-updated", "-created"]
        
    def __str__(self):
        if self.body:
            return self.body[:50]
        if self.file:
            return self.file.name
        return "Empty Message"
    