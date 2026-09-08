<?php

use App\Cms\FareEstimate;

test('ambulatory estimate uses the ambulatory base and mileage rates with the first five miles included', function () {
    expect(FareEstimate::amountInCents('ambulatory', 5))->toBe(2000);
    expect(FareEstimate::amountInCents('ambulatory', 8))->toBe(2750);
    expect(FareEstimate::amountInDollars('ambulatory', 2))->toBe('20.00');
});

test('wheelchair estimate uses the wheelchair base and mileage rates with the first five miles included', function () {
    expect(FareEstimate::amountInCents('wheelchair', 5))->toBe(4500);
    expect(FareEstimate::amountInCents('wheelchair', 1))->toBe(4500);
    expect(FareEstimate::amountInCents('wheelchair', 10))->toBe(6250);
    expect(FareEstimate::amountInDollars('wheelchair', 10))->toBe('62.50');
});

test('every wheelchair-style vehicle is priced as the wheelchair service', function (string $transportType) {
    expect(FareEstimate::amountInCents($transportType, 6))->toBe(4850);
})->with(['wheelchair', 'wheelchair xl', 'broda chair', 'geri chair']);
