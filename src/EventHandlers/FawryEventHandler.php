<?php

namespace Flutterwave\EventHandlers;

use Flutterwave\Contract\ConfigInterface;

class FawryEventHandler implements EventHandlerInterface
{
    use EventTracker;

    private static ConfigInterface $config;
    public function __construct($config)
    {
        self::$config = $config;
    }

    public function onSuccessful($transactionData): void
    {
        self::sendAnalytics('Initiate-Fawry-Success');
    }

    public function onFailure($transactionData): void
    {
        self::sendAnalytics('Initiate-Fawry-Failed');
    }

    public function onRequery($transactionReference): void
    {
        self::sendAnalytics('Initiate-Fawry-Requery');
    }

    public function onRequeryError($requeryResponse): void
    {
        self::sendAnalytics('Initiate-Fawry-Requery-Error');
    }

    public function onCancel($transactionReference): void
    {
        self::sendAnalytics('Initiate-Fawry-Cancelled');
    }

    public function onTimeout($transactionReference, $data): void
    {
        self::sendAnalytics('Initiate-Fawry-Timeout');
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

        if (is_array($resource) && ! empty($resource)) {
            $logger = $resource['logger'];
            $logger->notice('Fawry Method Event::Fawry Authorization Mode: ' . $data['mode'] ?? 'fawry_pay');
        }

        return $data;
    }
}
