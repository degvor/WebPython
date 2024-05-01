from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import JobSerializer
from .models import Job
from rest_framework import generics


class JobListView(generics.ListCreateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer


class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

# class JobView(APIView):
#     def get(self, request):
#         jobs = Job.objects.all()
#         serializer = JobSerializer(jobs, many=True)
#         return Response({'jobs': serializer.data})
#
#     def get(self, request, pk):
#         job = Job.objects.get(pk=pk)
#         serializer = JobSerializer(job)
#         return Response({'job': serializer.data})
#
#     def post(self, request):
#         job = request.data.get('job')
#         serializer = JobSerializer(data=job)
#         if serializer.is_valid(raise_exception=True):
#             job_saved = serializer.save()
#         return Response({"success": "Job '{}' created successfully".format(job_saved.title)})
#
#     def put(self, request, pk):
#         saved_job = Job.objects.get(pk=pk)
#         data = request.data.get('job')
#         serializer = JobSerializer(instance=saved_job, data=data, partial=True)
#         if serializer.is_valid(raise_exception=True):
#             job_saved = serializer.save()
#         return Response({"success": "Job '{}' updated successfully".format(job_saved.title)})
#
#     def delete(self, request, pk):
#         job = Job.objects.get(pk=pk)
#         job.delete()
#         return Response({"message": "Job with id `{}` has been deleted.".format(pk)}, status=204)


