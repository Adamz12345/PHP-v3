<?php

declare(strict_types=1);

namespace Flutterwave\EventHandlers;

use Flutterwave\Contract\ConfigInterface;

class PayoutSubaccoutEventHandler implements EventHandlerInterface
{
    use EventTracker;

    private static ConfigInterface $config;
    public function __construct($config)
    {
        self::$config = $config;
    }

    public function onSuccessful($transactionData): void
    {
        self::sendAnalytics('Initiate-PayoutSubaccount-Success');
    }

    public function onFailure($transactionData): void
    {
        self::sendAnalytics('Initiate-PayoutSubaccount-Failed');
    }

    public function onRequery($transactionReference): void
    {
        self::sendAnalytics('Initiate-PayoutSubaccount-Requery');
    }

    public function onRequeryError($requeryResponse): void
    {
        self::sendAnalytics('Initiate-PayoutSubaccount-Requery-Error');
    }

    public function onCancel($transactionReference): void
    {
        self::sendAnalytics('Initiate-PayoutSubaccount-Cancelled');
    }

    public function onTimeout($transactionReference, $data): void
    {
        self::sendAnalytics('Initiate-PayoutSubaccount-Timeout');
    }
}
