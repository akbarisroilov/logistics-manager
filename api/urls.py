from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)
from django.urls import path

from core.views import MyTokenObtainPairView
from .views.carriers import carriers
from .views.drivers import drivers, drivers_progress
from .views.users import users
from .views.loads import loads
from .views.trailers import trailers


urlpatterns = [
    # path('test/', views.test),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('drivers/', drivers),
    path('drivers/progress', drivers_progress),
    path('users/', users),
    path('carriers/', carriers),
    path('loads/', loads),
    path('trailers/', trailers),

]