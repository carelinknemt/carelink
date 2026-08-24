<?php

test('the passkey well-known endpoint advertises the security page', function () {
    $this->get('/.well-known/passkey-endpoints')
        ->assertOk()
        ->assertJson([
            'enroll' => route('security.edit'),
            'manage' => route('security.edit'),
        ]);
});
