import time
from datetime import datetime
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from ..serializers import CarrierSerializer, CarrierListSerializer, CarrierEditSerializer, LoadSerializer, LoadEditSerializer
from ..models import Carrier, EditCarrier
from ..functions import check_permission, get_week_start, generate_action


@api_view(['GET', 'POST', 'PUT'])
@permission_classes([AllowAny])
def carriers(request):
    time.sleep(0.5)
    if request.method == 'GET':
        if check_permission(request.user, 'view', 'carrier'):
            if request.GET.get('list'):
                query = Carrier.objects.values('id', 'name').all()
                serializer = CarrierListSerializer(query, many=True)
            elif request.GET.get('updates'):
                query = EditCarrier.objects.filter(carrier_id=request.GET.get('updates'))
                serializer = CarrierEditSerializer(query, many=True)
            else:
                query = Carrier.objects.all()
                serializer = CarrierSerializer(query, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'detail': 'you have no access to view carriers'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'POST':
        if check_permission(request.user, 'create', 'carrier'):
            serializer = CarrierSerializer(data=request.data)
            if serializer.is_valid():
                new_carrier = serializer.save()
                generate_action(request.user.id, 'cre', new_carrier.id, 'car')
                return Response({'success': 'carrier has been succesfully created'}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'detail': 'you have no access to create a carrier'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'PUT':
        if check_permission(request.user, 'update', 'carrier'):
            request.data['request_user_id'] = request.user.id
            carrier = Carrier.objects.get(pk=request.data["id"])
            serializer = CarrierSerializer(instance=carrier, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({'success': 'carrier has been succesfully updated'}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'detail': 'you have no access to update a carrier'}, status=status.HTTP_403_FORBIDDEN)
    