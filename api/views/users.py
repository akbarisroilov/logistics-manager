import time
from datetime import datetime
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from core.serializers import UserSerializer, UserCreateSerializer, UserListSerializer, AppUserSerializer
from core.models import User, Appuser
from ..functions import check_permission, get_week_start, generate_action


@api_view(['GET', 'POST', 'PUT'])
@permission_classes([AllowAny])
def users(request):
    time.sleep(0.5)
    if request.method == 'GET':
        if check_permission(request.user, 'view', 'user'):
            if request.GET.get('id', None):
                user = User.objects.get(pk=request.GET.get('id'))
                serializer = UserSerializer(user)
            elif request.GET.get('list'):
                if request.GET.get('filter'):
                    users = User.objects.values('id', 'username').filter(role=request.GET.get('filter'))
                else:
                    users = User.objects.values('id', 'username').all()
                serializer = UserListSerializer(users, many=True)
            else:
                users = User.objects.all()
                serializer = UserSerializer(users, many=True)            
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'detail': 'you have no access to view users'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'POST':
        if check_permission(request.user, 'create', 'user') and not request.data['role'] == 'OWN':
            user_serializer = UserCreateSerializer(data=request.data)
            appuser_serializer = AppUserSerializer(data=request.data)
            valid_user = user_serializer.is_valid()
            valid_appuser = appuser_serializer.is_valid()
            if valid_user and valid_appuser:
                new_user = user_serializer.save()
                new_appuser = appuser_serializer.save()
                # clone two models 
                new_appuser.user = new_user
                new_appuser.save()
                generate_action(request.user.id, 'cre', new_user.id, 'use')
                return Response({'success': 'user has been succesfully created'}, status=status.HTTP_201_CREATED)
            print('****************************')
            print(user_serializer.errors, appuser_serializer.errors)
            return Response({**user_serializer.errors, **appuser_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'detail': 'you have no access to create user'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'PUT':
        if check_permission(request.user, 'update', 'user') and not request.data['role'] == 'OWN':
            user = User.objects.get(pk=request.data["id"])
            appuser = Appuser.objects.get(user_id=user.id)
            if not request.user == user:
                appuser_serializer = AppUserSerializer(instance=appuser, data=request.data)
                user_serializer = UserSerializer(instance=user, data=request.data)
                valid_appuser = appuser_serializer.is_valid()
                valid_user = user_serializer.is_valid()
                if valid_appuser and valid_user:
                    appuser_serializer.save()
                    updated_user = user_serializer.save()
                    generate_action(request.user.id, 'upd', updated_user.id, 'use')
                    return Response({'success': 'user has been succesfully updated'}, status=status.HTTP_200_OK)
                return Response(user_serializer.errors | appuser_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response({'detail': 'you cannot update yourself'}, status=status.HTTP_403_FORBIDDEN)
        return Response({'detail': 'you have no access to update users'}, status=status.HTTP_403_FORBIDDEN)
