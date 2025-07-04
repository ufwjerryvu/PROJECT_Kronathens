from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json

@csrf_exempt
@require_http_methods(["POST"])
def button_pressed(request):
    try:
        data = json.loads(request.body)
        device_id = data.get('device_id')
        
        if not device_id:
            return JsonResponse({'error': 'device_id required'}, status=400)
        
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'bullying_notifications',
            {
                'type': 'send_notification',
                'message': {
                    'device_id': device_id,
                    'timestamp': str(timezone.now()),
                    'message': f'Bullying report from device {device_id}'
                }
            }
        )
        
        return JsonResponse({'status': 'success'})
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)