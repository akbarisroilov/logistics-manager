import time
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from ..models import Trailer
from ..serializers import TrailerSerializer, TrailerListSerializer
from ..functions import check_permission, generate_action


@api_view(['GET', 'POST', 'PUT'])
@permission_classes([AllowAny])
def trailers(request):
    time.sleep(0.5)
    if request.method == 'GET':
        if check_permission(request.user, 'view', 'trailer'):
            if request.GET.get('id', None):
                trailer = Trailer.objects.get(pk=request.GET.get('id'))
                serializer = TrailerSerializer(trailer)
            elif request.GET.get('list'):
                if request.GET.get('filter'):
                    trailers = Trailer.objects.values('id', 'number').filter(role=request.GET.get('filter'))
                else:
                    trailers = Trailer.objects.values('id', 'number').all()
                serializer = TrailerListSerializer(trailers, many=True)
            else:
                trailers = Trailer.objects.all()
                serializer = TrailerSerializer(trailers, many=True)            
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'detail': 'you have no access to view trailers'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'POST':
        if check_permission(request.user, 'create', 'trailer'):
            serializer = TrailerSerializer(data=request.data)
            if serializer.is_valid():
                new_trailer = serializer.save()
                generate_action(request.user.id, 'cre', new_trailer.id, 'tra')
                return Response({'success': 'trailer has been succesfully created'}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'detail': 'you have no access to create trailer'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'PUT':
        if check_permission(request.user, 'update', 'trailer'):
            request.data['request_user_id'] = request.user.id
            trailer = Trailer.objects.get(pk=request.data["id"])
            serializer = TrailerSerializer(instance=trailer, data=request.data)
            if serializer.is_valid():
                updated_trailer = serializer.save()
                generate_action(request.user.id, 'upd', updated_trailer.id, 'tra')
                return Response({'success': 'trailer has been succesfully updated'}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'detail': 'you have no access to update trailer'}, status=status.HTTP_403_FORBIDDEN)