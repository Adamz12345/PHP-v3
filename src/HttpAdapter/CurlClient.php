<?php

namespace Flutterwave\HttpAdapter;

use Psr\Http\Message\ResponseFactoryInterface;

class CurlClient implements \Psr\Http\Client\ClientInterface
{
    /**
     * @var ResponseFactoryInterface
     */
    protected ResponseFactoryInterface $responseFactory;

    /**
     * @var array
     */
    protected array $curlOptions;

    public function isCompatible(): bool
    {
        return \extension_loaded('curl');
    }

    public function sendRequest(\Psr\Http\Message\RequestInterface $request): \Psr\Http\Message\ResponseInterface
    {
        if (!$this->isCompatible()) {
            throw new \RuntimeException('You do not have the curl extension enabled or installed.');
        }

        $ch = \curl_init();

        \curl_setopt($ch, CURLOPT_URL, $request->getUri()->__toString());

        \curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        \curl_setopt($ch, CURLOPT_HTTPHEADER, $this->getHeaders($request));

        \curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $request->getMethod());

        \curl_setopt($ch, CURLOPT_POSTFIELDS, $request->getBody()->__toString());

        $response = curl_exec($ch);

        curl_close($ch);

        return $this->createResponse($response);
    }

    private function createResponse($response): \Psr\Http\Message\ResponseInterface
    {
        // Create a Response object from the curl response
        // This is a simplified implementation that assumes successful HTTP responses
        if ($response === false) {
            throw new \RuntimeException('CURL error: ' . curl_error($this->ch));
        }

        // Create a standard PSR-7 Response object
        // Note: This is a basic implementation. In production, use a proper ResponseFactory
        $statusCode = 200;
        $headers = [];
        $body = $response;

        // Create a response stream
        $stream = $this->createStream($body);

        // Return a PSR-7 Response (using a basic implementation)
        return new \GuzzleHttp\Psr7\Response($statusCode, $headers, $stream);
    }

    private function createStream($body)
    {
        $stream = \GuzzleHttp\Psr7\stream_for($body);
        return $stream;
    }

    private function getHeaders(\Psr\Http\Message\RequestInterface $request)
    {
        $headers = [];

        foreach ($request->getHeaders() as $name => $values) {
            $headers[] = $name . ': ' . implode(', ', $values);
        }

        return $headers;
    }
}
