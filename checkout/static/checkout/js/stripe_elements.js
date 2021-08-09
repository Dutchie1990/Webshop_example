var stripePublicKey = $('#id_stripe_public_key').text().slice(1, -1);
var clientSecret = $('#id_client_secret').text().slice(1, -1);
var stripe = Stripe(stripePublicKey);
elements = stripe.elements();

var style = {
    base: {
        color: "#000",
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
            color: "#aab7c4"
        }
    },
    invalid: {
        fontFamily: 'Arial, sans-serif',
        color: "#dc3545",
        iconColor: "#dc3545"
    }
};

var card = elements.create("card", {
    style: style
});
card.mount('#card-element');

// handle realtime validation errors
card.addEventListener('change', function (event) {
    var errorDiv = document.getElementById('card-errors')
    if (event.error) {
        var html = `
                <span class="icon" role="alert">
                <i class="fas fa-times"></i>
                </span>
                <span>${event.error.message}</span>`
        $(errorDiv).html(html);
    } else {
        errorDiv.textContent = "";
    }
})

//handle submit

var form = document.getElementById('payment-form');

form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    card.update({
        'disabled': true
    })
    $('#submit-button').attr('disabled', true)
    $('payment-form').fadeToggle(100);
    $('loading-overlay').fadeToggle(100);
    // If the client secret was rendered server-side as a data-secret attribute
    // on the <form> element, you can retrieve it here by calling `form.dataset.secret`
    stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: card,
        }
    }).then(function (result) {
        if (result.error) {
            // Show error to your customer (e.g., insufficient funds)
            var errorDiv = document.getElementById('card-errors');
            var html = `
      <span class="icon" role="alert">
      <i class="fas fa-times"></i>
      </span>
      <span>${result.error.message}</span>`
            $(errorDiv).html(html);
            card.update({
                'disabled': false
            })
            $('#submit-button').attr('disabled', false)
            $('payment-form').fadeToggle(100);
            $('loading-overlay').fadeToggle(100);

        } else {
            // The payment has been processed!
            if (result.paymentIntent.status === 'succeeded') {
                form.submit();
            }
        }
    });
});