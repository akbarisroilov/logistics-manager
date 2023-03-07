import time
from datetime import datetime
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from ..serializers import DriverSerializer, DriverListSerializer, DriverEditSerializer, DriverActivitySerializer, LoadSerializer
from ..models import Driver, EditDriver , Carrier, Load
from ..functions import check_permission, get_week_start, generate_action


@api_view(['GET', 'POST', 'PUT'])
@permission_classes([AllowAny])
def drivers(request):
    time.sleep(0.5)
    if request.method == 'GET':
        if check_permission(request.user, 'view', 'driver'):
            if request.GET.get('list'):
                query = Driver.objects.values('id', 'first_name', 'last_name').all()
                serializer = DriverListSerializer(query, many=True)
            elif request.GET.get('updates'):
                query = EditDriver.objects.filter(driver_id=request.GET.get('updates'))
                serializer = DriverEditSerializer(query, many=True)
            elif request.GET.get('id'):
                query = Driver.objects.get(pk=request.GET.get('id'))
                serializer = DriverSerializer(query)
                if query.current_load:
                    load = Load.objects.get(pk=query.current_load_id)
                    load_serializer = LoadSerializer(load)
                    carrier_name = Carrier.objects.values('name').get(pk=load.carrier_id)['name']
                    return Response({**serializer.data, 'load': load_serializer.data, 'carrier_name': carrier_name}, status=status.HTTP_200_OK)
            else:
                query = Driver.objects.all()
                serializer = DriverSerializer(query, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'detail': 'you have no access to view drivers'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'POST':
        if check_permission(request.user, 'create', 'driver'):
            driver_serializer = DriverSerializer(data=request.data)
            if driver_serializer.is_valid():
                new_driver = driver_serializer.save()
                generate_action(request.user.id, 'cre', new_driver.id, 'dri')
                return Response({'success': 'driver has been succesfully created'}, status=status.HTTP_201_CREATED)
            return Response(driver_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'detail': 'you have no access to create a driver'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'PUT':
        if check_permission(request.user, 'update', 'driver'):
            request.data['request_user_id'] = request.user.id
            driver = Driver.objects.get(pk=request.data["id"])
            driver_serializer = DriverSerializer(instance=driver, data=request.data)
            if driver_serializer.is_valid():
                driver_serializer.save()
                return Response({'success': 'driver has been succesfully updated'}, status=status.HTTP_200_OK)
            return Response(driver_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'detail': 'you have no access to update a driver'}, status=status.HTTP_403_FORBIDDEN)


@api_view(['GET'])
@permission_classes([AllowAny])
def drivers_progress(request):
    query = EditDriver.objects.values('status', 'edit_time').filter(driver_id=request.GET.get('id'), edit_time__gte=request.GET.get('from'), edit_time__lte=request.GET.get('to'))
    serializer = DriverActivitySerializer(query, many=True)
    # 'from': datetime.strptime(request.GET.get('from'), '%Y-%M-%d'),
    # 'to': datetime.strptime(request.GET.get('to'), '%Y-%M-%d'),
    return Response(serializer.data, status=status.HTTP_200_OK)
