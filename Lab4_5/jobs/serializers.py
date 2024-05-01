from rest_framework import serializers
from .models import Job


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'

    # def create(self, validated_data):
    #     job = Job.objects.create_user(**validated_data)
    #     return job
