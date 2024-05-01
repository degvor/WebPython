from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer
from .models import User
from rest_framework import generics
# Create your views here.


class UserListView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# class UserView(APIView):
#     def get(self, request):
#         users = User.objects.all()
#         serializer = UserSerializer(users, many=True)
#         return Response({'users': serializer.data})
#
#     def get(self, request, pk):
#         user = User.objects.get(pk=pk)
#         serializer = UserSerializer(user)
#         return Response({'user': serializer.data})
#
#     def post(self, request):
#         user = request.data.get('user')
#         serializer = UserSerializer(data=user)
#         if serializer.is_valid(raise_exception=True):
#             user_saved = serializer.save()
#         return Response({"success": "User '{}' created successfully".format(user_saved.username)})
#
#     def put(self, request, pk):
#         saved_user = User.objects.get(pk=pk)
#         data = request.data.get('user')
#         serializer = UserSerializer(instance=saved_user, data=data, partial=True)
#         if serializer.is_valid(raise_exception=True):
#             user_saved = serializer.save()
#         return Response({"success": "User '{}' updated successfully".format(user_saved.username)})
#
#     def delete(self, request, pk):
#         user = User.objects.get(pk=pk)
#         user.delete()
#         return Response({"message": "User with id `{}` has been deleted.".format(pk)}, status=204)
