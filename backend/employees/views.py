from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.http import HttpResponse
from .models import Employee, Department
from .serializers import EmployeeSerializer, DepartmentSerializer
from .card_generator import generate_business_card

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        qs = Employee.objects.all()
        search = self.request.query_params.get('search')
        dept = self.request.query_params.get('department')
        if search:
            from django.db.models import Q
            qs = qs.filter(
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(position__icontains=search)
            )
        if dept:
            qs = qs.filter(department_id=dept)
        return qs.distinct()

    def create(self, request, *args, **kwargs):
        data = request.data.dict() if hasattr(request.data, 'dict') else dict(request.data)
        # Nettoyer les champs vides
        for key in list(data.keys()):
            if data[key] == '' or data[key] is None:
                if key not in ['first_name', 'last_name', 'position']:
                    data.pop(key)
        # Gérer la photo séparément
        photo = request.FILES.get('photo')
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        if photo:
            instance.photo = photo
            instance.save()
        return Response(EmployeeSerializer(instance).data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data.dict() if hasattr(request.data, 'dict') else dict(request.data)
        photo = request.FILES.get('photo')
        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        if photo:
            instance.photo = photo
            instance.save()
        return Response(EmployeeSerializer(instance).data)

    @action(detail=True, methods=['get'], url_path='business-card')
    def business_card(self, request, pk=None):
        employee = self.get_object()
        lang = request.query_params.get('lang', 'both')
        pdf_buffer = generate_business_card(employee, lang)
        response = HttpResponse(pdf_buffer, content_type='application/pdf')
        name = f"{employee.last_name}_{employee.first_name}".replace(' ', '_')
        response['Content-Disposition'] = f'attachment; filename="carte_{name}.pdf"'
        return response
