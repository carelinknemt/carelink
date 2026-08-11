<?php

namespace Tests\Support;

use Stripe\Checkout\Session;
use Throwable;

class FakeStripeClient
{
    public function __construct(public FakeStripeCheckoutService $checkout = new FakeStripeCheckoutService) {}
}

class FakeStripeCheckoutService
{
    public function __construct(public FakeStripeSessions $sessions = new FakeStripeSessions) {}
}

class FakeStripeSessions
{
    /** @var array<int, array<string, mixed>> */
    public array $created = [];

    public ?Throwable $createException = null;

    public string $retrievePaymentStatus = 'paid';

    public function create(array $data): Session
    {
        if ($this->createException) {
            throw $this->createException;
        }

        $this->created[] = $data;

        return Session::constructFrom([
            'id' => 'cs_test_fake',
            'url' => 'https://checkout.stripe.com/c/pay/cs_test_fake',
            'payment_status' => 'unpaid',
        ]);
    }

    public function retrieve(string $id): Session
    {
        return Session::constructFrom([
            'id' => $id,
            'url' => 'https://checkout.stripe.com/c/pay/cs_test_fake',
            'payment_status' => $this->retrievePaymentStatus,
        ]);
    }
}
