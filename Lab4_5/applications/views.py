from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import ApplicationSerializer
from .models import Application
from rest_framework import generics


class ApplicationListView(generics.ListCreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer


class ApplicationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

# class ApplicationView(APIView):
#     def get(self, request):
#         applications = Application.objects.all()
#         serializer = ApplicationSerializer(applications, many=True)
#         return Response({'applications': serializer.data})
#
#     def get(self, request, pk):
#         application = Application.objects.get(pk=pk)
#         serializer = ApplicationSerializer(application)
#         return Response({'application': serializer.data})
#
#     def post(self, request):
#         application = request.data.get('application')
#         serializer = ApplicationSerializer(data=application)
#         if serializer.is_valid(raise_exception=True):
#             application_saved = serializer.save()
#         return Response({"success": "Application '{}' created successfully".format(application_saved.title)})
#
#     def put(self, request, pk):
#         saved_application = Application.objects.get(pk=pk)
#         data = request.data.get('application')
#         serializer = ApplicationSerializer(instance=saved_application, data=data, partial=True)
#         if serializer.is_valid(raise_exception=True):
#             application_saved = serializer.save()
#         return Response({"success": "Application '{}' updated successfully".format(application_saved.title)})
#
#     def delete(self, request, pk):
#         application = Application.objects.get(pk=pk)
#         application.delete()
#         return Response({"message": "Application with id `{}` has been deleted.".format(pk)}, status=204)
