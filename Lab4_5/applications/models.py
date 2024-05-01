from django.db import models
from users.models import User
from jobs.models import Job


class Application(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    job_id = models.ForeignKey(Job, on_delete=models.CASCADE)
    status = models.CharField(max_length=20)
