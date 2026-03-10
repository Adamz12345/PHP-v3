<?php

declare(strict_types=1);

namespace Flutterwave\EventHandlers;

use Flutterwave\Contract\ConfigInterface;

class PreEventHandler implements EventHandlerInterface
{
    use EventTracker;

    private static ConfigInterface $config;
    public function __construct($config)
    {
        self::$config = $config;
    }

    public function onSuccessful($transactionData): void
    {
        self::sendAnalytics('Initiate-Preauth');
    }

    public function onFailure($transactionData): void
    {
        self::sendAnalytics('Initiate-Preauth-Error');
    }

    public function onRequery($transactionReference): void
    {
        self::sendAnalytics('Preauth-Requery');
    }

    public function onRequeryError($requeryResponse): void
    {
        self::sendAnalytics('Preauth-Requery-Error');
    }

    public function onCancel($transactionReference): void
    {
        self::sendAnalytics('Preauth-Cancelled');
    }

    public function onTimeout($transactionReference, $data): void
    {
        self::sendAnalytics('Preauth-Timeout');
    }
}
