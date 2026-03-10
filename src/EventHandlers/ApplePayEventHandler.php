<?php

declare(strict_types=1);

namespace Flutterwave\EventHandlers;

use Flutterwave\Contract\ConfigInterface;

class ApplePayEventHandler implements EventHandlerInterface
{
    use EventTracker;

    private static ConfigInterface $config;
    public function __construct($config)
    {
        self::$config = $config;
    }

    public function onSuccessful($transactionData): void
    {
        self::sendAnalytics('Initiate-ApplePay-Success');
    }

    public function onFailure($transactionData): void
    {
        self::sendAnalytics('Initiate-ApplePay-Failed');
    }

    public function onRequery($transactionReference): void
    {
        self::sendAnalytics('Initiate-ApplePay-Requery');
    }

    public function onRequeryError($requeryResponse): void
    {
        self::sendAnalytics('Initiate-ApplePay-Requery-Error');
    }

    public function onCancel($transactionReference): void
    {
        self::sendAnalytics('Initiate-ApplePay-Cancelled');
    }

    public function onTimeout($transactionReference, $data): void
    {
        self::sendAnalytics('Initiate-ApplePay-Timeout');
    }

    public function onAuthorization(\stdClass $response, ?array $resource = null): array
    {
        if (property_exists($response, 'data')) {
            $transactionId = $response->data->id;
            $tx_ref = $response->data->tx_ref;
            $data['data_to_save'] = [
                'transactionId' => $transactionId,
                'tx_ref' => $tx_ref,
            ];
            $data['mode'] = $response->data->meta->authorization->mode;
        }

        $data['dev_instruction'] = 'Redirect the user to the auth link for validation. verfiy via the verify endpoint.';
        $data['url'] = $response->data->meta->authorization->redirect;

        if (is_array($resource) && ! empty($resource)) {
            $logger = $resource['logger'];
            $logger->notice('Apple Method Event::Apple Authorization Mode: ' . $data['mode'] ?? 'redirect');
        }

        return $data;
    }
}
