from django.http import HttpResponse


class StripeWH_Handler:
    """
    Handle Stripe Webhooks
    """

    def __init__(self, request):
        self.request = request

    def handle_event(self, event):
        """
        Handle a generic, unknown event from stripe
        """

        return HttpResponse(
            content=f'Unhandled webhook received: {event["type"]}',
            status=200
        )
    
    def handle_payment_intent_succeeded(self, event):
        """
        Handle a payment_intent_succeeded event from stripe
        """
        intent = event.data.object 
        print(intent)
        
        return HttpResponse(
            content=f'Webhook received: {event["type"]}',
            status=200
        )
    
    def handle_payment_intent_failed(self, event):
        """
        Handle a payment_intent_failed event from stripe
        """

        return HttpResponse(
            content=f'Webhook received: {event["type"]}',
            status=200
        )