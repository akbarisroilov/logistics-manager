import time
from datetime import datetime
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from ..serializers import LoadSerializer, LoadEditSerializer
from ..models import Driver, Load, EditLoad
from ..functions import check_permission, get_week_start, generate_action


@api_view(['GET', 'POST', 'PUT'])
@permission_classes([IsAuthenticated])
def loads(request):
    time.sleep(0.5)
    if request.method == 'GET':
        if request.GET.get('updates'):
            query = EditLoad.objects.filter(load_id=request.GET.get('updates'))
            serializer = LoadEditSerializer(query, many=True)
        elif request.GET.get('id'):
            query = Load.objects.get(pk=request.GET.get('id'))
            serializer = LoadSerializer(query)
        elif request.GET.get('pagination'):
            paginator = PageNumberPagination()
            paginator.page_size = 18
            load_objects = Load.objects.all().order_by('-time')
            result_page = paginator.paginate_queryset(load_objects, request)
            serializer = LoadSerializer(result_page, many=True)
            return paginator.get_paginated_response(serializer.data)
        else:
            query = Load.objects.all().order_by('-time')
            serializer = LoadSerializer(query, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == "POST":
        data = request.data
        data['user'] = request.user.id
        log_serializer = LoadSerializer(data=data)
        if log_serializer.is_valid():
            new_log = log_serializer.save()
            driver = Driver.objects.get(pk=new_log.driver_id)
            driver.current_load = new_log
            driver.save()
            generate_action(request.user.id, 'cre', new_log.id, 'gro')
            return Response({'success': 'gross has been succesfully added'}, status=status.HTTP_200_OK)
        return Response(log_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'PUT':
        request.data['request_user_id'] = request.user.id
        data = request.data
        log = Load.objects.get(pk=data["id"])
        log_serializer = LoadSerializer(instance=log, data=data)
        if log_serializer.is_valid():
            log_serializer.save()
            return Response({'success': 'the gross has been succesfully updated'}, status=status.HTTP_200_OK)
        return Response(log_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
