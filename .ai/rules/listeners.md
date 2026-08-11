---
paths:
  - 'app/Listeners/**'
---

# Listeners

## Class-string event listeners must expose handle()
When registering a listener as a class string via Event::listen(Event::class, Listener::class), this Laravel version resolves the method via Str::parseCallback($listener, 'handle') and falls back to __invoke. The old handle{EventShortName} convention is dead — Cashier webhook listeners (StripeEventListener) must define a single handle(WebhookReceived|WebhookHandled $event) method or dispatch crashes with "Call to undefined method ...::__invoke()".
