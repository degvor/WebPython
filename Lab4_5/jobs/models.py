from django.db import models
from users.models import User


class Job(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    requirements = models.TextField()
    salary = models.IntegerField()
    employer_id = models.ForeignKey(User, on_delete=models.CASCADE)


